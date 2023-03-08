import API from "./API";

export { API };
export * from "./API";
export * from "./QueryKeys";

export const roles = [
  {
    value: 0,
    label: "Quản trị viên",
  },
  {
    value: 1,
    label: "Biên tập viên",
  },
  {
    value: 2,
    label: "Quản lý",
  },
];

export const permissions = {
  admin: 0,
  content: 1,
  manager: 2,
};

export const postStatus = {
  publish: 1,
  private: 0,
  draft: 2,
};

export const companyStatus = {
  active: 1,
  inactive: 0,
};

export const publishOptions = [
  { value: 1, label: "Công khai" },
  { value: 0, label: "Riêng tư" },
];

export const publishEditorOptions = [
  { value: 1, label: "Công khai" },
  // { value: 2, label: "Nháp" },
  { value: 0, label: "Riêng tư" },
];

export const status = [
  {
    value: 1,
    label: "Kích hoạt",
  },
  {
    value: 2,
    label: "Chưa kích hoạt",
  },
];

export const types = [
  {
    value: 0,
    label: "Trong nước",
  },
  {
    value: 1,
    label: "Ngoài nước",
  },
];

export const PAGE_SIZE = 10;

export const SUPPORTED_FORMATS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "text/plain",
];

export const SORT_TITLE = {
  ASC: 'ASC',
  DESC: "DESC",
  NONE: ''
}
