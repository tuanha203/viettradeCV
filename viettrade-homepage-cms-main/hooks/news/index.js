import { useQuery } from "@tanstack/react-query";
import api from "../../config/Axios";
import { API, NEWS_DETAIL_KEY } from "../../constants";

export const useNewsDetail = () => {
  return useQuery([NEWS_DETAIL_KEY], async () => {
    const { data } = await api.get(API.NEWS.DETAIL);
    return data;
  });
};
