const wsService = require("../service");
const redisGroup = require("../../redis/redisGroup");
const { get_session } = require("./sessionManager");
const REDIS_GROUP_AUCTION_LIST = process.env.REDIS_GROUP_AUCTION_LIST;
const REDIS_GROUP_USER_DATA = process.env.REDIS_GROUP_USER_DATA;
const AUCTIONS = process.env.AUCTIONS;
const auctionQueue = require("../../utils/rabbitmq/auctionQueue");

function sendMessage(ws, message) {
  ws.send(JSON.stringify(message));
}

const auctionStatusUpdated = {};
let intervalId;

const startIntervalSendingMessages = async () => {

  intervalId = setInterval(async () => {
    
    const wss = wsService.get_wss_of_ws_service();
    if (wss) {
      for (const ws of wss.clients) {
        const userDetails = get_session(ws.id);
        
        if (userDetails !== undefined) {
          if (userDetails.clientUserId !== undefined) {
            const redisAllUserDataKeys = await redisGroup.getFromGroup(
              REDIS_GROUP_USER_DATA,
              userDetails.clientUserId
            );
            if (redisAllUserDataKeys) {
              let userData = JSON.parse(redisAllUserDataKeys);

              if (userData.auctions?.length > 0) {
                const filteredAuctions = userData?.auctions?.filter(
                  (auction) =>
                    auction.showAuction === true ||
                    auction.showAuction === undefined
                );
                
                let userType = "client";
                updateFormattedTimeLeft(
                  filteredAuctions,
                  ws,
                  userData,
                  userDetails,
                  userType
                );
              } else {
                ws.send(
                  JSON.stringify({
                    type: "get_all_auction",
                    data: [],
                  })
                );
                // const filteredAuctions = userData?.auctions?.filter(
                //   (auction) =>
                //     auction.showAuction === true ||
                //     auction.showAuction === undefined
                // );
                // let userType = "client";
                // updateFormattedTimeLeft(
                //   filteredAuctions,
                //   ws,
                //   userData,
                //   userDetails,
                //   userType
                // );
              }
            }
          } else {
            const auctionList = await redisGroup.getFromGroup(
              REDIS_GROUP_AUCTION_LIST,
              AUCTIONS
            );
            let auctions = JSON.parse(auctionList);
            if (auctions?.length > 0) {
              let viewAsClientId =
                auctions.length > 0 ? auctions[0]?.viewAsClientUserId : [];
              if (viewAsClientId !== undefined && viewAsClientId.length > 0) {
                const getTraderViewAsClientId = viewAsClientId.filter(
                  (trader) => trader.traderId === userDetails.traderId
                );
                if (getTraderViewAsClientId.length > 0) {
                  const redisUserDataKeys = await redisGroup.getFromGroup(
                    REDIS_GROUP_USER_DATA,
                    getTraderViewAsClientId[0].clientUserId
                  );
                  let userData = JSON.parse(redisUserDataKeys);

                  if (userData?.auctions?.length > 0) {
                    const filteredAuctions = userData?.auctions?.filter(
                      (auction) =>
                        auction.showAuction === true ||
                        auction.showAuction === undefined
                    );
                    let userType = "trader as client";
                    updateFormattedTimeLeft(
                      filteredAuctions,
                      ws,
                      userData,
                      userDetails,
                      userType
                    );
                  }
                }else {
                  if (auctions.length > 0) {
                    let userType = "trader";
                    updateFormattedTimeLeft(auctions, ws, userDetails,userType);
                  }
                }
              } else {
                if (auctions.length > 0) {
                  let userType = "trader";
                  updateFormattedTimeLeft(auctions, ws, userDetails,userType);
                }
              }
            }else {
              ws.send(
                JSON.stringify({
                  type: "get_all_auction",
                  data: [],
                })
              );
            }
          }
        }
      }
    }
  }, 1000);
  return intervalId;
};

const calculateTimeLeft = (endTimestamp) => {
  const endTime = new Date(endTimestamp).getTime();
  const currentTimeInMillie = new Date().getTime();
  const timeDifference = endTime - currentTimeInMillie;
  if (timeDifference <= 0) {
    return { minutes: 0, seconds: 0 };
  }
  const minutesLeft = Math.floor(timeDifference / 1000 / 60);
  const secondsLeft = Math.floor((timeDifference / 1000) % 60);
  return { minutes: minutesLeft, seconds: secondsLeft };
};

const hasBondTradeExtraTimeForAuctionId = (filteredAuctions,auctionId) => {
  const filteredAuction = filteredAuctions.filter(auction => Number(auction.auction_id) === Number(auctionId));
  return filteredAuction.some(auction => new Date(auction.bondTradeExtraTime).getTime() > new Date().getTime());

};

