import { useQueryClient } from "@tanstack/react-query";
import {
  Col,
  Descriptions,
  Input,
  Modal,
  Row,
  Space,
  Tooltip,
  Table,
  Typography,
} from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";

import {
  useDeletePublication,
  useListPublication,
  useUpdatePublication,
} from "~/hooks/publication";
import Button from "../../components/common/Button";
import { PAGE_SIZE, PUBLICATION_LIST_KEY } from "~/constants";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { BiEdit, BiMove, BiPlus, BiTrash } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { ellipsShortNameFile } from "~/utils/string";



const ListPublication = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
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
  //useState
  const [openModal, setOpenModal] = useState(false);
  const [publicationIdDelete, setPublicationIdDelete] = useState(null);
  const [detailPublication, setDetailPublication] = useState(null);
  const [publicationModal, setPublicationModal] = useState({ id: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingg, setIsLoading] = useState(false);
  const [ellipsis, setEllipsis] = useState({
    content_vi: true,
    content_en: true,
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: PAGE_SIZE,
      locale: { items_per_page: "/ trang" },
    },
    sorter: {
      sortColumn: 'display',
      sort: 'asc',
    },
    search: "",
    category_id: null,
  });
  const pageSizeRef = useRef(PAGE_SIZE)

  // CALL API
  const { data: { data: dataPublication = [], total } = {}, isLoading } =
    useListPublication(tableParams);
  const {
    mutate,
    isLoading: isLoadingDeletePublication,
    isSuccess,
  } = useDeletePublication();
  const { mutate: mutateUpdate, isLoading: isLoadingUpdatePublication } =
    useUpdatePublication();

  const useColumns = (
    t,
    router,
    page,
    dataCategory,
    showModalDisplay,
    showDetailModal
  ) => {
    return [
      {
        title: <div className="text-center">STT</div>,
        dataIndex: "id",
        key: "id",
        width: "1%",
        // sortDirections: ["ascend", "descend", "ascend"],
        // sorter: () => { },
        render: (text, t, index) => (
          <div>{(page - 1) * pageSizeRef.current + index + 1}</div>
        ),
      },
      {
        title: <div className="text-center">{t("common.feature_image")}</div>,
        width: "10%",
        render: (record) => {
          return (
            <div className="max-w-[80px] max-h-[80px] overflow-hidden">
              <img
                className="overflow-hidden"
                src={
                  record.feature_image
                    ? record.feature_image
                    : "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg"
                }
                alt=""
              />
            </div>
          );
        },
      },
      {
        title: <div className="text-center">{t("publication.title")}</div>,
        dataIndex: "title_vi",
        key: "title_vi",
        width: "20%",
        render: (text, record) => (
          <Typography.Paragraph ellipsis={{ rows: 2 }}>
            <div
              className="cursor-pointer text-blue"
              onClick={() => showDetailModal(record)}
            >
              {text}
            </div>
          </Typography.Paragraph>
        ),
        sortDirections: ["descend", "ascend", "descend"],
        sorter: () => { },
      },
      {
        title: <div className="text-center">{t("publication.pdf_file")}</div>,
        key: "pdf_file",
        dataIndex: "pdf_file",
        width: "10%",
        render: (text) => {
          return (
            <>
              {text ? (
                <a
                  href={text}
                  target="_blank"
                  className="flex items-center align-middle mt-3 "
                >
                  <BsFillFileEarmarkPdfFill
                    className="mr-3"
                    style={{ fontSize: "24px", color: "red" }}
                  />
                  {ellipsShortNameFile(text)}
                </a>
              ) : (
                ""
              )}
            </>
          );
        },
      },
      {
        title: <div className="text-center">{t("common.action")}</div>,
        key: "action",
        className: "max-w-[100px]",
        width: "15%",
        render: (_, record) => {
          return (
            <Space size="middle" className="flex justify-center">
              <Tooltip placement="top" title='Sắp xếp'>
                <Button
                  className="btn-warning font-medium"
                  onClick={() => showModalDisplay(record.id, record.display)}
                >
                  <div className="parent-icon text-white">
                    <BiMove className="text-[22px]" />
                  </div>
                </Button></Tooltip>
              <Tooltip placement="top" title='Sửa'>
                <Button
                  className="btn-info btn"
                  onClick={() => router.push(`/publication/edit?id=${record.id}`)}
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
                </Button></Tooltip>
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
    if (isLoadingDeletePublication) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDeletePublication]);

  useEffect(() => {
    if (isLoadingUpdatePublication) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingUpdatePublication]);

  const handleDebounce = debounce((value) => {
    setTableParams({
      ...tableParams,
      search: value,
    });
  }, 500);

  const handleSearch = (e) => {
    handleDebounce(e.target.value.trim());
  };

  const handleDelete = () => {
    if (dataPublication.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(publicationIdDelete);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Xóa ấn phẩm thành công!", {
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

  const showModal = (publicationId) => {
    setOpenModal(true);
    setPublicationIdDelete(publicationId);
  };

  const showModalDisplay = (id, display) => {
    reset({ display: display });
    setPublicationModal({
      id: id,
    });
    setIsModalOpen(true);
  };

  const showDetailModal = (record) => {
    setDetailPublication(record);
    setIsDetailModalOpen(true);
  };

  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };

  const handleDisplayOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setPublicationIdDelete(null);
    setOpenModal(false);
  };

  const handleDetailCancel = () => {
    setEllipsis({ content_en: true, content_vi: true });
    setIsDetailModalOpen(false);
  };

  const handleDisplayCancel = () => {
    setValue("display", null);
    setPublicationModal({
      id: null,
    });
    setIsModalOpen(false);
  };

  const onSubmit = (data) => {
    const id = publicationModal.id;
    const formData = new FormData();
    formData.append("display", data.display);
    mutateUpdate({ formData, id });
    setIsModalOpen(false);
  };

  const columns = useColumns(
    t,
    router,
    tableParams.pagination.current,
    dataPublication,
    showModalDisplay,
    showDetailModal
  );

  dataPublication?.map((publication) => {
    publication.key = publication.id;
    publication.showModal = showModal;
    return publication;
  });

  useEffect(() => {
    queryClient.invalidateQueries(PUBLICATION_LIST_KEY);
  }, [tableParams]);

  const onChange = (pagination, filters, sorter, extra) => {
    pageSizeRef.current = pagination.pageSize
    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
      },
      sorter: {
        sort: sorter?.order === "ascend" ? "desc" : "asc",
        sortColumn: sorter?.columnKey ? sorter?.columnKey : 'display',
      },
    });
  };
  return (
    <>
      <div className="card radius-15">
        <div className="card-body">
          <div className="card-title flex justify-between">
            <p className="text-[20px] font-semibold">Danh sách ấn phẩm</p>
            <Tooltip placement="top" title='Thêm mới'>
              <Button
                className="btn-success btn"
                onClick={() => router.push(`/publication/create`)}
              >
                <div className="parent-icon text-white">
                  <BiPlus className="text-[22px]" />
                </div>
              </Button></Tooltip>
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
              onChange={(e) => handleSearch(e)}
            />
          </div>
          <div className="relative">
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={dataPublication}
              onChange={onChange}
              pagination={{
                ...tableParams.pagination,
                total: total,
                showSizeChanger: true,
                pageSizeOptions: ["6", "10", "20", "50", "100"],
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
      {/* Modal delete */}
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
      {/* Modal detail */}
      <Modal
        open={isDetailModalOpen}
        onCancel={handleDetailCancel}
        width="80%"
        style={{ transition: "all 0.2s linear", top: 20 }}
        footer={[
          <Button
            onClick={handleDetailCancel}
            className="bg-blue mr-3"
            key="cancel"
          >
            {t("common.cancel")}
          </Button>,
        ]}
      >
        <Row className="mb-3">
          <p className="text-[20px] mt-[24px] font-semibold">
            Chi tiết ấn phẩm : {detailPublication?.title_vi}
          </p>
        </Row>
        <div className="wp-modal-info">
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("publication.title")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {detailPublication?.title_vi ?? "Không có dữ liệu"}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("publication.title_en")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {detailPublication?.title_en ?? "Không có dữ liệu"}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("publication.description")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {detailPublication?.description_vi ?? "Không có dữ liệu"}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("publication.description_en")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {detailPublication?.description_en ?? "Không có dữ liệu"}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("publication.pdf_file")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {detailPublication?.pdf_file && (
                <a
                  href={detailPublication?.pdf_file}
                  target="_blank"
                  className="flex items-center align-middle mt-3 "
                >
                  <BsFillFileEarmarkPdfFill
                    className="mr-3"
                    style={{ fontSize: "24px", color: "red" }}
                  />
                  {
                    ellipsShortNameFile(detailPublication?.pdf_file, 20, -20)
                  }
                </a>
              )}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("publication.content")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {detailPublication && (
                <>
                  <Typography.Paragraph
                    ellipsis={
                      ellipsis.content_vi
                        ? {
                          rows: 2,
                        }
                        : false
                    }
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: detailPublication.content_vi,
                      }}
                    ></div>
                  </Typography.Paragraph>
                  <Button
                    onClick={() =>
                      setEllipsis({
                        ...ellipsis,
                        content_vi: !ellipsis.content_vi,
                      })
                    }
                    type="button"
                    className="btn-primary font-medium"
                  >
                    {ellipsis.content_vi ? "Đọc thêm" : "Rút gọn"}
                  </Button>
                </>
              )}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("publication.content_en")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {detailPublication && (
                <>
                  <Typography.Paragraph
                    ellipsis={
                      ellipsis.content_en
                        ? {
                          rows: 2,
                        }
                        : false
                    }
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: detailPublication.content_en,
                      }}
                    ></div>
                  </Typography.Paragraph>
                  <Button
                    onClick={() =>
                      setEllipsis({
                        ...ellipsis,
                        content_en: !ellipsis.content_en,
                      })
                    }
                    type="button"
                    className="btn-primary font-medium"
                  >
                    {ellipsis.content_en ? "Đọc thêm" : "Rút gọn"}
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </div>
      </Modal>
      {/* Modal display change */}
      <Modal
        title="Số thứ tự"
        open={isModalOpen}
        onOk={handleDisplayOk}
        onCancel={handleDisplayCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-3">
            <input
              className={`form-control ${errors.display && "is-invalid"}`}
              type="number"
              min={1}
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
    </>
  );
};

export default ListPublication;
