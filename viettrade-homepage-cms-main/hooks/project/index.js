import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import axios from "../../config/Axios";
import {
  API,
  PROJECT_LIST_KEY,
  PROJECT_DETAIL_KEY,
  PAGE_SIZE,
} from "../../constants";

export const useListProject = (tableParams) => {
  const { sort = "desc", sortColumn = "createdAt" } = tableParams.sorter;
  const { pageSize: limit = PAGE_SIZE, current: page = 1 } =
    tableParams.pagination;
  const search = tableParams.search;
  const role = tableParams.role;
  return useQuery(
    [
      PROJECT_LIST_KEY,
      page,
      limit,
      sort,
      sortColumn,
      search,
      role,
    ],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}/${API.PROJECT.LIST}`,
        {
          params: {
            offset: page,
            limit: limit,
            sort: sort,
            sortColumn: sortColumn,
            search: search,
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

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.PROJECT.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PROJECT_LIST_KEY);
      },
    }
  );
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (projectId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.PROJECT.DELETE.replace(":id", projectId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PROJECT_LIST_KEY);
      },
    }
  );
};

export const useDetailProject = (projectId) => {
  return useQuery([PROJECT_DETAIL_KEY, projectId], async () => {
    return await axios.get(
      `${API.API_ROOT}/${API.PROJECT.DETAIL.replace(":id", projectId)}`
    );
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (project) => {
      return await axios.put(
        `${API.API_ROOT}${API.PROJECT.UPDATE.replace(":id", project.id)}`,
        project.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PROJECT_LIST_KEY);
      },
    }
  );
};

