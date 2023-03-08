import { Space, Table, Input,Tooltip, Modal } from "antd";
import { BiEdit, BiTrash, BiPlus, BiMove } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import Button from "../../components/common/Button";
import { useRouter } from "next/router";
import Loading from "~/components/common/Loading";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useDeleteCompany,
  useListCompany,
  useUpdateCompany,
  useUpdateDisplayCompany,
  useUpdateStatus,
} from "~/hooks/company";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { PAGE_SIZE, COMPANY_LIST_KEY, companyStatus } from "~/constants";

const ListCompany = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const {
    mutate: mutateConnectiveChange,
    isLoading: isLoadingConnectiveChange,
  } = useUpdateCompany();
  const { mutate,
    isLoading: isLoadingDeleteCompany, isSuccess } = useDeleteCompany();
  const {
    mutate: mutateUpdateDisplay,
    isLoading: isLoadingUpdateDisplay,
    isSuccess: isSuccessUpdateDisplay,
  } = useUpdateDisplayCompany();
  const { mutate: mutateUpdateStatus, isLoading: isLoadingUpdateStatus } =
    useUpdateStatus();
  const [isLoadingg, setIsLoading] = useState(false);
  const [companyModal, setCompanyModal] = useState({ id: null });
  const [companyIdDelete, setCompanyIdDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();
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
  });
  const { data: { data: dataCompany = [], total } = {}, isLoading } =
    useListCompany(tableParams);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Xóa doanh nghiệp thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [isSuccess]);
  const schema = yup.object().shape({
    display: yup
      .number()
      .typeError("Số thứ tự phải là một số")
      .required("Số thứ tự là bắt buộc")
      .min(1, "Số thứ tự phải lớn hơn hoặc bằng 1"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const columns = [
    {
      title: <div className="text-center">STT</div>,
      dataIndex: "id",
      key: "id",
      width: "9%",
      render: (text, t, index) => (
        <div className="text-center">
          {(tableParams.pagination.current - 1) * pageSizeRef.current + index + 1}
        </div>
      ),
    },
    {
      title: <div className="text-center">{t("company.name")}</div>,
      dataIndex: "name_vi",
      key: "name_vi",
      render: (_, record) => <a>{record.name_vi}</a>,
      sortDirections: ["descend", "ascend", "descend"],
      sorter: () => { },
    },
    {
      title: <div className="text-center">{t("common.feature_image")}</div>,
      width: "10%",
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
      title: <div className="text-center">{t("company.connective")}</div>,
      dataIndex: "connective",
      key: "connective",
      render: (_, record) => (
        <div className="form-check form-switch flex justify-center">
          <input
            className="form-check-input"
            type="checkbox"
            id={`checkbox-${record.id}`}
            name={`checkbox-${record.id}`}
            checked={record.connective ? true : false}
            onChange={(e) =>
              handleChangeConnective(record.id, e.target.checked)
            }
          />
        </div>
      ),
      sortDirections: ["descend", "ascend", "descend"],
      sorter: () => { },
    },
    {
      title: <div className="text-center">Duyệt</div>,
      dataIndex: "approve",
      key: "approve",
      sortDirections: ["descend", "ascend", "descend"],
      sorter: () => { },
      render: (_, record) => (
        <div className="form-check form-switch flex justify-center">
          <input
            className="form-check-input"
            type="checkbox"
            id={`checkbox-${record.id}`}
            name={`checkbox-${record.id}`}
            checked={record.status == companyStatus.active ? true : false}
            onChange={(e) =>
              mutateUpdateStatus({
                id: record.id,
                status:
                  record.status === companyStatus.active
                    ? companyStatus.inactive
                    : companyStatus.active,
              })
            }
          />
        </div>
      ),
    },
    {
      title: <div className="text-center">{t("common.action")}</div>,
      key: "action",
      width: "10%",
      render: (_, record, index) => {
        return (
          <Space size="middle" className="flex justify-center">
              <Tooltip placement="top" title='Sắp xếp'>
            <Button
              className="btn-warning font-medium"
              onClick={() => showModal(record.id, record.display)}
            >
              <div className="parent-icon text-white">
                <BiMove className="text-[22px]" />
              </div>
            </Button></Tooltip>
            <Tooltip placement="top" title='Sửa'>
            <Button
              className="btn-info font-medium"
              onClick={() => router.push(`/company/edit?id=${record.id}`)}
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

  const handleSearch = (e) => {
    handleDebounce(e.target.value.trim());
  };

  useEffect(() => {
    queryClient.invalidateQueries(COMPANY_LIST_KEY);
  }, [tableParams]);

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
    if (isLoadingConnectiveChange) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingConnectiveChange]);

  useEffect(() => {
    if (isLoadingUpdateDisplay) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingUpdateDisplay]);

  useEffect(() => {
    if (isLoadingDeleteCompany) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDeleteCompany]);


  const showModal = (id, display) => {
    reset({ display: display });
    setCompanyModal({
      id: id,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setValue("display", null);
    setCompanyModal({
      id: null,
    });
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (dataCompany.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(companyIdDelete);
  };

  const showDeleteModal = (companyId) => {
    setOpenDeleteModal(true);
    setCompanyIdDelete(companyId);
  };
  const handleDeleteOk = () => {
    handleDelete();
    setOpenDeleteModal(false);
  };
  const handleDeleteCancel = () => {
    setCompanyIdDelete(null);
    setOpenDeleteModal(false);
  };

  const onSubmit = (data) => {
    data.id = companyModal.id;
    mutateUpdateDisplay(data);
    setIsModalOpen(false);
  };

  const datas = dataCompany?.map((company) => {
    company.key = company.id;
    company.showDeleteModal = showDeleteModal;
    company.handleDelete = (companyId) => {
      if (confirm("Are you sure delete this?")) {
        toast.success("Remove company success!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          mutate(companyId);
        }, 500);
      }
      return;
    };
    return company;
  });

  const onChange = (pagination, filters, sorter, extra) => {
    pageSizeRef.current = pagination.pageSize
    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
      },
      sorter: {
        sort: sorter?.order === "descend" ? "desc" : "asc",
        sortColumn: sorter?.columnKey === "approve" ? "status" : sorter?.columnKey,
      },
    });
  };

  const handleChangeConnective = (id, checked) => {
    if (checked) {
      const formData = new FormData();
      formData.append("connective", 1);
      mutateConnectiveChange({ formData, id: id });
    } else {
      const formData = new FormData();
      formData.append("connective", 0);
      mutateConnectiveChange({ formData, id: id });
    }
  };
  return (
    <>
      <div className="card radius-15">
        <div className="card-body">
          <div className="card-title flex justify-between">
            <p className="text-[20px] font-semibold col-6">
              Danh sách doanh nghiệp
            </p>
            <div className="flex justify-end col-6">
              <Tooltip placement="top" title='Thêm mới'>
              <Button
                className="!bg-green"
                type="button"
                onClick={() => router.push("/company/create")}
              >
                <div className="parent-icon text-white">
                  <BiPlus className="text-[22px]" />
                </div>
              </Button></Tooltip>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-end">
            <Input.Search
              placeholder={t("common.search")}
              className="mb-6 lg:max-w-[400px] xs:max-w-full"
              onSearch={(value) => {
                setTableParams({
                  ...tableParams,
                  search: value.trim(),
                });
              }}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
          </div>
          <div className="relative ">
            <Table
              columns={columns}
              dataSource={datas}
              rowKey={(record) => record.id}
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
      </div>
      <Modal
        title="Số thứ tự"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-3">
            <input
              className={`form-control ${errors.display && "is-invalid"}`}
              type="number"
              min={1}
              // reset({ display: display });
              placeholder="Nhập số thứ tự hiển thị"
              {...register("display", { required: true })}
            />
            {errors.display && (
              <p className="text-danger">{errors.display.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              className="btn-secondary font-medium mr-3"
              onClick={handleCancel}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="btn-primary font-medium">
              {t("common.confirm")}
            </Button>
          </div>
        </form>
      </Modal>
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

export default ListCompany;
