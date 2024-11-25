import axios from "axios";

export const baseURL = process.env.REACT_APP_SERVER_BASE_URL;
console.log(baseURL)
let Api = axios.create({
  baseURL,
});

export default Api;
