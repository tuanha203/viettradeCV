import axios from "axios";
import {API_ROOT, TIMEOUT} from "../constants";

let failAuth = 0;
const instance = axios.create({
  baseURL: API_ROOT,
  timeout: TIMEOUT,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        console.log("error", error);
      }
    }
    if (error?.response?.status === 403) {
      if (typeof window !== "undefined") {
        failAuth++;
        if (failAuth === 2) {
          localStorage.setItem("accessToken", "");
          localStorage.setItem("email", "");
          window.location.replace("/login");
          failAuth = 0;
        }
      }
    }
    return Promise.reject(error);
  }
);

export function setDefaultHeaders(headers) {
  Object.keys(headers).forEach((key) => {
    instance.defaults.headers.common[key] = headers[key];
  });
}

export default instance;
