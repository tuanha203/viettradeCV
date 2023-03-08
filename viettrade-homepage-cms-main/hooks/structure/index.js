import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "../../config/Axios";
import {
  API,
  STRUCTURE_LIST_KEY,
  STRUCTURE_DETAIL_KEY,
  STRUCTURE_LIST_ALL_KEY,
} from "../../constants";

export const useListStructureNoTable = () => {
  return useQuery([STRUCTURE_LIST_ALL_KEY], async () => {
    return await axios.get(`${API.API_ROOT}/${API.STRUCTURE.LIST_ALL}`);
  });
};

export const useListStructure = () => {
  return useQuery([STRUCTURE_LIST_KEY], async () => {
    const { data, headers } = await axios.get(
      `${API.API_ROOT}/${API.STRUCTURE.LIST}`,
      {
        params: {
          isSearchAll: false,
        },
      }
    );

    return { data, total: headers["x-total-count"] };
  });
};

export const useListSubStructure = (structureId) => {
  return useQuery([STRUCTURE_LIST_KEY, structureId], async () => {
    const { data, headers } = await axios.get(
      `${API.API_ROOT}${API.STRUCTURE.LIST_SUB_STRUCTURE.replace(
        ":id",
        structureId
      )}`
    );
    return { data, total: headers["x-total-count"] };
  });
};

export const useCreateStructure = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.STRUCTURE.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(STRUCTURE_LIST_KEY);
      },
    }
  );
};

export const useDeleteStructure = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (structureId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.STRUCTURE.DELETE.replace(":id", structureId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(STRUCTURE_LIST_KEY);
      },
    }
  );
};

export const useDetailStructure = (structureId) => {
  return useQuery([STRUCTURE_DETAIL_KEY, structureId], async () => {
    return await axios.get(
      `${API.API_ROOT}/${API.STRUCTURE.DETAIL.replace(":id", structureId)}`
    );
  });
};

export const useUpdateStructure = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (structure) => {
      return await axios.put(
        `${API.API_ROOT}${API.STRUCTURE.UPDATE.replace(":id", structure.id)}`,
        structure
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(STRUCTURE_LIST_KEY);
      },
    }
  );
};

export const useUpdateDisplayStructure = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.put(
        `${API.API_ROOT}${API.STRUCTURE.UPDATE_DISPLAY}`,
        data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(STRUCTURE_LIST_KEY);
      },
    }
  );
};
