const RabbitMQConnectionManager = require("../../message_stream/RabbitMQConnectionManager");
const BONDS_USER_LOG = process.env.BONDS_USER_LOG;
const USER_LOG_BONDS = process.env.USER_LOG_BONDS;
const wsService = require("../../ws/service");
const { get_sessions, get_session } = require("../../ws/helper/sessionManager");
const RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME;
const REDIS_GROUP_USER_LOG = process.env.REDIS_GROUP_USER_LOG;
const REDIS_GROUP_TRADER_LOG = process.env.REDIS_GROUP_TRADER_LOG;
const LOGS = process.env.LOGS;
const redisGroup = require("../../redis/redisGroup");
const POOL_REQ = {};
const REDIS_GROUP_AUCTION_LIST = process.env.REDIS_GROUP_AUCTION_LIST;
const AUCTIONS = process.env.AUCTIONS;

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
      USER_LOG_BONDS,
      handleMessageFromQueue
    );
  } catch (error) {
    console.log(`failed to init api_key queue, error: ${error}`);
  }
};

const returnMessageToClient = async (msg) => {
  const wss = wsService.get_wss_of_ws_service();
  for (const ws of wss.clients) {
    const userDetails = await get_session(ws.id);
    if (userDetails !== undefined) {
      if (userDetails.clientUserId !== undefined) {
        const redisAllUserDataKeys = await redisGroup.getFromGroup(
          REDIS_GROUP_USER_LOG,
          userDetails.clientUserId
        );
        let userLogs = JSON.parse(redisAllUserDataKeys);
        ws.send(
          JSON.stringify({
            type: "update_client_user_logs",
            data: userLogs,
          })
        );
      } else {
        const auctionList = await redisGroup.getFromGroup(
          REDIS_GROUP_AUCTION_LIST,
          AUCTIONS
        );
        
        let auctions = JSON.parse(auctionList);
        let viewAsClientId =
          auctions?.length > 0 ? auctions[0]?.viewAsClientUserId : [];
          if (viewAsClientId !== undefined && viewAsClientId.length > 0) {
          let find = viewAsClientId?.map(async (user) => {
            if(user.traderId === userDetails.traderId){
              const redisAllUserDataKeys = await redisGroup.getFromGroup(
                REDIS_GROUP_USER_LOG,
                user.clientUserId
              );
              let userLogs = JSON.parse(redisAllUserDataKeys);
              ws.send(
                JSON.stringify({
                  type: "update_client_user_logs",
                  data: userLogs,
                })
              );
            }else {
              const redisTraderDataKeys = await redisGroup.getFromGroup(
                REDIS_GROUP_TRADER_LOG,
                userDetails.traderId
              );
              let traderLogs = JSON.parse(redisTraderDataKeys);
             
              ws.send(
                JSON.stringify({
                  type: "update_trader_logs",
                  data: traderLogs,
                })
              );
            }
          })
        }
       
        //   "viewAsClientUserId": [
        //     {
        //         "clientUserId": "23b9dab0-2949-4f8c-bc08-85147e22ea08",
        //         "traderId": 2
        //     },
        //     {
        //         "clientUserId": "23b9dab0-2949-4f8c-bc08-85147e22ea08",
        //         "traderId": 21
        //     }
        // ],
        // if (viewAsClientId !== undefined && viewAsClientId.length > 0) {
        
        
          // if(viewAsClientId[0].traderId === userDetails.traderId){
          //   const redisAllUserDataKeys = await redisGroup.getFromGroup(
          //     REDIS_GROUP_USER_LOG,
          //     viewAsClientId[0].clientUserId
          //   );
          //   let userLogs = JSON.parse(redisAllUserDataKeys);
          //   ws.send(
          //     JSON.stringify({
          //       type: "update_client_user_logs",
          //       data: userLogs,
          //     })
          //   );
          // }else {
          //   const redisTraderDataKeys = await redisGroup.getFromGroup(
          //     REDIS_GROUP_TRADER_LOG,
          //     userDetails.traderId
          //   );
          //   let traderLogs = JSON.parse(redisTraderDataKeys);
           
          //   ws.send(
          //     JSON.stringify({
          //       type: "update_trader_logs",
          //       data: traderLogs,
          //     })
          //   );
          // }
        // }
        else {

            if(msg.searchTerm === "" || msg.searchTerm === undefined){ 
              const redisTraderDataKeys = await redisGroup.getFromGroup(
                REDIS_GROUP_TRADER_LOG,
                userDetails.traderId
              );
              let traderLogs = JSON.parse(redisTraderDataKeys);
              // if(userDetails.traderId === msg.traderId){
                
              ws.send(
                JSON.stringify({
                  type: "update_trader_logs",
                  data: traderLogs,
                })
              );
                
              // }
            }else {
              // if(userDetails.traderId === msg.traderId){
                const redisTraderDataKeys = await redisGroup.getFromGroup(
                  REDIS_GROUP_TRADER_LOG,
                  userDetails.traderId
                );
                let traderLogs = JSON.parse(redisTraderDataKeys);
               
                ws.send(
                  JSON.stringify({
                    type: "update_trader_logs",
                    data: traderLogs,
                  })
                );
              // }   
            }
          }
          
      
      }
    }
  }
  const response = getAndDeleteRequestById(msg.id);

   if (response !== undefined) {
     const { res } = response;
     if (res !== undefined) {
       if (res && msg.error === true) {
         res.status(msg.code).send(msg.data);
       } else if (res && msg.error === false) {
        
         if(msg.type === "get_user_log_details_reports"){
           res.status(msg.code).send(msg.data);
         }else {
          if(msg.type === "get_user_log_details"){
            const redisAllUserDataKeys = await redisGroup.getFromGroup(
              REDIS_GROUP_USER_LOG,
              msg.clientUserId
            );
            let userLogs = JSON.parse(redisAllUserDataKeys);
            res.status(msg.code).send(userLogs); 
          }else if (msg.type === "get_log_details"){
            const redisTraderDataKeys = await redisGroup.getFromGroup(
              REDIS_GROUP_TRADER_LOG,
              msg.traderId
            );
            let traderLogs = JSON.parse(redisTraderDataKeys);
            res.status(msg.code).send(traderLogs); 
          }else if (msg.type === "add_log_details"){
            res.status(msg.code).send("Successful cancelation"); 
          }
          //  if(msg.searchTerm === "" ){
          //    res.status(msg.code).send([]);
          //  }else {
          //   res.status(msg.code).send([]);
          //  }
         }
       }
     }
   }
};

const sendMessageToQueue = async (data) => {
  try {
    RabbitMQConnectionManager.pushMessageToQueue(
      RABBIT_MQ_INSTANCE_NAME,
      BONDS_USER_LOG,
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