const updateFormattedTimeLeft = async (
  filteredAuctions,
  ws,
  userData,
  userDetails,
  userType
) => {
  const auctionIdsWithBondTradeExtraTime = new Set();
  const currentTime = new Date().getTime();
  filteredAuctions = filteredAuctions?.filter((auction) => {
      if (auctionStatusUpdated[auction.auction_id]) {
        return;
      }
      if (auction.start_in_five === "1") {
        
        const startTime = new Date(auction.start_time).getTime();
        const initialTimeLeft = calculateTimeLeft(startTime);
        if (initialTimeLeft.minutes > 0 || initialTimeLeft.seconds > 0) {
         
          auction.phrase = "Time before start: ";
          auction.formattedTimeLeft = ` ${String(
            initialTimeLeft.minutes
          ).padStart(2, "0")}:${String(initialTimeLeft.seconds).padStart(
            2,
            "0"
          )}`;
          return true
        } else {
          const endTime = new Date(auction.end_time).getTime();
  
          const timeLeft = calculateTimeLeft(endTime);
   
          if (timeLeft.minutes > 0 || timeLeft.seconds > 0 ) {
            if(auction.bondTradeExtraTime !== undefined){
                  if(auction.bondTradeExtraTime){
                    auction.remainingTime = "05:00"
                  }
                }
  
            auction.phrase = "Time Left: ";
            auction.formattedTimeLeft = ` ${String(
              timeLeft.minutes
            ).padStart(2, "0")}:${String(timeLeft.seconds).padStart(
              2,
              "0"
            )}`;
         
            return true
          
          } 
          else {
            if(hasBondTradeExtraTimeForAuctionId(filteredAuctions,auction.auction_id)){
              const result = findAuctionStaticIdPastBondTradeExtraTime(filteredAuctions,auction.auction_id)
              if(result.length > 0){
                const auctionsStaticIds = result;
                const messageToQueue = {
                  type: "remove_bond_from auction",
                  data: {
                    auctionsStaticIds
                  },
                };
                auctionQueue.sendMessageToQueue(messageToQueue);
              }
              auctionIdsWithBondTradeExtraTime.add(auction.auction_id);
  
              const endTime = new Date(auction.bondTradeExtraTime).getTime();
              const currentTime = new Date().getTime();
              const timeDifference = endTime - currentTime;
              if (decreaseTimestampByOneMinute(auction.bondTradeExtraTime) === true) {
                const minutesLeft = Math.floor(timeDifference / 1000 / 60);
                const secondsLeft = Math.floor((timeDifference / 1000) % 60);
                const formattedTime = `${String(minutesLeft).padStart(
                  2,
                  "0"
                )}:${String(secondsLeft).padStart(2, "0")}`;
                if(!hasBondTradeExtraTimeForAuctionId(filteredAuctions,auction.auction_id)){
                  if (minutesLeft <= 0 && secondsLeft <= 0) {
                    let auctionId = auction.auction_id;
                    let clientUserId = userDetails?.clientUserId;
                    const messageToQueue = {
                      type: "update_auction_status",
                      data: {
                        auctionId,
                        clientUserId,
                      },
                    };
                    auctionQueue.sendMessageToQueue(messageToQueue);
                    auctionStatusUpdated[auctionId] = true;
                    auction.phrase = "Extra time";
                    auction.formattedTimeLeft = "Extra time";
                    auction.remainingTime = "00:00"
                    auctionIdsWithBondTradeExtraTime.delete(auction.auction_id);
                    return false
                  }
                }else {
                  auction.remainingTime = formattedTime
                  auction.phrase = "Extra time";
                  auction.formattedTimeLeft = "Extra time";
                }
                return true
               }
              
            }else {
              // console.log(auction.auction_id,"auction.auction_id else")
              if(!auctionIdsWithBondTradeExtraTime.has(auction.auction_id)){
         
                let auctionId = auction.auction_id;
                let clientUserId = userDetails?.clientUserId;
                const messageToQueue = {
                  type: "update_auction_status",
                  data: {
                    auctionId,
                    clientUserId,
                  },
                };
                auctionQueue.sendMessageToQueue(messageToQueue);
                auctionStatusUpdated[auctionId] = true;
                auction.phrase = "Extra time";
                auction.formattedTimeLeft = "Extra time";
                return false
              }
            }
  
          }
        }
      } else {
        const endTime = new Date(auction.end_time).getTime();
        const initialTimeLeft = calculateTimeLeft(endTime);
        if (initialTimeLeft.minutes > 0 || initialTimeLeft.seconds > 0) {
         if(auction.bondTradeExtraTime !== undefined){
            if(auction.bondTradeExtraTime){
              auction.remainingTime = "05:00"
            }
          }
          auction.phrase = "Time Left: ";
          auction.formattedTimeLeft = ` ${String(
            initialTimeLeft.minutes
          ).padStart(2, "0")}:${String(initialTimeLeft.seconds).padStart(
            2,
            "0"
          )}`;
          return true
        }else {
          if(hasBondTradeExtraTimeForAuctionId(filteredAuctions,auction.auction_id) && auction.endNow === undefined){
            const result = findAuctionStaticIdPastBondTradeExtraTime(filteredAuctions,auction.auction_id)
            if(result.length > 0){
              const auctionsStaticIds = result;
              const messageToQueue = {
                type: "remove_bond_from auction",
                data: {
                  auctionsStaticIds
                },
              };
              auctionQueue.sendMessageToQueue(messageToQueue);
            }
            auctionIdsWithBondTradeExtraTime.add(auction.auction_id);

            const endTime = new Date(auction.bondTradeExtraTime).getTime();
            const currentTime = new Date().getTime();
            const timeDifference = endTime - currentTime;
            if (decreaseTimestampByOneMinute(auction.bondTradeExtraTime) === true) {
              const minutesLeft = Math.floor(timeDifference / 1000 / 60);
              const secondsLeft = Math.floor((timeDifference / 1000) % 60);
              const formattedTime = `${String(minutesLeft).padStart(
                2,
                "0"
              )}:${String(secondsLeft).padStart(2, "0")}`;
              if(!hasBondTradeExtraTimeForAuctionId(filteredAuctions,auction.auction_id)){
                if (minutesLeft <= 0 && secondsLeft <= 0) {
                  let auctionId = auction.auction_id;
                  let clientUserId = userDetails?.clientUserId;
                  const messageToQueue = {
                    type: "update_auction_status",
                    data: {
                      auctionId,
                      clientUserId,
                    },
                  };
                  auctionQueue.sendMessageToQueue(messageToQueue);
                  auctionStatusUpdated[auctionId] = true;
                  auction.phrase = "Extra time";
                  auction.formattedTimeLeft = "Extra time";
                  auction.remainingTime = "00:00"
                  auctionIdsWithBondTradeExtraTime.delete(auction.auction_id);
                  return false
                }
              }else {
                auction.remainingTime = formattedTime
                auction.phrase = "Extra time";
                auction.formattedTimeLeft = "Extra time";
              }
              return true
             }
            
          }else {
            if(!auctionIdsWithBondTradeExtraTime.has(auction.auction_id)){
       
              let auctionId = auction.auction_id;
              let clientUserId = userDetails?.clientUserId;
              const messageToQueue = {
                type: "update_auction_status",
                data: {
                  auctionId,
                  clientUserId,
                },
              };
              auctionQueue.sendMessageToQueue(messageToQueue);
              auctionStatusUpdated[auctionId] = true;
              auction.phrase = "Extra time";
              auction.formattedTimeLeft = "Extra time";
              return false
            }
          }

        }
      }
    })
    
    if (userType === "client" || userType === "trader as client") {
      ws.send(
        JSON.stringify({
          type: "get_all_auction",
          data: filteredAuctions,
        })
      );
      ws.send(
        JSON.stringify({
          type: "update_regions",
          newRegions: userData?.regions,
          clientUserId: userDetails.clientUserId,
        })
      );
    } else {
      ws.send(
        JSON.stringify({
          type: "get_all_auction",
          data: filteredAuctions,
        })
      );
    }
};

