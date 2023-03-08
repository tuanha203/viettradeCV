import { Space, Table, Modal, Input, Tooltip, Typography } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { BiEdit, BiTrash, BiPlus } from "react-icons/bi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Button from "../../components/common/Button";
import { useListMedia, useDeleteMedia } from "../../hooks/media";
import { PAGE_SIZE } from "~/constants";
import ReactPlayer from "react-player";
import Loading from "~/components/common/Loading";


const ListMedia = () => {
  const { t } = useTranslation("common");
  const [openModal, setOpenModal] = useState(false);
  const [mediaIdDelete, setMediaIdDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [searchedText, setSearchedText] = useState("");
  const { data: { data: dataMedia } = {}, isLoading } = useListMedia();
  const {
    mutate,
    isLoading: isLoadingDeleteMedia,
    isSuccess,
  } = useDeleteMedia();
  const router = useRouter();
  const pageSizeRef = useRef(PAGE_SIZE)

  const [isLoadingg, setIsLoading] = useState(false);
  const useColumns = (t, router, page, searchedText) => {
    return [
      {
        title: <div className="text-center">STT</div>,
        dataIndex: "id",
        key: "id",
        width: "1%",
        render: (text, t, index) => <div>{(page - 1) * pageSizeRef.current + index + 1}</div>,
      },
      {
        title: <div className="text-center">{t("media.feature_video")}</div>,
        width: "10%",
        render: (record) => {
          return (
            <div className="max-w-[120px] max-h-[80px] overflow-hidden">
              <ReactPlayer url={record.feature_video} />
            </div>
          );
        },
      },
      {
        title: <div className="text-center">{t("common.title")}</div>,
        dataIndex: "title_vi",
        key: "title_vi",
        width: "20%",
        render: (text) => (
          <Typography.Paragraph ellipsis={{ rows: 2 }}>
            {text}
          </Typography.Paragraph>
        ),
        sorter: (a, b) => a.title_vi.localeCompare(b.title_vi),
        filteredValue: [searchedText],
        onFilter: (value, record) => {
          return (
            String(record.title_vi).toLowerCase().includes(value.toLowerCase()) ||
            String(record.title_en).toLowerCase().includes(value.toLowerCase()) ||
            String(record.description_vi)
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            String(record.description_en)
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        },
      },
      {
        title: <div className="text-center">{t("common.action")}</div>,
        key: "action",
        className: "max-w-[100px]",
        width: "20%",
        render: (_, record) => {
          return (
            <Space size="middle" className="flex justify-center">
              <Tooltip placement="top" title='Sửa'>
              <Button
                className="btn-info btn"
                onClick={() => router.push(`/media/edit?id=${record.id}`)}
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
  const columns = useColumns(t, router, page, searchedText);
  const handleDelete = () => {
    mutate(mediaIdDelete);
    setPage(1);
  };

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoadingDeleteMedia) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDeleteMedia]);

  const showModal = (mediaId) => {
    setOpenModal(true);
    setMediaIdDelete(mediaId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setMediaIdDelete(null);
    setOpenModal(false);
  };

  dataMedia?.map((media) => {
    media.key = media.id;
    media.showModal = showModal;
    return media;
  });

  const onChange = (pagination, filters, sorter, extra) => {
    pageSizeRef.current = pagination.pageSize 

  };

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách media</p>
          <Tooltip placement="top" title='Thêm mới'>
          <Button
            className="btn-success btn"
            onClick={() => router.push(`/media/create`)}
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
              setSearchedText(value);
            }}
            onChange={(e) => {
              setSearchedText(e.target.value);
            }}
          />
        </div>
        <div className="">
          <Table
            columns={columns}
            dataSource={dataMedia}
            onChange={onChange}
            pagination={{
              defaultPageSize: PAGE_SIZE,
              position: ["bottomLeft"],
              locale: { items_per_page: "/ trang" },
              pageSizeOptions: ["6", "10", "20", "50", "100"],
              showSizeChanger: true,
              onChange(current) {
                setPage(current);
              },
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

export default ListMedia;
