const RabbitMQConnectionManager = require("../../message_stream/RabbitMQConnectionManager")
const BONDS_BOND = process.env.BONDS_BOND
const BOND_BONDS = process.env.BOND_BONDS
const RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST
const redisGroup = require("../../redis/redisGroup")
const logger = require("../Logger")
const POOL_REQ = {}

const addRequest = (req_id, data) => {
  POOL_REQ[req_id] = data
  return
}

const getAndDeleteRequestById = (id) => {
  const copyObject = POOL_REQ[id]
  delete POOL_REQ[id]
  return copyObject
}

const cleanPoolRequests = () => {
  setInterval(() => {
    const sessions = Object.entries(POOL_REQ)
    for (const [key, value] of sessions) {
      if (moment().isAfter(value.expired_at)) {
        delete POOL_REQ[key]
      }
    }
  }, 1000)
}

const initQueue = async () => {
    try {
        const handleMessageFromQueue = async (data) => {
          data = JSON.parse(data.content.toString())
          returnMessageToClient(data)
          return
        }
        RabbitMQConnectionManager.listenToQueueMessages(RABBIT_MQ_INSTANCE_NAME,BOND_BONDS,handleMessageFromQueue)
    } catch (error) {
      console.log(`failed to init api_key queue, error: ${error}`)

    }
 }
 
const returnMessageToClient = async (msg) => {
  const result = getAndDeleteRequestById(msg.id);
  if (result && result.res) {
    const { res } = result;
    if (res && msg.error === true) {
      res.status(msg.code).send(msg.data);
    } else if (res && msg.error === false) {
      res.status(msg.code).send(msg.data);
    }
   }
  }


 const sendMessageToQueue = async (data) => {
    try {
        RabbitMQConnectionManager.pushMessageToQueue(RABBIT_MQ_INSTANCE_NAME, BONDS_BOND, JSON.stringify(data))
    } catch (error) {
      console.log(`failed to init api_key queue, error: ${error}`)

    }
  }

  module.exports = {
    addRequest,
    initQueue,
    sendMessageToQueue
  }