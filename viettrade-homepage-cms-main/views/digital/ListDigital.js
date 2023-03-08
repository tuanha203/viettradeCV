import { Modal, Space, Table, Tag, Typography, Input, Tooltip } from "antd";
import { BiEdit, BiTrash, BiPlus, BiMove } from "react-icons/bi";
import { FiMove } from "react-icons/fi";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loading from "~/components/common/Loading";
import noImage from "../../public/images/no-image.png";
import Image from "next/image";
import { Pagination } from "antd";
import {
  useDeleteDigital,
  useListDigital,
  useUpdateDisplayDigital,
} from "~/hooks/digital";
import Button from "~/components/common/Button";
import { SORT_TITLE } from "~/constants";


const ListDigital = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [openModal, setOpenModal] = useState(false);
  const [digitalIdDelete, setDigitalIdDelete] = useState(null);
  const { data: { data: dataDigital } = {}, isLoading } = useListDigital();
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteDigital();
  const {
    mutate: mutateDisplay,
    isLoading: isLoadingDislay,
    isSuccess: isSuccessDisplay,
  } = useUpdateDisplayDigital();
  const [newDigital, setNewDigital] = useState([]);
  const [isLoadingg, setIsLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortTitle, setSortTitle] = useState(SORT_TITLE.NONE);
  const onChangePage = (page, pageSize) => {
    setPageCurrent(page);
    setPageSize(pageSize);
  };
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



  const handleDragEnd = async (e) => {
    if (!e.destination) return;
    let tempData = Array.from(newDigital);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setNewDigital(tempData);

    let data = {
      source: newDigital[e.source.index].id,
      display_source: newDigital[e.destination.index].display,
      destination: newDigital[e.destination.index].id,
      display_destination: newDigital[e.source.index].display,
    };
    mutateDisplay(data);
  };
  useEffect(() => {
    if (dataDigital) {
      setNewDigital(dataDigital);
    }
  }, [dataDigital]);

  const handleDelete = () => {
    if((newDigital.length % 10) === 1){
      setPageCurrent(prevState =>{
        return prevState -1;
      }) 
    }
    mutate(digitalIdDelete);
  };

  const showModal = (digitalId) => {
    setOpenModal(true);
    setDigitalIdDelete(digitalId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setDigitalIdDelete(null);
    setOpenModal(false);
  };

  const handleClickSort = () => {
    switch (sortTitle) {
      case SORT_TITLE.ASC:
        setSortTitle(SORT_TITLE.DESC)
        break;
      case SORT_TITLE.NONE:
        setSortTitle(SORT_TITLE.ASC)
        break;
      case SORT_TITLE.DESC:
        setSortTitle(SORT_TITLE.ASC)
        break;

      default:
        break;
    }

  }

  useEffect(() => {
    if (newDigital) {
      let temp = [...newDigital]
      temp?.sort((a, b) => sortTitle === SORT_TITLE.ASC ? b.title_vi.localeCompare(a.title_vi) : sortTitle === SORT_TITLE.DESC ? a.title_vi.localeCompare(b.title_vi) : new Date(a.display) - new Date(b.display))
      setNewDigital(temp);
    }

  }, [sortTitle])

  newDigital?.map((digital) => {
    digital.key = digital.id;
    digital.showModal = showModal;
    return digital;
  });
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách biểu ngữ</p>
          <Tooltip placement="top" title='Thêm mới'>
            <Button
              className="btn-success btn"
              onClick={() => router.push("/digital/create")}
            >
              <div className="parent-icon text-white">
                <BiPlus className="text-[22px]" />
              </div>
            </Button></Tooltip>
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
                  <th onClick={handleClickSort } scope="col" className="cursor-pointer relative">

                    <p>Tiêu đề</p>
                    <div className="flex flex-col absolute top-[5px] right-[8px]">
                      <FaSortUp className={`relative bottom-[-14px] text-[16px] ${sortTitle === SORT_TITLE.ASC ? "text-[#1677FF]" : "text-[#C4C4C4]"} `} />
                      <FaSortDown className={`${sortTitle === SORT_TITLE.DESC ? "text-[#1677FF]" : "text-[#C4C4C4]"}  text-[16px]`} />
                    </div>


                  </th>
                  <th scope="col">Đường dẫn</th>
                  <th id="" scope="col">
                    {t("common.action")}
                  </th>
                </tr>
              </thead>
              <Droppable droppableId="droppable-1">
                {(provider) => (
                  <tbody ref={provider.innerRef} {...provider.droppableProps}>
                    {newDigital?.slice(pageSize * (pageCurrent - 1), pageSize * (pageCurrent - 1) + pageSize)?.map((digital, index) => (
                      <Draggable
                        key={digital.id}
                        draggableId={digital.id?.toString()}
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
                            <td className="text-center">{digital.display}</td>
                            <td>
                              <div
                                className="overflow-hidden"
                                style={{ width: "80px", height: "80px" }}
                              >
                                <img
                                  className="overflow-hidden img-table bg-slate-400"
                                  src={(digital.feature_image ? digital.feature_image: (digital.feature_icon ? digital.feature_icon : noImage.src))}
                                  alt=""
                                />
                              </div>
                            </td>
                            <td>{digital?.title_vi}</td>
                            <td>{digital?.link}</td>
                            <td>
                              <Space
                                size="middle"
                                className="flex justify-center"
                              >
                                <Tooltip placement="top" title='Sửa'>
                                  <Button
                                    className="btn-info btn"
                                    onClick={() =>
                                      router.push(
                                        `/digital/edit?id=${digital?.id}`
                                      )
                                    }
                                  >
                                    <div className="parent-icon text-white">
                                      <BiEdit className="text-[22px]" />
                                    </div>
                                  </Button>
                                  </Tooltip>
                                  <Tooltip placement="top" title='Xoá'>
                                  <Button
                                    className="btn-danger btn"
                                    onClick={() =>
                                      digital.showModal(digital?.id)
                                    }
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
          <Pagination
            showSizeChanger={true}
            defaultCurrent={1}
            pageSize={pageSize}
            current={pageCurrent}
            onChange={onChangePage}
            total={newDigital.length}
          />
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

export default ListDigital;
