const amqp = require("amqplib/callback_api");

class RabbitMQWorker {
  constructor({ config, logger, puppeteerClient, jobTemplateDb, jobRunner }) {
    this.config = config;
    this.logger = logger;
    this.jobTemplateDb = jobTemplateDb;
    this.jobRunner = jobRunner;
    this.puppeteerClient = puppeteerClient;
    this.workerId = String(Math.random() * Date.now());
  }

  start() {
    const { config, workerId } = this;
    const { rabbitmqConnectionString } = config;
    const newJobExchange = "new_job";
    const workerRegisterExchange = "puppeter_worker_register";

    amqp.connect(rabbitmqConnectionString, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        channel.assertExchange(newJobExchange, "direct", {
          durable: false,
        });

        channel.assertExchange(workerRegisterExchange, "fanout", {
          durable: false,
        });

        channel.assertQueue(
          workerId,
          {
            exclusive: true,
          },
          (error2, q) => {
            if (error2) {
              throw error2;
            }
            console.log(" [*] Waiting for logs. To exit press CTRL+C");

            channel.bindQueue(q.queue, newJobExchange, workerId);

            channel.consume(
              q.queue,
              (msg) => {
                console.log(
                  " [x] %s: '%s'",
                  msg.fields.routingKey,
                  msg.content.toString(),
                );
                channel.ack(msg);
              },
              {
                noAck: false,
              },
            );
          },
        );
      });
    });
  }
}

module.exports = RabbitMQWorker;
