const RabbitMQConnectionManager = require("../../message_stream/RabbitMQConnectionManager")
const AUTH_BOND = process.env.AUTH_BOND
const BOND_AUTH = process.env.BOND_AUTH
const RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST
const REDIS_GROUP_USER_DATA = process.env.REDIS_GROUP_USER_DATA
const redisGroup = require("../../redis/redisGroup")
const logger = require('../Logger')
const POOL_REQ = {}
const wsService = require("../../ws/service");
const { get_sessions, get_session } = require("../../ws/helper/sessionManager");
const cron = require('node-cron');
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
        RabbitMQConnectionManager.listenToQueueMessages(RABBIT_MQ_INSTANCE_NAME,AUTH_BOND,handleMessageFromQueue)
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
        RabbitMQConnectionManager.pushMessageToQueue(RABBIT_MQ_INSTANCE_NAME,BOND_AUTH, JSON.stringify(data))
    } catch (error) {
      console.log(`failed to init api_key queue, error: ${error}`)

    }
  }

  // const startCronJob = () => {
  //   // Schedule the task to run every 2 minutes
  //   cron.schedule('*/2 * * * *', async () => {
  //     await performCronJobLogic();
  //   });
  // };

  // const performCronJobLogic = async () => {
  //   const wss = wsService.get_wss_of_ws_service();
  //   for (const ws of wss.clients) {
  //     const userDetails = await get_session(ws.id);

  //     if (userDetails !== undefined && userDetails.clientUserId !== undefined) {


  //       await redisGroup.deleteFromGroup(
  //         REDIS_GROUP_USER_DATA,
  //         userDetails.clientUserId,
          
  //       );

  //       ws.send(
  //         JSON.stringify({
  //           type: "logOut",
  //           data: true,
  //         })
  //       );
  //     }
  //   }
  // };
  // startCronJob()
  module.exports = {
    addRequest,
    initQueue,
    sendMessageToQueue
  }