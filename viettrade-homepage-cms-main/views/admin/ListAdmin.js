import { useQueryClient } from "@tanstack/react-query";
import { Input, Modal, Select, Space, Tooltip, Table } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import { debounce } from "lodash";
import { AdminContext } from "~/contexts/AdminContext";
import Button from "~/components/common/Button";
import Loading from "~/components/common/Loading";
import noImage from "../../public/images/no-avatar.png";
import Image from "next/image";
import {
  permissions,
  ADMIN_LIST_KEY,
  PAGE_SIZE,
  roles,
  status,
} from "~/constants";
import {
  useDeleteAdmin,
  useListAdmin,
  useUpdateAdminStatus,
} from "~/hooks/admin";

const ListAdmin = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isLoading: isLoadingDelete } = useDeleteAdmin();
  const { mutate: mutateStatusAdmin, isLoading: isLoadingUpdateStatus } =
    useUpdateAdminStatus();
  const { admin } = useContext(AdminContext);
  const [isLoadingg, setIsLoading] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [adminDelete, setAdminDelete] = useState(null);
  const pageSizeRef = useRef(PAGE_SIZE);

  const [tableParams, setTableParams] = useState({
    pagination: {
      pageSize: PAGE_SIZE,
      current: 1,
      locale: { items_per_page: "/ trang" },
    },
    sorter: {
      sort: undefined,
      sortColumn: undefined,
    },
    search: "",
    status: null,
    role: null,
  });

  const {
    data: { data: dataAdmin = [], total } = {},
    isLoading: isLoadingList,
  } = useListAdmin(tableParams);

  const handleChangeStatus = (id, checked) => {
    if (checked) {
      mutateStatusAdmin({ status: 1, id: id });
    } else {
      mutateStatusAdmin({ status: 2, id: id });
    }
  };
  useEffect(() => {
    if (isLoadingList) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingList]);

  useEffect(() => {
    if (isLoadingUpdateStatus) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingUpdateStatus]);

  useEffect(() => {
    if (isLoadingDelete) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDelete]);
  

  const useColumns = (t, page, router, handleChangeStatus, admin) => [
    {
      title: <div className="text-center">{"STT"}</div>,
      dataIndex: "index",
      key: "index",
      width: "1%",
      render: (text, t, index) => (
        <p className="text-center">
          {(page - 1) * pageSizeRef.current + index + 1}
        </p>
      ),
    },
    {
      title: <div className="text-center">{t("common.feature_image")}</div>,
      width: "10%",
      render: (record) => {
        return (
          <div
            className="overflow-hidden"
            style={{ width: "80px", height: "80px" }}
          >
            {record.feature_image ? (
              <img
                className="overflow-hidden img-table"
                src={record.feature_image}
                alt=""
              />
            ) : (
              <Image src={noImage} className="object-cover" alt="noImageListAdmin" />
            )}
          </div>
        );
      },
    },
    {
      title: <div className="text-center">{t("user.name")}</div>,
      dataIndex: "name",
      key: "name",
      width: "20%",
      sorter: () => {},
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_, record) => (
        <a onClick={() => showModal(record)}>{record.name}</a>
      ),
    },
    {
      title: <div className="text-center">Email</div>,
      dataIndex: "email",
      key: "email",
      sorter: () => {},
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: <div className="text-center">{t("user.status")}</div>,
      dataIndex: "status",
      key: "status",
      sorter: () => { },
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_, record) => (
        <div className="form-check form-switch flex justify-center">
          <input
            className="form-check-input"
            type="checkbox"
            id={`checkbox-${record.id}`}
            name={`checkbox-${record.id}`}
            checked={record.status === 1 ? true : false}
            disabled={record.id == localStorage.getItem("id") ? true : false}
            onChange={(e) => handleChangeStatus(record.id, e.target.checked)}
          />          
        </div>
      ),
    },
    {
      title: <div className="text-center">{t("user.role")}</div>,
      key: "role",
      dataIndex: "role",
      sorter: () => { },
      sortDirections: ["ascend", "descend", "ascend"],
      render(_, record) {
        return (
          <div className="text-center">
            {roles.find((role) => role.value === record.role)?.label}
          </div>
        );
      },
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
              onClick={() => router.push(`/admin/edit?id=${record.id}`)}
            >
              <div className="parent-icon text-white">
                <BiEdit className="text-[22px]" />
              </div>
            </Button></Tooltip>
            <Tooltip placement="top" title='Xoá'>
            <Button
              className="btn btn-danger font-medium"
              onClick={() => record.handleDelete(record.id)}
              disabled={admin.id === record.id ? true : false}
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

  const columns = useColumns(
    t,
    tableParams.pagination.current,
    router,
    handleChangeStatus,
    admin
  );

  const showModalDelete = (userId) => {
    setAdminDelete(userId);
    setOpenModalDelete(true);
  };
  const handleOk = () => {
    if (dataAdmin.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(adminDelete);
    setOpenModalDelete(false);
  };
  const handleCancel = () => {
    setAdminDelete(null);
    setOpenModalDelete(false);
  };

  dataAdmin?.map((user) => {
    user.key = user.id;
    user.handleDelete = showModalDelete;
    return user;
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
    pageSizeRef.current = pagination.pageSize;

    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
      },
      sorter: {
        sort: sorter?.order === "ascend" ? "asc" : "desc",
        sortColumn: sorter?.columnKey,
      },
    });
  };
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold col-6">
            Danh sách quản trị viên
          </p>
          <div className="flex justify-end col-6">
          <Tooltip placement="top" title='Thêm mới'>
            <Button
              className="!bg-green"
              type="button"
              onClick={() => router.push("/admin/create")}
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
              Chọn vai trò :{" "}
            </label>
            <Select
              options={[{ value: null, label: "Lựa chọn" }, ...roles]}
              placeholder="Lựa chọn"
              style={{
                width: 120,
              }}
              onChange={(value) =>
                setTableParams({
                  ...tableParams,
                  role: value,
                })
              }
            />
          </div>
          <div className="mr-3">
            <label className="form-label pr-3 font-semibold">
              Chọn trạng thái :{" "}
            </label>
            <Select
              options={[{ value: null, label: "Lựa chọn" }, ...status]}
              placeholder="Lựa chọn"
              style={{
                width: 160,
              }}
              onChange={(value) =>
                setTableParams({
                  ...tableParams,
                  status: value,
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
        <div className="relative">
          <Table
            onChange={onChange}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataAdmin}
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

export default ListAdmin;
