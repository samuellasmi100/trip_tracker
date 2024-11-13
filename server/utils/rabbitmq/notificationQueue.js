const RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME;
const BOND_NOTIFICATION = process.env.BOND_NOTIFICATION
const NOTIFICATION_BOND = process.env.NOTIFICATION_BOND
const RabbitMQConnectionManager = require("../../message_stream/RabbitMQConnectionManager")
const redisGroup = require('../../redis/redisGroup')
const POOL_REQ = {}
const wsStreaming = require("../../ws/helper/broadcast")
const wsService = require("../../ws/service")
const sessionManager = require("../../ws/helper/sessionManager")
const logger = require("../Logger")
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

// cleanPoolRequests()

const initQueue = async () => {

    try {
        const handleMessageFromQueue = async (data) => {
          data = JSON.parse(data.content.toString())
          handleMessageFromNotificationQueue(data)
          return
        }
        RabbitMQConnectionManager.listenToQueueMessages(RABBIT_MQ_INSTANCE_NAME,NOTIFICATION_BOND,handleMessageFromQueue)
    } catch (error) {
      console.log(`failed to init api_key queue, error: ${error}`)
    }
 }

  const handleMessageFromNotificationQueue = async (msg) => {
    try {
      switch (msg.type) {
        case 'login':
             await returnMessageToClient(msg)
          break
          case 'log_out':
             await returnMessageToClient(msg)
        break
        default:
          break
      }
    } catch (error) {
      console.error(error)
    }
  }

  const returnMessageToClient = async (msg) => {
    const wss = wsService.get_wss_of_ws_service()
    for (const ws of wss.clients) {
        ws.send(JSON.stringify(msg.data))
    } 
  }
  
  const sendMessageToQueue = async (data) => {
    try {
        RabbitMQConnectionManager.pushMessageToQueue(RABBIT_MQ_INSTANCE_NAME,BOND_NOTIFICATION, JSON.stringify(data))
    } catch (error) {
      console.log(`failed to init api_key queue, error: ${error}`)
    }
  }
  module.exports = {
    initQueue,
    sendMessageToQueue,
    addRequest
  }