import { Space, Table, Modal, Input, Tooltip, Typography, Select } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BiEdit, BiTrash, BiPlus, BiMenu } from "react-icons/bi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { debounce } from "lodash";

import Button from "../../components/common/Button";
import { useListStructure, useDeleteStructure } from "../../hooks/structure";
import { PAGE_SIZE } from "~/constants";
import { AdminContext } from "~/contexts/AdminContext";
import Loading from "~/components/common/Loading";


const ListStructure = () => {
  const { t } = useTranslation("common");
  const { admin } = useContext(AdminContext);
  const [openModal, setOpenModal] = useState(false);
  const [structureIdDelete, setStructureIdDelete] = useState(null);
  const [isLoadingg, setIsLoading] = useState(false);
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
    role: admin?.role,
  });
  const pageSizeRef = useRef(PAGE_SIZE);

  const { data: { data: dataStructure = [], total } = {}, isLoading } =
    useListStructure(tableParams);
  const {
    mutate,
    isLoading: isLoadingDelete,
    isSuccess,
  } = useDeleteStructure();
  const router = useRouter();
  const useColumns = (t, router, page) => {
    const { admin } = useContext(AdminContext);
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
        title: <div className="text-center">Tên đơn vị</div>,
        dataIndex: "full_name_vi",
        key: "full_name_vi",
        render: (_, record) => <a>{record.full_name_vi}</a>,
        sortDirections: ["descend", "ascend", "descend"],
        sorter: () => { },
      },
      {
        title: <div className="text-center">{t("common.action")}</div>,
        key: "action",
        className: "max-w-[100px]",
        width: "180px",
        render: (_, record) => {
          return (
            <Space size="middle" className="flex justify-center">
              <Tooltip placement="top" title='Xem chi tiết'>
                <Button
                  className="btn-primary btn"
                  onClick={() =>
                    router.push(`/structure/sub-structure?id=${record?.id}`)
                  }
                >
                  <div className="parent-icon text-white">
                    <BiMenu className="text-[22px]" />
                  </div>
                </Button>
              </Tooltip>
              <Tooltip placement="top" title='Sửa'>
                <Button
                  className="btn-info btn"
                  onClick={() => router.push(`/structure/edit?id=${record.id}`)}
                >
                  <div className="parent-icon text-white">
                    <BiEdit className="text-[22px]" />
                  </div>
                </Button>
              </Tooltip>
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
    if (dataStructure.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(structureIdDelete);
  };
  const showModal = (structureId) => {
    setOpenModal(true);
    setStructureIdDelete(structureId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setStructureIdDelete(null);
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

  dataStructure?.map((structure) => {
    structure.key = structure.id;
    structure.showModal = showModal;
    return structure;
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

  useEffect(() => {
    setTableParams({
      ...tableParams,
      role: admin?.role,
    });
  }, [admin]);

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách đơn vị</p>
          <Tooltip placement="top" title='Thêm mới'>
            <Button
              className="btn-success btn"
              onClick={() => router.push(`/structure/create`)}
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
            dataSource={dataStructure}
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

export default ListStructure;
