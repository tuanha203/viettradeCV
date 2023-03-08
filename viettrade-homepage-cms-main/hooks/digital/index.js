import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { setDefaultHeaders } from "../../config/Axios";
import { API, DIGITAL_DETAIL_KEY, DIGITAL_LIST_KEY } from "../../constants";

export const useCreateDigital = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.DIGITAL.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(DIGITAL_LIST_KEY);
      },
    }
  );
};

export const useUpdateDigital = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (banner) => {
      return await axios.put(
        `${API.API_ROOT}${API.DIGITAL.UPDATE.replace(":id", banner.id)}`,
        banner.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(DIGITAL_LIST_KEY);
      },
    }
  );
};

export const useUpdateDisplayDigital = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.put(
        `${API.API_ROOT}${API.DIGITAL.UPDATE_DISPLAY}`,
        data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(DIGITAL_LIST_KEY);
      },
    }
  );
};

export const useDeleteDigital = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (bannerId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.DIGITAL.DELETE.replace(":id", bannerId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(DIGITAL_LIST_KEY);
      },
    }
  );
};

export const useListDigital = () => {
  return useQuery([DIGITAL_LIST_KEY], async () => {
    return await axios.get(`${API.API_ROOT}${API.DIGITAL.LIST}`);
  });
};

export const useDetailDigital = (bannerId) => {
  return useQuery([DIGITAL_DETAIL_KEY, bannerId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.DIGITAL.DETAIL.replace(":id", bannerId)}`
    );
  });
};
