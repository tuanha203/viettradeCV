import { Modal, Space, Table, Tag, Typography, Tooltip, Input } from "antd";
import { BiEdit, BiTrash, BiPlus, BiMove } from "react-icons/bi";
import { FiMove } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loading from "~/components/common/Loading";

import {
  useDeleteBanner,
  useListBanner,
  useUpdateDisplayBanner,
} from "~/hooks/banner";
import Button from "~/components/common/Button";
import noImage from "../../public/images/no-image.png";
import Image from "next/image";

const ListBanner = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [searchedText, setSearchedText] = useState("");
  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [bannerIdDelete, setBannerIdDelete] = useState(null);
  const { data: { data: dataBanner } = {}, isLoading } = useListBanner();
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteBanner();
  const {
    mutate: mutateDisplay,
    isLoading: isLoadingDislay,
    isSuccess: isSuccessDisplay,
  } = useUpdateDisplayBanner();
  const [newBanner, setNewBanner] = useState([]);
  const [isLoadingg, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoadingDislay) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDislay]);

  useEffect(() => {
    if (isLoadingDelete) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDelete]);

  dataBanner?.sort((a, b) => new Date(a.display) - new Date(b.display));

  const handleDragEnd = async (e) => {
    if (!e.destination) return;
    let tempData = Array.from(newBanner);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setNewBanner(tempData);

    let data = {
      source: newBanner[e.source.index].id,
      display_source: newBanner[e.destination.index].display,
      destination: newBanner[e.destination.index].id,
      display_destination: newBanner[e.source.index].display,
    };
    mutateDisplay(data);
  };

  useEffect(() => {
    if (dataBanner) {
      setNewBanner(dataBanner);
    }
  }, [dataBanner]);

  const handleDelete = () => {
    mutate(bannerIdDelete);
  };

  const showModal = (bannerId) => {
    setOpenModal(true);
    setBannerIdDelete(bannerId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setBannerIdDelete(null);
    setOpenModal(false);
  };

  newBanner?.map((banner) => {
    banner.key = banner.id;
    banner.showModal = showModal;
    return banner;
  });

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách banner</p>
          <Tooltip placement="top" title="Thêm mới">
            <Button
              className="btn-success btn"
              onClick={() => router.push("/banner/create")}
            >
              <div className="parent-icon text-white">
                <BiPlus className="text-[22px]" />
              </div>
            </Button>
          </Tooltip>
        </div>
        <div className="App mt-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="table table-hover custom-table relative">
              <thead style={{ background: "#fafafa", height: "57px" }}>
                <tr className="text-center">
                  <th scope="col">
                    <FiMove className="m-auto" />
                  </th>
                  <th scope="col">STT</th>
                  <th scope="col">Ảnh</th>
                  <th scope="col">Tên</th>
                  <th scope="col">Đường dẫn</th>
                  <th id="" scope="col">
                    {t("common.action")}
                  </th>
                </tr>
              </thead>
              <Droppable droppableId="droppable-1">
                {(provider) => (
                  <tbody ref={provider.innerRef} {...provider.droppableProps}>
                    {newBanner?.map((banner, index) => (
                      <Draggable
                        key={banner.id}
                        draggableId={banner.id.toString()}
                        index={index}
                      >
                        {(provider) => (
                          <tr
                            {...provider.draggableProps}
                            ref={provider.innerRef}
                          >
                            <td {...provider.dragHandleProps}>
                              <FiMove className="m-auto" />
                            </td>
                            <td className="text-center">{banner.display}</td>
                            <td>
                              <div className="max-w-[250px] -h-[80px] center">
                                {banner.feature_image ? (
                                  <img
                                    className="object-fill h-[80px] w-[180px]"
                                    src={banner.feature_image}
                                    alt=""
                                  />
                                ) : (
                                  <Image
                                    src={noImage}
                                    className="object-cover h-[80px] w-[180px]"
                                    alt=""
                                  />
                                )}
                              </div>
                            </td>
                            <td>{banner?.title}</td>
                            <td>{banner?.link}</td>
                            <td>
                              <Space
                                size="middle"
                                className="flex justify-center"
                              >
                                <Tooltip placement="top" title="Sửa">
                                  <Button
                                    className="btn-info btn"
                                    onClick={() =>
                                      router.push(
                                        `/banner/edit?id=${banner?.id}`
                                      )
                                    }
                                  >
                                    <div className="parent-icon text-white">
                                      <BiEdit className="text-[22px]" />
                                    </div>
                                  </Button>
                                </Tooltip>
                                <Tooltip placement="top" title="Xoá">
                                  <Button
                                    className="btn-danger btn"
                                    onClick={() => banner.showModal(banner?.id)}
                                  >
                                    <div className="parent-icon text-white">
                                      <BiTrash className="text-[22px]" />
                                    </div>
                                  </Button>
                                </Tooltip>
                              </Space>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provider.placeholder}
                  </tbody>
                )}
              </Droppable>
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
            </table>
          </DragDropContext>
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

export default ListBanner;
