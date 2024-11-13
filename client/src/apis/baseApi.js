import axios from "axios";

export const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

let Api = axios.create({
  baseURL,
});

// let token = sessionStorage.getItem("token");
// console.log(token)
// if (token !== null) {
//   Api.interceptors.request.use((config) => {
//     config.headers = { Authorization: token };
//     return config;
//   });
// }
export default Api;
