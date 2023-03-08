import {
  Space,
  Table,
  Tag,
  Input,
  Modal,
  Tooltip,
  Descriptions,
  Badge,
  Select,
} from "antd";
import Button from "../../components/common/Button";
import React, { useEffect, useRef, useState } from "react";
import { useListUser, useDeleteUser, useUpdateUser } from "../../hooks/user";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Loading from "../../components/common/Loading";
import { BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import { PAGE_SIZE, status } from "~/constants";
import { debounce } from "lodash";

const User = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteUser();
  const { mutate: mutateStatusChange, isLoading: isLoadingUpdateStatus } =
    useUpdateUser();
  const [searchedText, setSearchedText] = useState("");
  const [page, setPage] = useState(1);
  const [isLoadingg, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userIdDelete, setUserIdDelete] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const pageSizeRef = useRef(PAGE_SIZE);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: PAGE_SIZE,
      locale: { items_per_page: "/ trang" },
    },
    sorter: {
      sortColumn: "",
      sort: "",
    },
    status: null,
    search: "",
  });

  const { data: { data: dataUser = [], total } = {}, isLoading } =
    useListUser(tableParams);

  const handleDelete = () => {
    if (dataUser.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(userIdDelete);
  };

  const showDeleteModal = (categoryId) => {
    setOpenDeleteModal(true);
    setUserIdDelete(categoryId);
  };
  const handleDeleteOk = () => {
    handleDelete();
    setOpenDeleteModal(false);
  };
  const handleDeleteCancel = () => {
    setUserIdDelete(null);
    setOpenDeleteModal(false);
  };

  const handleDebounce = debounce((value) => {
    setTableParams({
      ...tableParams,
      search: value,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  }, 500);
const handleSearch = (e) =>{
  handleDebounce(e.target.value.trim());
}
  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);

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

  const handleChangeStatus = (id, checked) => {
    if (checked) {
      mutateStatusChange({ status: 1, id: id });
    } else {
      mutateStatusChange({ status: 2, id: id });
    }
  };

  const onChange = (pagination, filters, sorter, extra) => {
    setPage(pagination.current);
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
  const columns = [
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
      title: <div className="text-center">{t("user.name")}</div>,
      dataIndex: "name",
      key: "name",
      render: (_, record) => <> {record.name}</>,
      sortDirections: ["descend", "ascend", "descend"],
      sorter: () => {},
    },
    {
      title: <div className="text-center">Email</div>,
      dataIndex: "email",
      key: "email",
      sortDirections: ["descend", "ascend", "descend"],
      sorter: () => {},
    },
    {
      title: <div className="text-center">{t("user.status")}</div>,
      dataIndex: "status",
      key: "status",
      sortDirections: ["descend", "ascend", "descend"],
      sorter: () => {},
      render: (_, record) => (
        <div className="form-check form-switch flex justify-center">
          <input
            className="form-check-input"
            type="checkbox"
            id={`checkbox-${record.id}`}
            name={`checkbox-${record.id}`}
            checked={record.status == 1 ? true : false}
            onChange={(e) => handleChangeStatus(record.id, e.target.checked)}
          />
        </div>
      ),
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
              className="btn-info font-medium"
              onClick={() => router.push(`/user/edit?id=${record.id}`)}
            >
              <div className="parent-icon text-white">
                <BiEdit className="text-[22px]" />
              </div>
            </Button></Tooltip>
            <Tooltip placement="top" title='Xoá'>
            <Button
              className="btn-danger font-medium"
              onClick={() => record.showDeleteModal(record.id)}
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

  dataUser?.map((user) => {
    user.key = user.id;
    user.showDeleteModal = showDeleteModal;
    return user;
  });

  return (
    <>
      <div className="card radius-15">
        <div className="card-body">
          <div className="card-title flex justify-between">
            <p className="text-[20px] font-semibold col-6">
              Danh sách người dùng
            </p>
            <div className="flex justify-end col-6">
            <Tooltip placement="top" title='Thêm mới'>
              <Button
                className="!bg-green"
                type="button"
                onClick={() => router.push("/user/create")}
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
                Chọn trạng thái :
              </label>
              <Select
                options={[{ value: null, label: "Lựa chọn" }, ...status]}
                placeholder="Lựa chọn"
                style={{
                  width: 120,
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
          <div className="">
            {isLoadingg ? (
              <Loading />
            ) : (
              <Table
                columns={columns}
                dataSource={dataUser}
                onChange={onChange}
                rowKey={(record) => record.id}
                pagination={{
                  ...tableParams.pagination,
                  total: total,
                  showSizeChanger: true,
                  position: ["bottomLeft"],
                }}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        title={t("common.delete_confirm")}
        open={openDeleteModal}
        onOk={handleDeleteOk}
        centered
        onCancel={handleDeleteCancel}
        footer={[
          <Button
            onClick={handleDeleteCancel}
            className="bg-blue mr-3"
            key="cancel"
          >
            {t("common.cancel")}
          </Button>,
          <Button
            onClick={handleDeleteOk}
            className="bg-danger mr-3"
            key="confirm"
          >
            {t("common.confirm")}
          </Button>,
        ]}
      />
    </>
  );
};

export default User;
