import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { setDefaultHeaders } from "../../config/Axios";
import { API, CATEGORY_DETAIL_KEY, CATEGORY_LIST_KEY } from "../../constants";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.CATEGORY.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CATEGORY_LIST_KEY);
      },
    }
  );
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (category) => {
      return await axios.put(
        `${API.API_ROOT}${API.CATEGORY.UPDATE.replace(":id", category.id)}`,
        category.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CATEGORY_LIST_KEY);
      },
    }
  );
};

export const useUpdateDisplayCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (category) => {
      return await axios.put(
        `${API.API_ROOT}${API.CATEGORY.UPDATE_DISPLAY.replace(":id", category.id)}`,
        category
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CATEGORY_LIST_KEY);
      },
    }
  );
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (categoryId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.CATEGORY.DELETE.replace(":id", categoryId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CATEGORY_LIST_KEY);
      },
    }
  );
};

export const useListCategory = () => {
  return useQuery([CATEGORY_LIST_KEY], async () => {
    return await axios.get(`${API.API_ROOT}${API.CATEGORY.LIST}`);
  });
};

export const useDetailCategory = (categoryId) => {
  return useQuery([CATEGORY_DETAIL_KEY, categoryId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.CATEGORY.DETAIL.replace(":id", categoryId)}`
    );
  });
};
