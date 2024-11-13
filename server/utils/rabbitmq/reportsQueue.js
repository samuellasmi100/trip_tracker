const RabbitMQConnectionManager = require("../../message_stream/RabbitMQConnectionManager")
const BOND_REPORTS = process.env.BOND_REPORTS
const REPORTS_BOND = process.env.REPORTS_BOND
const RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST
const redisGroup = require("../../redis/redisGroup")
const  { startIntervalSendingMessages }  = require("../../ws/helper/broadcast") 
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
        RabbitMQConnectionManager.listenToQueueMessages(RABBIT_MQ_INSTANCE_NAME,REPORTS_BOND,handleMessageFromQueue)
    } catch (error) {
      console.log(`failed to init api_key queue, error: ${error}`)
    }
 }
 
const returnMessageToClient = async (msg) => {
  const response =  getAndDeleteRequestById(msg.id);
  if(response !== undefined){
    const { res } = response;
    if(res !== undefined){
      if (res && msg.error === true) {
        res.status(msg.code).send(msg.data);
      } else if (res && msg.error === false) {
        res.status(msg.code).send(msg.data);
      }
    }
  }
}

 const sendMessageToQueue = async (data) => {
    try {
        RabbitMQConnectionManager.pushMessageToQueue(RABBIT_MQ_INSTANCE_NAME,BOND_REPORTS, JSON.stringify(data))
    } catch (error) {
      console.log(`failed to init api_key queue, error: ${error}`)
    }
  }

  module.exports = {
    addRequest,
    initQueue,
    sendMessageToQueue
  }