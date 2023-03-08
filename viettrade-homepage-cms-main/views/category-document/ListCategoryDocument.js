import { useQueryClient } from "@tanstack/react-query";
import { Input, Modal, Select, Space, Table, Tooltip } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import { debounce } from "lodash";

import Button from "~/components/common/Button";
import Loading from "~/components/common/Loading";
import { PAGE_SIZE, roles, status } from "~/constants";
import {
  useDeleteCategoryDocument,
  useListCategoryDocument,
} from "~/hooks/category-document";


const ListCategoryDocument = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isLoading: isLoadingDelete } = useDeleteCategoryDocument();
  const [isLoadingg, setIsLoading] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [categoryDocumentDelete, setCategoryDocumentDelete] = useState(null);
  const pageSizeRef = useRef(PAGE_SIZE)
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageSize: PAGE_SIZE,
      current: 1,
      locale: { items_per_page: "/ trang" },
    },
    sorter: {
      sort: "asc",
      sortColumn: "category_id",
    },
    search: "",
    category_id: null,
  });

  const {
    data: { data: dataCategoryDocument = [], total } = {},
    isLoading: queryLoading,
  } = useListCategoryDocument(tableParams);

  const { data: { data: dataCategoryParent = [] } = {} } =
    useListCategoryDocument({
      pagination: {
        pageSize: null,
        current: 1,
      },
      sorter: {
        sort: "asc",
        sortColumn: "createdAt",
      },
      category_id: 0,
    });
  dataCategoryParent?.map((parent) => {
    parent.label = parent.title_vi;
    parent.value = parent.id;
    return parent;
  });
  
  const useColumns = (t, page, router, handleChangeStatus) => [
    {
      title: <div className="text-center">{t("STT")}</div>,
      dataIndex: "index",
      key: "index",
      width: "1%",
      render: (text, t, index) => (
        <p className="text-center">{(page - 1) * pageSizeRef.current + index + 1}</p>
      ),
    },
    {
      title: <div className="text-center">{t("category-document.title_vi")}</div>,
      dataIndex: "title_vi",
      key: "title_vi",
      width: "50%",
      sorter: () => { },
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_, record) => <p>{record.title_vi}</p>,
    },
    {
      title: (
        <div className="text-center">{t("category-document.category_id")}</div>
      ),
      dataIndex: "category_id",
      key: "category_id",
      sorter: () => { },
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_, record) => <p>{record.parent ? record.parent.title_vi : ""}</p>,
    },
    {
      title: <div className="text-center">{t("common.action")}</div>,
      key: "action",
      width: "150px",
      render: (_, record) => {
        return (
          <Space size="middle" className="flex justify-center">
            <Tooltip placement="top" title='Sửa'>
            <Button
              className="btn btn-info font-medium"
              onClick={() =>
                router.push(`/document-category/edit?id=${record.id}`)
              }
            >
              <div className="parent-icon text-white">
                <BiEdit className="text-[22px]" />
              </div>
            </Button></Tooltip>
            <Tooltip placement="top" title='Xoá'>
            <Button
              className="btn btn-danger font-medium"
              onClick={() => record.handleDelete(record.id)}
            >
              <div className="parent-icon text-white">
                <BiTrash className="text-[22px]" />
              </div>
            </Button></Tooltip>
          </Space>
        );
      },
    },
  ];

  const columns = useColumns(t, tableParams.pagination.current, router);

  useEffect(() => {
    if (queryLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [queryLoading]);

  useEffect(() => {
    if (isLoadingDelete) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDelete]);

  const showModalDelete = (categoryDocumentId) => {
    setCategoryDocumentDelete(categoryDocumentId);
    setOpenModalDelete(true);
  };

  const handleOk = () => {
    if (dataCategoryDocument.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(categoryDocumentDelete);
    setOpenModalDelete(false);
  };

  const handleCancel = () => {
    setCategoryDocumentDelete(null);
    setOpenModalDelete(false);
  };

  dataCategoryDocument?.map((categoryDocument) => {
    categoryDocument.label = categoryDocument.title_vi;
    categoryDocument.value = categoryDocument.id;
    categoryDocument.key = categoryDocument.id;
    categoryDocument.handleDelete = showModalDelete;
    categoryDocument.children = "";
    return categoryDocument;
  });

  const handleDebounce = debounce((value) => {
    setTableParams({
      ...tableParams,
      search: value,
    });
  }, 500);

  const handleSearch = (e) => {
    handleDebounce(e.target.value.trim());
  };

  const onChange = (pagination, filters, sorter, extra) => {
    pageSizeRef.current = pagination.pageSize
    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
      },
      sorter: {
        sort: sorter?.order === "ascend" ? "desc" : "asc",
        sortColumn: sorter?.columnKey,
      },
    });
  };

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold col-6">
            Danh sách danh mục tài liệu
          </p>
          <div className="flex justify-end col-6">
          <Tooltip placement="top" title='Thêm mới'>
            <Button
              className="!bg-green"
              type="button"
              onClick={() => router.push("/document-category/create")}
            >
              <div className="parent-icon text-white">
                <BiPlus className="text-[22px]" />
              </div>
            </Button></Tooltip>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-start">
          <div className="mr-3">
            <label className="form-label pr-3 font-semibold">
              Chọn danh mục:
            </label>
            <Select
              options={[
                { value: null, label: "Lựa chọn" },
                ...dataCategoryParent,
              ]}
              placeholder="Lựa chọn"
              style={{
                width: 120,
              }}
              onChange={(value) =>
                setTableParams({
                  ...tableParams,
                  category_id: value,
                })
              }
            />
          </div>
          <Input.Search
            placeholder={t("common.search")}
            className="mb-6 lg:max-w-[300px] xs:max-w-full"
            onSearch={(value) => {
              setTableParams({
                ...tableParams,
                search: value.trim(),
              });
            }}
            onChange={(e) => handleSearch(e)}
          />
        </div>
        <div className="">
          <Table
            onChange={onChange}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataCategoryDocument}
            pagination={{
              ...tableParams.pagination,
              total: total,
              showSizeChanger: true,
              position: ["bottomLeft"],
            }}
          />
          {isLoadingg ? (
            <div
              className="absolute w-full h-full opacity-80 z-20 top-0"
              style={{
                background: "#fafcff",
              }}
            >
              <Loading
                className="flex align-middle justify-center"
                style={{
                  top: "30%",
                  left: "45%",
                  position: "absolute",
                }}
              ></Loading>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <Modal
        title={t("common.delete_confirm")}
        open={openModalDelete}
        onOk={handleOk}
        centered
        onCancel={handleCancel}
        footer={[
          <Button onClick={handleCancel} className="bg-blue mr-3" key="cancel">
            {t("common.cancel")}
          </Button>,
          <Button onClick={handleOk} className="bg-danger mr-3" key="confirm">
            {t("common.confirm")}
          </Button>,
        ]}
      />
    </div>
  );
};

export default ListCategoryDocument;
