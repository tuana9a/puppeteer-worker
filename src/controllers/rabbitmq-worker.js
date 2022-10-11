const amqp = require("amqplib/callback_api");

class RabbitMQWorker {
  config;

  logger;

  jobTemplateDb;

  jobRunner;

  puppeteerClient;

  constructor() {
    this.workerId = `puppeteer_worker_${Date.now()}_${(Math.round(Math.random() * 1000))}`;
  }

  getWorkerId() {
    return this.workerId;
  }

  start() {
    const logger = this.getLogger();
    const config = this.getConfig();
    const workerId = this.getWorkerId();
    const jobRunner = this.getJobRunner();
    const jobTemplateDb = this.getJobTemplateDb();
    const newJobQueue = "new_job";
    const workerRegisterExchange = "puppeter_worker_register";
    const submitJobResultExchange = "submit_job_result";

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
        channel.assertExchange(workerRegisterExchange, "fanout", { durable: false });
        channel.assertExchange(submitJobResultExchange, "fanout", { durable: false });
        channel.assertQueue(newJobQueue, null, (error2, q) => {
          if (error2) {
            logger.error(error2);
            return;
          }

          logger.info("Waiting for jobs. To exit press CTRL+C");
          channel.consume(q.queue, async (msg) => {
            logger.info(`Received RabbitMQ ${msg.fields.routingKey} ${msg.content.toString()}`);
            try {
              const job = JSON.parse(msg.content.toString());
              if (!job) {
                channel.ack(msg);
                return;
              }

              const params = job.input || job.params;
              const mJob = jobTemplateDb.get(job.id);

              logger.info(`Doing Job: id: "${job.id}" params: "${JSON.stringify(params)}"`);

              if (!mJob) {
                logger.warn(`Job not found ${job.id}`);
              }

              const logs = await jobRunner.run(mJob, params);

              channel.publish(submitJobResultExchange, "", Buffer.from(JSON.stringify({ data: logs })));
            } catch (err) {
              logger.error(err);
            }
            channel.ack(msg);
          }, { noAck: false });
        });
      });
    });
  }
}

module.exports = RabbitMQWorker;
