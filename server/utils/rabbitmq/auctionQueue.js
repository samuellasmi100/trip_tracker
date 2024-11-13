const RabbitMQConnectionManager = require("../../message_stream/RabbitMQConnectionManager");
const AUCTION_BOND = process.env.AUCTION_BOND;
const BOND_AUCTION = process.env.BOND_AUCTION;
const RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME;

const POOL_REQ = {};


const addRequest = (req_id, data) => {
  POOL_REQ[req_id] = data;
  return;
};

const getAndDeleteRequestById = (id) => {
  const copyObject = POOL_REQ[id];
  delete POOL_REQ[id];
  return copyObject;
};

const cleanPoolRequests = () => {
  setInterval(() => {
    const sessions = Object.entries(POOL_REQ);
    for (const [key, value] of sessions) {
      if (moment().isAfter(value.expired_at)) {
        delete POOL_REQ[key];
      }
    }
  }, 1000);
};

const initQueue = async () => {
  try {
    const handleMessageFromQueue = async (data) => {
      data = JSON.parse(data.content.toString());
      
      returnMessageToClient(data);
      return;
    };
    RabbitMQConnectionManager.listenToQueueMessages(
      RABBIT_MQ_INSTANCE_NAME,
      AUCTION_BOND,
      handleMessageFromQueue
    );
  } catch (error) {
    console.log(`failed to init api_key queue, error: ${error}`);
  }
};

function getObjectByWsId(object, wsId) {
  return object[wsId];
}

const returnMessageToClient = async (msg) => {
 
  const result = getAndDeleteRequestById(msg.id);
  if (result && result.res) {
    const { res } = result;
  if (res && msg.error === true) {
    res.status(msg.code).send("Something went wrong please try again")
  }else {
    res.status(msg.code).send("Transaction added successfully")
  }
}
};

const sendMessageToQueue = async (data) => {
  try {
    RabbitMQConnectionManager.pushMessageToQueue(
      RABBIT_MQ_INSTANCE_NAME,
      BOND_AUCTION,
      JSON.stringify(data)
    );
  } catch (error) {
    console.log(`failed to init api_key queue, error: ${error}`);
  }
};

module.exports = {
  addRequest,
  initQueue,
  sendMessageToQueue,
};
