export interface ICommonAttr {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormExcludedAttr {
  id?: never;
  createdAt?: never;
  updatedAt?: never;
}

export interface ICommonSearchOption {
  limit?: number | string;
  offset?: number | string;
}

export type FormData<T> = {
  [P in keyof T]: T[P] | string;
};
