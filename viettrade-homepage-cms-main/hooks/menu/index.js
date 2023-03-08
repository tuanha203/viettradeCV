import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "../../config/Axios";
import {
  API,
  MENU_LIST_KEY,
  MENU_DETAIL_KEY,
  SUBMENU_LIST_KEY,
} from "../../constants";

export const useListMenu = () => {
  return useQuery([MENU_LIST_KEY], async () => {
    return await axios.get(`${API.API_ROOT}${API.MENU.LIST}`);
  });
};

export const useListSubMenu = (menuId) => {
  return useQuery([SUBMENU_LIST_KEY, menuId], async () => {
    return await axios.get(
      `${API.API_ROOT}${API.MENU.LIST_SUB_MENU.replace(":id", menuId)}`
    );
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.post(`${API.API_ROOT}${API.MENU.CREATE}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MENU_LIST_KEY);
      },
    }
  );
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (menuId) => {
      return await axios.delete(
        `${API.API_ROOT}${API.MENU.DELETE.replace(":id", menuId)}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MENU_LIST_KEY);
      },
    }
  );
};

export const useDetailMenu = (menuId) => {
  return useQuery([MENU_DETAIL_KEY, menuId], async () => {
    return await axios.get(
      `${API.API_ROOT}/${API.MENU.DETAIL.replace(":id", menuId)}`
    );
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (menu) => {
      return await axios.put(
        `${API.API_ROOT}${API.MENU.UPDATE.replace(":id", menu.id)}`,
        menu
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MENU_LIST_KEY);
      },
    }
  );
};

export const useUpdateDisplayMenu = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data) => {
      return await axios.put(`${API.API_ROOT}${API.MENU.UPDATE_DISPLAY}`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MENU_LIST_KEY);
      },
    }
  );
};