const decreaseTimestampByOneMinute = (timestamp) => {
  if (timestamp !== undefined) {
    const originalTimestamp = new Date(timestamp);
    originalTimestamp.setMinutes(originalTimestamp.getMinutes() - 5);
    const adjustedTimestamp = originalTimestamp.getTime();
    const currentTime = new Date().getTime();
    if (adjustedTimestamp < currentTime) {
      return true;
    } else {
      return false;
    }
  }
};

const findAuctionStaticIdPastBondTradeExtraTime = (auctions, auctionId) => {
 
  const auction = auctions.filter(
    (auction) => Number(auction.auction_id) === Number(auctionId)
  );

  if (auction) {
    const currentTime = new Date().getTime(); // Get current time in milliseconds

    const itemsWithoutTradeOrPastBondTradeExtraTime = auction.filter(
      (item) => (new Date(!item.tradedText).getTime() || new Date(item.bondTradeExtraTime).getTime()) < currentTime
    );

    const auctionStaticIdsWithoutTradeOrPastBondTradeExtraTime =
      itemsWithoutTradeOrPastBondTradeExtraTime.map(
        (item) => item.auctionStaticId
      );

    return auctionStaticIdsWithoutTradeOrPastBondTradeExtraTime;
  }

  return [];
};


exports.startIntervalSendingMessages  = startIntervalSendingMessages 
