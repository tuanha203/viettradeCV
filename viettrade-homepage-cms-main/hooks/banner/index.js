import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { setDefaultHeaders } from "../../config/Axios";
import { API, BANNER_DETAIL_KEY, BANNER_LIST_KEY } from "../../constants";

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.BANNER.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BANNER_LIST_KEY);
      },
    }
  );
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (banner) => {
      return await axios.put(
        `${API.API_ROOT}${API.BANNER.UPDATE.replace(":id", banner.id)}`,
        banner.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BANNER_LIST_KEY);
      },
    }
  );
};

export const useUpdateDisplayBanner = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.put(
        `${API.API_ROOT}${API.BANNER.UPDATE_DISPLAY}`,
        data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BANNER_LIST_KEY);
      },
    }
  );
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (bannerId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.BANNER.DELETE.replace(":id", bannerId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BANNER_LIST_KEY);
      },
    }
  );
};

export const useListBanner = () => {
  return useQuery([BANNER_LIST_KEY], async () => {
    return await axios.get(`${API.API_ROOT}${API.BANNER.LIST}`);
  });
};

export const useDetailBanner = (bannerId) => {
  return useQuery([BANNER_DETAIL_KEY, bannerId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.BANNER.DETAIL.replace(":id", bannerId)}`
    );
  });
};
