import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { setDefaultHeaders } from "../../config/Axios";
import { API, QUESTION_CREATE_KEY, QUESTION_DETAIL_KEY, QUESTION_LIST_KEY } from "../../constants";

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}/${API.QUESTION.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUESTION_LIST_KEY);
      },
    }
  );
};

export const useListQuestion = (type) => {
  return useQuery([QUESTION_CREATE_KEY], async () => {
    return await axios.get(`${API.API_ROOT}/${API.QUESTION.LIST}`, {
      params: {
        type: type,
      },
    });
  });
};

export const useDetailQuestion = (questionId) => {
  return useQuery([QUESTION_DETAIL_KEY, questionId], async () => {
    return await axios.get(
      `${API.API_ROOT}/${API.QUESTION.DETAIL.replace(":id", questionId)}`
    );
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (questionId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.QUESTION.DELETE.replace(":id", questionId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUESTION_LIST_KEY);
      },
    }
  );
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (question) => {
      return await axios.put(
        `${API.API_ROOT}${API.QUESTION.UPDATE.replace(":id", question.id)}`,
        question.data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUESTION_LIST_KEY);
      },
    }
  );
};
