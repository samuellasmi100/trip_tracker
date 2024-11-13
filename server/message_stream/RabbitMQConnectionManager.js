const amqp = require("amqplib");
const path = require("path");
const fs = require("fs/promises");
const logger = require("../utils/Logger");
let _rabbitConnections = {};
let _connectionsListeners = {};
let RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME;

const initialize = async () => {
  try {
    if (!(Object.keys(_rabbitConnections).length === 0)) {
      return;
    }
    await addNewConnection(RABBIT_MQ_INSTANCE_NAME);
  } catch (error) {
    console.log(`Failed to initialize all queue ${error}`);
  }
};

const addNewConnection = async (RABBIT_MQ_INSTANCE_NAME) => {
  try {
    const connectionUrl = process.env.RABBIT_URL_CONNECTION;
    const connection = await amqp.connect(connectionUrl);

    connection.on("error", (error) => {
      if (error.message !== "Connection closing") {
        console.log(
          `Message Broker Connection Error: ${error.message}, stack: ${error.stack}`
        );
      }
    });

    connection.on("close", async (err) => {
      logger.info("Message Broker Connection closed, trying to reconnect...");
      await addNewConnection(RABBIT_MQ_INSTANCE_NAME);
    });

    connection.on("blocked", (reason) => {
      console.log(`AMQP connection is blocked reason: ${reason}.`);
    });

    const channel = await connection.createChannel();

    _rabbitConnections[RABBIT_MQ_INSTANCE_NAME] = channel;
    logger.info(
      `Connection to Rabbit instance: ${RABBIT_MQ_INSTANCE_NAME} created successfully`
    );

    if (_connectionsListeners[RABBIT_MQ_INSTANCE_NAME]) {
      for (const connectionListener of _connectionsListeners[
        RABBIT_MQ_INSTANCE_NAME
      ]) {
        await listenToQueueMessages(
          RABBIT_MQ_INSTANCE_NAME,
          connectionListener.queue,
          connectionListener.listenerCallback
        );
      }
    } else {
      _connectionsListeners[RABBIT_MQ_INSTANCE_NAME] = [];
    }
  } catch (error) {
    console.log(error);
    setTimeout(async () => {
      await addNewConnection(RABBIT_MQ_INSTANCE_NAME);
    }, 1000);
  }
};

const listenToQueueMessages = async (instanceName, queueName, callback) => {
  try {
    if (!_rabbitConnections[instanceName]) {
      throw `Rabbit instance with name: ${instanceName} is missing`;
    }

    await _rabbitConnections[instanceName].assertQueue(
      queueName,
      { durable: true },
      (error) => {
        console.log(`[QUEUE NAME: ${queueName}], error: ${error}`);
      }
    );
    await _rabbitConnections[instanceName].consume(queueName, callback, {
      noAck: true,
    });
    if (_connectionsListeners[instanceName]) {
      if (
        !_connectionsListeners[instanceName].some(
          (instance) => instance.queue === queueName
        )
      ) {
        _connectionsListeners[instanceName] = [
          ..._connectionsListeners[instanceName],
          {
            queue: queueName,
            listenerCallback: callback,
          },
        ];
      }
    }
    console.info(
      `Rabbit connection ${instanceName} start Listening to queue: ${queueName}`
    );
  } catch (error) {
    console.log(error);
  }
};

const pushMessageToQueue = async (instanceName, queueName, message) => {
  try {
    if (!_rabbitConnections[instanceName]) {
      console.log(`Rabbit instance with name: ${instanceName} is missing`);
      throw `Rabbit instance with name: ${instanceName} is missing`;
    }
    await _rabbitConnections[instanceName].assertQueue(
      queueName,
      { durable: true },
      (error) => {
        console.log(
          `[QUEUE NAME: ${queueName}] MESSAGE: ${message}, error: ${error}`
        );
      }
    );
    await _rabbitConnections[instanceName].sendToQueue(
      queueName,
      Buffer.from(message)
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addNewConnection,
  pushMessageToQueue,
  initialize,
  listenToQueueMessages,
};
