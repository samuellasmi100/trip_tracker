const RabbitMQConnectionManager = require("../../message_stream/RabbitMQConnectionManager");
const BOND_REGION = process.env.BOND_REGION;
const REGION_BOND = process.env.REGION_BOND;
const RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME;
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const redisGroup = require("../../redis/redisGroup");
const REDIS_GROUP_AUCTION_LIST = process.env.REDIS_GROUP_AUCTION_LIST;
const REDIS_GROUP_USER_DATA = process.env.REDIS_GROUP_USER_DATA;
const AUCTIONS = process.env.AUCTIONS;
const wsService = require("../../ws/service");
const { get_sessions, get_session } = require("../../ws/helper/sessionManager");
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
      REGION_BOND,
      handleMessageFromQueue
    );
  } catch (error) {
    console.log(`failed to init api_key queue, error: ${error}`);
  }
};

const returnMessageToClient = async (msg) => {
  
 try {
  // const wss = wsService.get_wss_of_ws_service();
  // if (msg.type === "update_client_user") {
  //   for (const ws of wss.clients) {
  //     const userDetails = await get_session(ws.id);
  //     if (userDetails?.clientUserId !== undefined) {
  //       const redisAllUserDataKeys = await redisGroup.getFromGroup(
  //         REDIS_GROUP_USER_DATA,
  //         userDetails.clientUserId
  //       );
  //       let userData = JSON.parse(redisAllUserDataKeys);
  //       const filteredAuctions = userData?.auctions.filter(
  //         (auction) =>
  //           auction.showAuction === true || auction.showAuction === undefined
  //       );
  //       if (userData !== null) {
  //         ws.send(
  //           JSON.stringify({
  //             type: "get_all_auction",
  //             data: filteredAuctions,
  //           })
  //         );
  //         ws.send(
  //           JSON.stringify({
  //             type: "update_regions",
  //             newRegions: userData?.regions,
  //             clientUserId: userDetails.clientUserId,
  //           })
  //         );
  //       }
  //     } else {
  //       const auctionList = await redisGroup.getFromGroup(
  //         REDIS_GROUP_AUCTION_LIST,
  //         AUCTIONS
  //       );
  //       let auctions = JSON.parse(auctionList);
  //       let viewAsClientId = auctions?.length > 0 ? auctions[0].viewAsClientUserId : [];
  //       const getTraderViewAsClientId = viewAsClientId?.filter((trader) => trader.traderId === userDetails?.traderId)
  //       if(viewAsClientId !== undefined && viewAsClientId.length > 0){
  //         if(getTraderViewAsClientId.length > 0){
            
  //          const redisUserDataKeys = await redisGroup.getFromGroup(
  //            REDIS_GROUP_USER_DATA,
  //            getTraderViewAsClientId[0].clientUserId
  //          );
  //          let userData = JSON.parse(redisUserDataKeys);
  //          const filteredAuctions = userData?.auctions.filter((auction) => auction.showAuction === true || auction.showAuction === undefined);
  //          ws.send(
  //           JSON.stringify({
  //             type: "update_regions",
  //             newRegions: userData.regions,
  //             clientUserId: getTraderViewAsClientId[0].clientUserId,
  //           })
  //         );
  //           ws.send(
  //             JSON.stringify({
  //               type: "get_all_auction",
  //               data: filteredAuctions,
  //             })
  //           );
  //         }
  //       } else {
  //         const traderAuctionList = await redisGroup.getFromGroup(
  //           REDIS_GROUP_AUCTION_LIST,
  //           AUCTIONS
  //         );
  //         let userData = JSON.parse(traderAuctionList);
  //         ws.send(
  //           JSON.stringify({
  //             type: "get_all_auction",
  //             data: userData,
  //           })
  //         );
  //       }
  //     }
  //   }
  // }
  const result = getAndDeleteRequestById(msg.id);
  if (result && result.res) {
    const { res } = result;
    if (res && msg.error === true) {
      res.status(msg.code).send(msg.data);
    } else if (res && msg.error === false) {
      res.status(msg.code).send(msg.data);
      // if (
      //   msg.type === "get_client_user_regions" ||
      //   msg.type === "get_all" ||
      //   msg.type === "get_region_by_user_id" || 
      //   msg.type === "get_bond_by_region"
      // ) {
      //   res.status(msg.code).send(msg.data);
      // } 

      // else {
      //   if (msg?.data?.length > 0) {
      //     if (msg.clientUserId !== undefined) {
      //       const redisAllUserDataKeys = await redisGroup.getFromGroup(
      //         REDIS_GROUP_USER_DATA,
      //         msg.clientUserId
      //       );
      //       let userData = JSON.parse(redisAllUserDataKeys);
      //       const filteredAuctions = userData?.auctions.filter(
      //         (auction) =>
      //           auction.showAuction === true ||
      //           auction.showAuction === undefined
      //       );

      //       res.status(msg.code).send(filteredAuctions);
      //     } else {
      //       const auctionList = await redisGroup.getFromGroup(
      //         REDIS_GROUP_AUCTION_LIST,
      //         AUCTIONS
      //       );
      //       let auctions = JSON.parse(auctionList);
      //       let viewAsClientId =
      //         auctions?.length > 0 ? auctions[0].viewAsClientUserId : [];

      //       if (viewAsClientId !== undefined && viewAsClientId.length > 0) {
      //         const getTraderViewAsClientId = viewAsClientId.filter(
      //           (trader) => trader.traderId === msg.traderId
      //         );
      //         if (getTraderViewAsClientId.length > 0) {
      //           const redisAllUserDataKeys = await redisGroup.getFromGroup(
      //             REDIS_GROUP_USER_DATA,
      //             getTraderViewAsClientId[0].clientUserId
      //           );
      //           let userData = JSON.parse(redisAllUserDataKeys);
      //           const filteredAuctions = userData?.auctions.filter(
      //             (auction) => auction.showAuction === true
      //           );
      //           res.status(msg.code).send(filteredAuctions);
      //         }
      //       } else {
      //         const auctionList = await redisGroup.getFromGroup(
      //           REDIS_GROUP_AUCTION_LIST,
      //           AUCTIONS
      //         );
      //         let auctions = JSON.parse(auctionList);
      //         res.status(msg.code).send(auctions);
      //       }
      //     }
      //   } 
      // }
    }
  }
 } catch (error) {
 }
 
};

const sendMessageToQueue = async (data) => {
  try {
    RabbitMQConnectionManager.pushMessageToQueue(
      RABBIT_MQ_INSTANCE_NAME,
      BOND_REGION,
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
