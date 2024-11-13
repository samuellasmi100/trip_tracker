export const END_POINT = {
  LOGIN: "auth/login",
  FORGOT_PASSWORD: "auth/forgot_password",
  AUTH: "auth",
  RESET_PASSWORD: "reset_password",
  PRE_AUTH: "pre_auth",
  BONDS: "bonds",
  BOND: "bond",
  PROTECTED_ROUTE: "protected_route",
  AUTH_CHECK_TYPE: "auth_check_type",
  IMPERSONATION_AUTH : "impersonation_auth",
  AUTH_CHECK_QR_CODE: "auth_check_qr_code",
  AUTH_CHECK_SIX_DIGITS: "auth_check_six_digits",
  CLIENTS: "clients",
  TRADERS: "traders",
  CLIENT: "client",
  CLIENT_USER: "client_user",
  CLIENTS_USERS: "clients_users",
  USER: "user",
  SIGN_UP_CLIENT: "sign_up_client",
  REGIONS: "regions",
  SIGN_UP_CLIENT_USER: "sign_up_client_user",
  AUCTION: "auction",
  AUCTION_TRANSACTION: "auction_transaction",
  REPORTS : "reports",
  CLIENT_USER_REGION  : "client_user_region",
  UPDATE_CLIENT_USER_REGIONS : "update_client_user_regions",
  REMOVE_AUCTIONS_VIEW_AS : "remove_auctions_view_as",
  REMOVE_BUY_TRANSACTION : "remove_buy_transaction",
  REMOVE_SELL_TRANSACTION : "remove_sell_transaction",
  REMOVE_All_TRANSACTION_OF_AUCTION:"remove_all_transaction_of_auction",
  REMOVE_All_TRANSACTION:"remove_all_transaction",
  REMOVE_All_TRANSACTION_LOG_OUT:"remove_all_transaction_log_out",
  USER_LOGS:'user_log',
  REPORTS:"reports",
  GET_USERS_ONLINE:"get_users_online"
};

// export function setAuthToken(token) {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = "Bearer " + token;
//   } else {
//     delete axios.defaults.headers.common["Authorization"];
//   }
// }
