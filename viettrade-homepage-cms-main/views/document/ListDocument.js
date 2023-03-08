/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @next/next/no-img-element */
import { useQueryClient } from "@tanstack/react-query";
import {
  Col,
  Descriptions,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  Table,
  Typography,
} from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import Button from "../../components/common/Button";
import {
  DOCUMENT_LIST_KEY,
  PAGE_SIZE,
  PUBLICATION_LIST_KEY,
} from "~/constants";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { BiEdit, BiMove, BiPlus, BiTrash } from "react-icons/bi";
import { AiOutlineFileText } from "react-icons/ai";
import { useDeleteDocument, useListDocument } from "~/hooks/document";
import { useListCategoryDocument } from "~/hooks/category-document";
import Loading from "~/components/common/Loading";
import { ellipsShortNameFile } from "~/utils/string";



const ListDocument = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
  //useState
  const [openModal, setOpenModal] = useState(false);
  const [documentIdDelete, setDocumentIdDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    category_id: null,
  });
  // CALL API
  const { data: { data: dataDocument = [], total } = {}, isLoading } =
    useListDocument(tableParams);
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteDocument();
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [parentCategoryId, setparentCategoryId] = useState();
  const pageSizeRef = useRef(PAGE_SIZE)
  const handleDebounce = debounce((value) => {
    setTableParams({
      ...tableParams,
      search: value,
    });
  }, 500);

  const handleSearch = (e) => {
    handleDebounce(e.target.value.trim());
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

  const handleDelete = () => {
    if (dataDocument.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(documentIdDelete);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Xóa tài liệu thành công!", {
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

  const showModal = (documentId) => {
    setOpenModal(true);
    setDocumentIdDelete(documentId);
  };

  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };

  const handleCancel = () => {
    setPublicationIdDelete(null);
    setOpenModal(false);
  };

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

  const { data: { data: dataCategoryChildren = [] } = {} } =
    useListCategoryDocument({
      pagination: {
        pageSize: null,
        current: 1,
      },
      sorter: {
        sort: "asc",
        sortColumn: "createdAt",
      },
      category_id: null,
    });

  dataCategoryChildren?.map((children) => {
    children.label = children.title_vi;
    children.value = children.id;
    return children;
  });


  const useColumns = (
    t,
    router,
    page,
    dataCategoryParent,
    dataCategoryChildren
  ) => {
    return [
      {
        title: <div className="text-center">STT</div>,
        dataIndex: "id",
        key: "id",
        render: (text, t, index) => (
          <div>{(page - 1) * pageSizeRef.current + index + 1}</div>
        ),
      },
      {
        title: <div className="text-center">{t("document.title")}</div>,
        dataIndex: "title_vi",
        key: "title_vi",
        render: (text, record) => (
          <Typography.Paragraph ellipsis={{ rows: 2 }}>
            <div className="cursor-pointer">{text}</div>
          </Typography.Paragraph>
        ),
        sortDirections: ["descend", "ascend", "descend"],
        sorter: () => { },
      },
      {
        title: <div className="text-center">{t("document.category_id")}</div>,
        dataIndex: "category_id",
        key: "category_id",
        render: (text, record) => <div>{record.CategoryDocument.title_vi}</div>,
        sortDirections: ["descend", "ascend", "descend"],
        sorter: () => { },
      },
      {
        title: <div className="text-center">Danh mục cha</div>,
        key: "action",
        className: "max-w-[100px]",
        width: "15%",
        sortDirections: ["descend", "ascend", "descend"],
        sorter: () => { },
        render: (_, record) => {
          return (
            <div>
              {
                dataCategoryParent.find(
                  (parent) =>
                    parent.id ===
                    dataCategoryChildren.find(
                      (children) => children.id === record.category_id
                    )?.category_id
                )?.title_vi
              }
            </div>
          );
        },
      },
      {
        title: (
          <div className="text-center">{t("document.feature_document")}</div>
        ),
        key: "feature_document",
        dataIndex: "feature_document",
        render: (text) => {
          return (
            <>
              {text ? (
                <a
                  href={text}
                  target="_blank"
                  className="flex items-center align-middle mt-3 "
                >
                  <AiOutlineFileText
                    className="mr-3"
                    style={{ fontSize: "24px", color: "blue" }}
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
              <Tooltip placement="top" title='Sửa'>
              <Button
                className="btn-info btn"
                onClick={() => router.push(`/document/edit?id=${record.id}`)}
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

  const columns = useColumns(
    t,
    router,
    tableParams.pagination.current,
    dataCategoryParent,
    dataCategoryChildren
  );

  dataDocument?.map((document) => {
    document.key = document.id;
    document.showModal = showModal;
    return document;
  });

  useEffect(() => {
    queryClient.invalidateQueries(DOCUMENT_LIST_KEY);
  }, [tableParams]);

  const onChange = (pagination, filters, sorter, extra) => {
    pageSizeRef.current = pagination.pageSize
    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
      },
      sorter: {
        sort: sorter?.order === "ascend" ? "asc" : "desc",
        sortColumn: sorter?.columnKey === "action" ? 'parent_category_id' : sorter?.columnKey,
      },
      category_id: null,
    });
  };

  return (
    <>
      <div className="card radius-15">
        <div className="card-body">
          <div className="card-title flex justify-between">
            <p className="text-[20px] font-semibold">Danh sách tài liệu</p>
            <Tooltip placement="top" title='Thêm mới'>
            <Button
              className="btn-success btn"
              onClick={() => router.push(`/document/create`)}
            >
              <div className="parent-icon text-white">
                <BiPlus className="text-[22px]" />
              </div>
            </Button></Tooltip>
          </div>
          <hr className="my-4" />
          <div className="flex justify-start">
            <div className="mr-3">
              <label className="form-label pr-3 font-semibold">
                Chọn danh mục cha:
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
                onChange={(val) => {
                  if (val) {
                    setSubCategoryList(
                      dataCategoryChildren?.filter(
                        (cat) => cat.category_id === val
                      )
                    );
                  } else {
                    setSubCategoryList([]);
                    setTableParams({
                      ...tableParams,
                      category_id: val,
                    });
                  }
                }}
              />
            </div>
            <div className="mr-3">
              <label className="form-label pr-3 font-semibold">
                Chọn danh mục:
              </label>
              <Select
                options={[...subCategoryList]}
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
          <div className="">
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={dataDocument}
              onChange={onChange}
              pagination={{
                ...tableParams.pagination,
                total: total,
                showSizeChanger: true,
                position: ["bottomLeft"],
              }}
            />
          </div>
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
    </>
  );
};

export default ListDocument;
