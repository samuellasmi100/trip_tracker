import axios from "axios";

export const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

let Api = axios.create({
  baseURL,
});

export default Api;
