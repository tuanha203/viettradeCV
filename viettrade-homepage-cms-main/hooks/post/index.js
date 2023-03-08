import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import axios from "../../config/Axios";
import {
  API,
  POST_LIST_KEY,
  POST_DETAIL_KEY,
  PAGE_SIZE,
} from "../../constants";

export const useListPost = (tableParams) => {
  const { sort = "desc", sortColumn = "createdAt" } = tableParams.sorter;
  const { pageSize: limit = PAGE_SIZE, current: page = 1 } =
    tableParams.pagination;
  const search = tableParams.search;
  const category_id = tableParams.category_id;
  const publish = tableParams.publish;
  const role = tableParams.role;
  return useQuery(
    [
      POST_LIST_KEY,
      page,
      limit,
      sort,
      sortColumn,
      search,
      category_id,
      publish,
      role,
    ],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}/${API.POST.LIST}`,
        {
          params: {
            offset: page,
            limit: limit,
            sort: sort,
            sortColumn: sortColumn,
            search: search,
            publish: publish,
            category_id: category_id,
            role: role,
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

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.POST.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(POST_LIST_KEY);
      },
    }
  );
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (postId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.POST.DELETE.replace(":id", postId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(POST_LIST_KEY);
      },
    }
  );
};

export const useDetailPost = (postId) => {
  return useQuery([POST_DETAIL_KEY, postId], async () => {
    return await axios.get(
      `${API.API_ROOT}/${API.POST.DETAIL.replace(":id", postId)}`
    );
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (post) => {
      return await axios.put(
        `${API.API_ROOT}${API.POST.UPDATE.replace(":id", post.id)}`,
        post.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(POST_LIST_KEY);
      },
    }
  );
};

export const useApprovePost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (approve) => {
      return await axios.put(
        `${API.API_ROOT}${API.POST.APPROVE.replace(":id", approve.id)}`,
        {
          status: approve.publish,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(POST_LIST_KEY);
      },
    }
  );
};
