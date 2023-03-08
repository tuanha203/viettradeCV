import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "../../config/Axios";
import { ADMIN_DETAIL_KEY, ADMIN_LIST_KEY, API, PAGE_SIZE } from "~/constants";

export const useCreateAdmin = (setIsDisable) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return axios.post(`${API.API_ROOT}${API.ADMIN.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(ADMIN_LIST_KEY);
      },
      onError: (error) => {
        setIsDisable(false)
      }
    }
  );
};

export const useUpdateAdmin = (setIsDisable) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (admin) => {
      return await axios.put(
        `${API.API_ROOT}${API.ADMIN.UPDATE.replace(":id", admin.id)}`,
        admin.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(ADMIN_LIST_KEY);
      },
      onError: (error) => {
        setIsDisable(false)
      }
    }
  );
};

export const useUpdateAdminStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.put(
        `${API.API_ROOT}${API.ADMIN.UPDATE.replace(":id", data.id)}`,
        data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(ADMIN_LIST_KEY);
      },
    }
  );
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (adminId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.ADMIN.DELETE.replace(":id", adminId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(ADMIN_LIST_KEY);
      },
    }
  );
};

export const useDetailAdmin = (userId) => {
  return useQuery([ADMIN_DETAIL_KEY, userId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.ADMIN.DETAIL.replace(":id", userId)}`
    );
  });
};

export const useAdminInfo = () => {
  return useQuery([ADMIN_DETAIL_KEY, userId], async () => {
    return await axios.get(`${API.API_ROOT}${API.ADMIN.INFO}`);
  });
};

export const useListAdmin = (tableParams) => {
  const { sort = "desc", sortColumn = "id" } = tableParams.sorter;
  const { current: offset = 1, pageSize: limit = PAGE_SIZE } =
    tableParams.pagination;
  const search = tableParams.search;
  const status = tableParams.status;
  const role = tableParams.role;
  return useQuery(
    [ADMIN_LIST_KEY, sort, sortColumn, offset, limit, search, status, role],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}${API.ADMIN.LIST}`,
        {
          params: {
            sort,
            sortColumn,
            offset,
            limit,
            search,
            status,
            role,
          },
        }
      );

      return { data, total: headers["x-total-count"] };
    }
  );
};
