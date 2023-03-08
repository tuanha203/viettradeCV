import { buildURL } from "@/utils";
import Axios from "../config/Axios";

export const fetcher = async ({ url, query } = {}) => {
  const { page, pageSize = DEFAULT_PAGE_SIZE, ...rest } = query || {};
  const URL = buildURL(url, {
    page: page || 0,
    pageSize,
    ...rest,
  });
  const response = await Axios.get(URL);
  return response?.data;
};

export const post = async ({ url, params }) => {
  const response = await Axios.post(url, params);
  return response?.data;
};
