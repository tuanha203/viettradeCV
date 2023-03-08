import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../config/Axios";
import {
  API,
  CATEGORY_DOCUMENT_DETAIL_KEY,
  CATEGORY_DOCUMENT_LIST_KEY,
} from "../../constants";

export const useCreateCategoryDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(
        `${API.API_ROOT}${API.CATEGORY_DOCUMENT.CREATE}`,
        data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CATEGORY_DOCUMENT_LIST_KEY);
      },
    }
  );
};

export const useUpdateCategoryDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (categoryDocument) => {
      return await axios.put(
        `${API.API_ROOT}${API.CATEGORY_DOCUMENT.UPDATE.replace(
          ":id",
          categoryDocument.id
        )}`,
        categoryDocument
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CATEGORY_DOCUMENT_LIST_KEY);
      },
    }
  );
};

export const useDeleteCategoryDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (categoryDocumentId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.CATEGORY_DOCUMENT.DELETE.replace(
          ":id",
          categoryDocumentId
        )}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CATEGORY_DOCUMENT_LIST_KEY);
      },
    }
  );
};

export const useListCategoryDocument = (tableParams) => {
  const { sort = "asc", sortColumn = "category_id" } = tableParams.sorter;
  const { pageSize: limit = PAGE_SIZE, current: page = 1 } =
    tableParams.pagination;
  const search = tableParams.search;
  const category_id = tableParams.category_id;
  return useQuery(
    [
      CATEGORY_DOCUMENT_LIST_KEY,
      page,
      limit,
      sort,
      sortColumn,
      search,
      category_id,
    ],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}${API.CATEGORY_DOCUMENT.LIST}`,
        {
          params: {
            offset: page,
            limit: limit,
            sort: sort,
            sortColumn: sortColumn,
            search: search,
            category_id: category_id,
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

export const useDetailCategoryDocument = (categoryDocumentId) => {
  return useQuery(
    [CATEGORY_DOCUMENT_DETAIL_KEY, categoryDocumentId],
    async () => {
      return await axios.get(
        `${API.API_ROOT}${API.CATEGORY_DOCUMENT.DETAIL.replace(
          ":id",
          categoryDocumentId
        )}`
      );
    }
  );
};
