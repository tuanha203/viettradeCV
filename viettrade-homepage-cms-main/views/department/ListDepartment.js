/* eslint-disable @next/next/no-img-element */
import { Space, Table, Modal, Input, Tooltip, Typography, Select } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BiEdit, BiTrash, BiPlus } from "react-icons/bi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { debounce } from "lodash";

import Button from "../../components/common/Button";
import { PAGE_SIZE } from "~/constants";
import Loading from "~/components/common/Loading";
import { useDeleteDepartment, useListDepartment } from "~/hooks/department";


const ListDepartment = () => {
  const { t } = useTranslation("common");
  const [openModal, setOpenModal] = useState(false);
  const [departmentIdDelete, setDepartmentIdDelete] = useState(null);
  const [isLoadingg, setIsLoading] = useState(false);
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
    search: "",
  });

  const { data: { data: dataDepartment = [], total } = {}, isLoading } =
    useListDepartment(tableParams);
  const {
    mutate,
    isLoading: isLoadingDelete,
    isSuccess,
  } = useDeleteDepartment();
  const router = useRouter();

  const useColumns = (t, router, page) => {
    return [
      {
        title: <div className="text-center">STT</div>,
        dataIndex: "id",
        key: "id",
        width: "1%",
        render: (text, t, index) => (
          <div>{(page - 1) * pageSizeRef.current + index + 1}</div>
        ),
      },
      {
        title: <div className="text-center">{t("common.feature_image")}</div>,
        width: "30%",
        render: (record) => {
          return (
            <div className="max-w-[80px] max-h-[80px] overflow-hidden">
              <img
                className="overflow-hidden"
                src={record.feature_image}
                alt=""
              />
            </div>
          );
        },
      },
      {
        title: <div className="text-center">Tên</div>,
        dataIndex: "full_name",
        key: "full_name",
        render: (_, record) => <a>{record.full_name}</a>,
        sortDirections: ["descend", "ascend", "descend"],
        sorter: () => { },
      },
      {
        title: <div className="text-center">Chức vụ</div>,
        key: "position_vi",
        dataIndex: "position_vi",
        width: "20%",
        render: (_, record) => <a>{record.position_vi}</a>,
        sortDirections: ["descend", "ascend", "descend"],
      },
      {
        title: <div className="text-center">{t("common.action")}</div>,
        key: "action",
        className: "max-w-[100px]",
        width: "180px",
        render: (_, record) => {
          return (
            <Space size="middle" className="flex justify-center">
              <Tooltip placement="top" title='Sửa'>
                <Button
                  className="btn-info btn"
                  onClick={() => router.push(`/department/edit?id=${record.id}`)}
                >
                  <div className="parent-icon text-white">
                    <BiEdit className="text-[22px]" />
                  </div>
                </Button></Tooltip>
              <Tooltip placement="top" title='Xoá'>
                <Button
                  className="btn-danger btn"
                  onClick={() => record.showModal(record.id)}
                >
                  <div className="parent-icon text-white">
                    <BiTrash className="text-[22px]" />
                  </div>
                </Button>
              </Tooltip>
            </Space>
          );
        },
      },
    ];
  };

  const columns = useColumns(t, router, tableParams.pagination.current);

  useEffect(() => {
    if (isLoadingDelete) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDelete]);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleDelete = () => {
    if (dataDepartment.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(departmentIdDelete);
  };
  const showModal = (departmentId) => {
    setOpenModal(true);
    setDepartmentIdDelete(departmentId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setDepartmentIdDelete(null);
    setOpenModal(false);
  };

  const handleDebounce = debounce((value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      search: value,
    });
  }, 500);

  const handleSearch = (e) => {
    handleDebounce(e.target.value.trim());
  };

  dataDepartment?.map((department) => {
    department.key = department.id;
    department.showModal = showModal;
    return department;
  });

  const onChange = (pagination, filters, sorter, extra) => {
    pageSizeRef.current = pagination.pageSize
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
          <p className="text-[20px] font-semibold">Danh sách lãnh đạo cục</p>
          <Tooltip placement="top" title='Thêm mới'>
            <Button
              className="btn-success btn"
              onClick={() => router.push(`/department/create`)}
            >
              <div className="parent-icon text-white">
                <BiPlus className="text-[22px]" />
              </div>
            </Button>
          </Tooltip>
        </div>
        <hr className="my-4" />
        <div className="flex justify-end">
          <Input.Search
            placeholder={t("common.search")}
            className="mb-6 lg:max-w-[300px] xs:max-w-full"
            onSearch={(value) => {
              setTableParams({
                ...tableParams,
                pagination: {
                  ...tableParams.pagination,
                  current: 1,
                },
                search: value.trim(),
              });
            }}
            onChange={(e) => handleSearch(e)}
          />
        </div>

        <div className="">
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataDepartment}
            onChange={onChange}
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
        open={openModal}
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

export default ListDepartment;
