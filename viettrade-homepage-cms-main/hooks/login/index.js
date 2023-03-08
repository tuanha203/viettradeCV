import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../../config/Axios";
import { API } from "../../constants";

export const useLogin = () => {
  return useMutation(async data => {
    const res = await axios.post(`${API.API_ROOT}${API.AUTH.LOGIN}`, data)
    return res.data;
  });
}
