import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAll(token, impersonationClientUserId) {
    return Api.get(`/${END_POINT.AUCTION}/${impersonationClientUserId}`, {
      headers: { Authorization: token },
    });
  },
  addAuction(token, auctionData) {
    return Api.post(`${END_POINT.AUCTION}/add`, auctionData, {
      headers: { Authorization: token },
    });
  },
  removeBondFromAuction(token, auctionsStaticIds) {
    
    return Api.post(`${END_POINT.AUCTION}/remove`, auctionsStaticIds, {
      headers: { Authorization: token },
    });
  },
  updateAuction(token, auctionData) {
    return Api.post(`${END_POINT.AUCTION}/update_auction`, auctionData, {
      headers: { Authorization: token },
    });
  },
  updateAuctionStatus(token, auctionId) {
    return Api.post(
      `${END_POINT.AUCTION}/update/${auctionId}`,
      {},
      {
        headers: { Authorization: token },
      }
    );
  },
  getAuctionTransactionByClientId(token) {
    return Api.get(`/${END_POINT.AUCTION_TRANSACTION}`, {
      headers: { Authorization: token },
    });
  },
  addAuctionTransactionByClientId(token, auctionData) {
    return Api.post(`/${END_POINT.AUCTION_TRANSACTION}`, auctionData, {
      headers: {
        Authorization: token,
      },
    });
  },
  removeAuctionsViewAs(token) {
    return Api.delete(
      `/${END_POINT.AUCTION}/${END_POINT.REMOVE_AUCTIONS_VIEW_AS}`,
      {
        headers: { Authorization: token },
      }
    );
  },
  removeBuyTransaction(token,auctionId,clientUserId,auctionStaticIds) {
    
    return Api.post(`/${END_POINT.AUCTION_TRANSACTION}/${END_POINT.REMOVE_BUY_TRANSACTION}/${auctionId}/${clientUserId}`,{auctionStaticIds},
      {
        headers: { Authorization: token },
      }
    );
  },
  removeSellTransaction(token,auctionId,clientUserId,auctionStaticIds) {
    return Api.post(`/${END_POINT.AUCTION_TRANSACTION}/${END_POINT.REMOVE_SELL_TRANSACTION}/${auctionId}/${clientUserId}`,{auctionStaticIds},
    {
      headers: { Authorization: token },
    }
  );
  },
  removeAllTransactionOfAuction(token,auctionId,clientUserId,auctionStaticIds) {

    return Api.post(`/${END_POINT.AUCTION_TRANSACTION}/${END_POINT.REMOVE_All_TRANSACTION_OF_AUCTION}/${auctionId}/${clientUserId}`,{auctionStaticIds},
    {
      headers: { Authorization: token },
    }
  );
  },
  removeAllTransaction(token, auctionsId,clientUserId,result) {
    return Api.post(`/${END_POINT.AUCTION_TRANSACTION}/${END_POINT.REMOVE_All_TRANSACTION}/${clientUserId}`,{ auctionsId,result}, {
      headers: {
        Authorization: token,
      },
    });
  },
  removeAllTransactionOfAuctionWhenUserLogOut(token,clientUserId) {
    return Api.delete(`/${END_POINT.AUCTION_TRANSACTION}/${END_POINT.REMOVE_All_TRANSACTION_LOG_OUT}/${clientUserId}`,
    {
      headers: { Authorization: token },
    }
  );
  },
};
