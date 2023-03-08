import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { setDefaultHeaders } from "../../config/Axios";
import { API, COMPANY_DETAIL_KEY, COMPANY_LIST_KEY } from "../../constants";

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.COMPANY.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(COMPANY_LIST_KEY);
      },
    }
  );
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (company) => {
      return await axios.put(
        `${API.API_ROOT}${API.COMPANY.UPDATE.replace(":id", company.id)}`,
        company.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(COMPANY_LIST_KEY);
      },
    }
  );
};

export const useUpdateDisplayCompany = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (company) => {
      return await axios.put(
        `${API.API_ROOT}${API.COMPANY.UPDATE_DISPLAY.replace(
          ":id",
          company.id
        )}`,
        company
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(COMPANY_LIST_KEY);
      },
    }
  );
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (companyId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.COMPANY.DELETE.replace(":id", companyId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(COMPANY_LIST_KEY);
      },
    }
  );
};

export const useListCompany = (tableParams) => {
  const { sort = "asc", sortColumn = "display" } = tableParams.sorter;
  const { pageSize: limit = PAGE_SIZE, current: page = 1 } =
    tableParams.pagination;
  const search = tableParams.search;
  return useQuery(
    [COMPANY_LIST_KEY, page, limit, sort, sortColumn, search],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}${API.COMPANY.LIST_ALL}`,
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

export const useDetailCompany = (companyId) => {
  return useQuery([COMPANY_DETAIL_KEY, companyId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.COMPANY.DETAIL.replace(":id", companyId)}`
    );
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (approve) => {
      return await axios.put(
        `${API.API_ROOT}${API.COMPANY.APPROVE.replace(":id", approve.id)}`,
        {
          status: approve.status,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(COMPANY_LIST_KEY);
      },
    }
  );
};
