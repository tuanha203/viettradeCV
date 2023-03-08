import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { setDefaultHeaders } from "../../config/Axios";
import {
  API,
  DEPARTMENT_DETAIL_KEY,
  DEPARTMENT_LIST_KEY,
} from "../../constants";

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.DEPARTMENT.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(DEPARTMENT_LIST_KEY);
      },
    }
  );
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (department) => {
      return await axios.put(
        `${API.API_ROOT}${API.DEPARTMENT.UPDATE.replace(":id", department.id)}`,
        department.formData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(DEPARTMENT_LIST_KEY);
      },
    }
  );
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (departmentId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.DEPARTMENT.DELETE.replace(":id", departmentId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(DEPARTMENT_LIST_KEY);
      },
    }
  );
};

export const useListDepartment = (tableParams) => {
  const { sort = "desc", sortColumn = "id" } = tableParams.sorter;
  const { pageSize: limit = PAGE_SIZE, current: page = 1 } =
    tableParams.pagination;
  const search = tableParams.search;
  const parent_id = tableParams.parent_id;
  return useQuery(
    [DEPARTMENT_LIST_KEY, page, limit, sort, sortColumn, search],
    async () => {
      const { data, headers } = await axios.get(
        `${API.API_ROOT}${API.DEPARTMENT.LIST}`,
        {
          params: {
            offset: page,
            limit: limit,
            sort: sort,
            sortColumn: sortColumn,
            search: search,
            parent_id: parent_id,
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

export const useDetailDepartment = (departmentId) => {
  return useQuery([DEPARTMENT_DETAIL_KEY, departmentId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.DEPARTMENT.DETAIL.replace(":id", departmentId)}`
    );
  });
};
