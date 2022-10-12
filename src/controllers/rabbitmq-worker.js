const amqp = require("amqplib/callback_api");

class RabbitMQWorker {
  config;

  logger;

  jobRunner;

  puppeteerClient;

  constructor() {
    this.workerId = `worker${Date.now()}}`;
  }

  getWorkerId() {
    return this.workerId;
  }

  start() {
    const logger = this.getLogger();
    const config = this.getConfig();
    const workerId = this.getWorkerId();
    const jobRunner = this.getJobRunner();
    const newJobQueue = "newJob";
    const workerStatusExchange = "workerStatus";
    const newJobResultExchange = "newJobResult";

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

        channel.prefetch(1);
        channel.assertExchange(workerStatusExchange, "fanout", { durable: false });
        channel.assertExchange(newJobResultExchange, "fanout", { durable: false });
        channel.assertQueue(newJobQueue, null, (error2, q) => {
          if (error2) {
            logger.error(error2);
            return;
          }

          channel.consume(q.queue, async (msg) => {
            logger.info(`RabbitMQ: Received ${msg.fields.routingKey} ${msg.content.toString()}`);
            try {
              const job = JSON.parse(msg.content.toString());
              const logs = await jobRunner.run(job);
              channel.publish(newJobResultExchange, "", Buffer.from(JSON.stringify({ data: logs })));
            } catch (err) {
              logger.error(err);
              channel.publish(newJobResultExchange, "", Buffer.from(JSON.stringify({
                err: {
                  name: err.name,
                  message: err.message,
                  stack: err.stack.split("\n"),
                },
              })));
            }
            channel.ack(msg);
          }, { noAck: false });
        });
      });
    });
  }
}

module.exports = RabbitMQWorker;
