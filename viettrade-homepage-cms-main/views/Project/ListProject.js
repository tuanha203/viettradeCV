import { Input, Modal, Space, Table,Tooltip, Typography } from "antd";
import { debounce } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  BiEdit, BiPlus, BiTrash
} from "react-icons/bi";

import Loading from "~/components/common/Loading";
import {
  PAGE_SIZE, permissions
} from "~/constants";
import { AdminContext } from "~/contexts/AdminContext";
import Button from "../../components/common/Button";
import { useDeleteProject, useListProject } from "../../hooks/project";
import noImage from "../../public/images/no-image.png";

const ListProject = () => {
  const { t } = useTranslation("common");
  const { admin } = useContext(AdminContext);
  const [openModal, setOpenModal] = useState(false);
  const [projectIdDelete, setProjectIdDelete] = useState(null);
  const pageSizeRef = useRef(PAGE_SIZE)
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

  const { data: { data: dataProject = [], total } = {}, isLoading } =
    useListProject(tableParams);
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteProject();
  const [isLoadingg, setIsLoading] = useState(false);
  const router = useRouter();
  const useColumns = (t, router, page) => {
    const { admin } = useContext(AdminContext);
    return [
      {
        title: <div className="text-center">STT</div>,
        dataIndex: "id",
        key: "id",
        width: "1%",
        sortDirections: ["ascend", "descend", "ascend"],
        sorter: () => {},
        render: (text, t, index) => (
          <div>{(page - 1) * pageSizeRef.current + index + 1}</div>
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
              <img
                className="overflow-hidden img-table"
                src={record.feature_image ? record.feature_image : noImage.src}
                alt=""
              />
            </div>
          );
        },
      },
      {
        title: <div className="text-center">{t("common.title")}</div>,
        dataIndex: "title_vi",
        key: "title_vi",
        render: (text) => (
          <Typography.Paragraph ellipsis={{ rows: 2 }}>
            {text}
          </Typography.Paragraph>
        ),
        sortDirections: ["descend", "ascend", "descend"],
        sorter: () => {

        },
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
                onClick={() => router.push(`/project/edit?id=${record.id}`)}
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

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoadingDelete) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDelete]);

  const columns = useColumns(
    t,
    router,
    tableParams.pagination.current
  );
  const handleDelete = () => {
    if (dataProject.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(projectIdDelete);
  };
  const showModal = (projectId) => {
    setOpenModal(true);
    setProjectIdDelete(projectId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setProjectIdDelete(null);
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

  dataProject?.map((project) => {
    project.key = project.id;
    project.showModal = showModal;
    return project;
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
        sortColumn: sorter?.columnKey === "id" ? "createdAt" : sorter?.columnKey,
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
          <p className="text-[20px] font-semibold">Danh sách dự án</p>
          <Tooltip placement="top" title='Thêm mới'>
          <Button
            className="btn-success btn"
            onClick={() => router.push(`/project/create`)}
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
            columns={
              admin?.role === permissions.content
                ? columns.filter((cl) => cl.dataIndex !== "approve")
                : columns
            }
            rowKey={(record) => record.id}
            dataSource={dataProject}
            onChange={onChange}
            pagination={{
              ...tableParams.pagination,
              total: total,
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

export default ListProject;
