import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { setDefaultHeaders } from "../../config/Axios";
import {
  API,
  USER_CREATE_KEY,
  USER_DETAIL_KEY,
  USER_LIST_KEY,
} from "../../constants";

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}/${API.USER.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_LIST_KEY);
      },
    }
  );
};

export const useListUser = (tableParams) => {
  const { sort = "desc", sortColumn = "id" } = tableParams.sorter;
  const { pageSize: limit = PAGE_SIZE, current: page = 1 } =
    tableParams.pagination;
  const search = tableParams.search;
  const status = tableParams.status;
  return useQuery(
    [USER_LIST_KEY, page, limit, sort, sortColumn, search, status],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}${API.USER.LIST}`,
        {
          params: {
            offset: page,
            limit: limit,
            sort: sort,
            sortColumn: sortColumn,
            search: search,
            status: status
          },
        }
      );
      return { data, total: headers["x-total-count"] };
    },
    {
      keepPreviousData: true,
    }
  );
};

export const useDetailUser = (userId) => {
  return useQuery([USER_DETAIL_KEY, userId], async () => {
    return await axios.get(
      `${API.API_ROOT}/${API.USER.DETAIL.replace(":id", userId)}`
    );
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (userId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.USER.DELETE.replace(":id", userId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_LIST_KEY);
      },
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (user) => {
      return await axios.put(
        `${API.API_ROOT}${API.USER.UPDATE.replace(":id", user.id)}`,
        user
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_LIST_KEY);
      },
    }
  );
};
