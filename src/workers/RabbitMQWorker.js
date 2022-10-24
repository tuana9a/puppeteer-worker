const amqp = require("amqplib/callback_api");
const toPrettyErr = require("../common/toPrettyErr");
const toBuffer = require("../common/toBuffer");

const NEW_JOB = "jobs.new";
const JOB_RESULT = "jobs.result";
const WORKER_FEEDBACK = "worker.feedback";
const DOING = "doing";
const PING = "ping";

class RabbitMQWorker {
  config;

  logger;

  doJob;

  puppeteerClient;

  getWorkerId() {
    return this.config.workerId;
  }

  start() {
    const logger = this.getLogger();
    const config = this.getConfig();
    const workerId = this.getWorkerId();
    const doJob = this.getDoJob();

    amqp.connect(config.rabbitmqConnectionString, (error0, connection) => {
      if (error0) {
        logger.error(error0);
        return;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          logger.error(error1);
          return;
        }
        const doing = (data) => channel.publish(WORKER_FEEDBACK, DOING, toBuffer({ workerId: workerId, data: data }));

        channel.prefetch(1);
        channel.assertExchange(WORKER_FEEDBACK, "topic", { durable: false });
        channel.assertQueue(JOB_RESULT);
        channel.assertQueue(NEW_JOB, null, (error2, q) => {
          if (error2) {
            logger.error(error2);
            return;
          }

          channel.consume(q.queue, async (msg) => {
            try {
              const job = JSON.parse(msg.content.toString());
              logger.info(`Received: ${msg.fields.routingKey} ${JSON.stringify(job, null, 2)}`);
              const logs = await doJob.do(job);
              channel.sendToQueue(JOB_RESULT, toBuffer({
                id: job.id,
                workerId: workerId,
                logs: logs,
              }));
            } catch (err) {
              logger.error(err);
              channel.sendToQueue(JOB_RESULT, toBuffer({
                workerId: workerId,
                err: toPrettyErr(err),
              }));
            }
            channel.ack(msg);
          }, { noAck: false });
        });
        setInterval(() => {
          channel.publish(WORKER_FEEDBACK, PING, toBuffer({ workerId: workerId }));
        }, 3000);
      });
    });
  }
}

module.exports = RabbitMQWorker;
