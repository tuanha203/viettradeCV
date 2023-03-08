import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../config/Axios";
import {
  API,
  PUBLICATION_DETAIL_KEY,
  PUBLICATION_LIST_KEY,
} from "../../constants";

export const useCreateDocument =  () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.DOCUMENT.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PUBLICATION_LIST_KEY);
      },
    }
  );
};

export const useUpdateDocument =  () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (document) => {
      return await axios.put(
        `${API.API_ROOT}${API.DOCUMENT.UPDATE.replace(
          ":id",
          document.id
        )}`,
        document.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PUBLICATION_LIST_KEY);
      },
    }
  );
};

export const useDeleteDocument =  () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (documentId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.DOCUMENT.DELETE.replace(":id", documentId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PUBLICATION_LIST_KEY);
      },
    }
  );
};

export const useListDocument =  (tableParams) => {
  const { sort = "desc", sortColumn = "id" } = tableParams.sorter;
  const { pageSize: limit = PAGE_SIZE, current: page = 1 } =
    tableParams.pagination;
  const search = tableParams.search;
  const category_id = tableParams.category_id;
  return useQuery(
    [PUBLICATION_LIST_KEY, page, limit, sort, sortColumn, search, category_id],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}${API.DOCUMENT.LIST}`,
        {
          params: {
            offset: page,
            limit: limit,
            sort: sort,
            sortColumn: sortColumn,
            search: search,
            category_id: category_id
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

export const useDetailDocument =  (documentId) => {
  return useQuery([PUBLICATION_DETAIL_KEY, documentId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.DOCUMENT.DETAIL.replace(":id", documentId)}`
    );
  });
};
