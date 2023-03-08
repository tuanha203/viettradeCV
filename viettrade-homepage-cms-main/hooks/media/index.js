import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../config/Axios";
import { API, MEDIA_LIST_KEY, MEDIA_DETAIL_KEY } from "../../constants";

export const useListMedia = () => {
  return useQuery([MEDIA_LIST_KEY], async () => {
    return await axios.get(`${API.API_ROOT}/${API.MEDIA.LIST}`);
  });
};

export const useCreateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.MEDIA.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MEDIA_LIST_KEY);
      },
    }
  );
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (mediaId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.MEDIA.DELETE.replace(":id", mediaId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MEDIA_LIST_KEY);
      },
    }
  );
};

export const useDetailMedia = (mediaId) => {
  return useQuery([MEDIA_DETAIL_KEY, mediaId], async () => {
    return await axios.get(
      `${API.API_ROOT}/${API.MEDIA.DETAIL.replace(":id", mediaId)}`
    );
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (media) => {
      return await axios.put(
        `${API.API_ROOT}${API.MEDIA.UPDATE.replace(":id", media.id)}`,
        media.mediaData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MEDIA_LIST_KEY);
      },
    }
  );
};
