import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { setDefaultHeaders } from "../../config/Axios";
import {
  API,
  PUBLICATION_DETAIL_KEY,
  PUBLICATION_LIST_KEY,
} from "../../constants";

export const useCreatePublication = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.PUBLICATION.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PUBLICATION_LIST_KEY);
      },
    }
  );
};

export const useUpdatePublication = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (publication) => {
      return await axios.put(
        `${API.API_ROOT}${API.PUBLICATION.UPDATE.replace(
          ":id",
          publication.id
        )}`,
        publication.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PUBLICATION_LIST_KEY);
      },
    }
  );
};

export const useDeletePublication = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (publicationId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.PUBLICATION.DELETE.replace(":id", publicationId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PUBLICATION_LIST_KEY);
      },
    }
  );
};

export const useListPublication = (tableParams) => {
  const { sort, sortColumn } = tableParams.sorter;
  const { pageSize: limit = PAGE_SIZE, current: page = 1 } =
    tableParams.pagination;
  const search = tableParams.search;
  return useQuery(
    [PUBLICATION_LIST_KEY, page, limit, sort, sortColumn, search],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}${API.PUBLICATION.LIST}`,
        {
          params: {
            offset: page,
            limit: limit,
            sort: sort,
            sortColumn: sortColumn,
            search: search,
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

export const useDetailPublication = (publicationId) => {
  return useQuery([PUBLICATION_DETAIL_KEY, publicationId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.PUBLICATION.DETAIL.replace(":id", publicationId)}`
    );
  });
};
