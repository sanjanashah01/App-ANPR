import axios from "axios";
import Cookies from "js-cookie";

const APIMiddleware = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    common: {
      Authorization: `Bearer ${Cookies.get("authToken")}`,
    },
  },
});

export default APIMiddleware;
