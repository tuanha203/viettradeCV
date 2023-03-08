import { Modal, Space, Tooltip } from "antd";
import { BiEdit, BiTrash, BiPlus, BiMenu } from "react-icons/bi";
import { FiMove } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loading from "~/components/common/Loading";

import {
  useDeleteMenu,
  useUpdateDisplayMenu,
  useListSubMenu,
} from "~/hooks/menu";
import Button from "~/components/common/Button";

const ListSubMenu = ({ menuId }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [openModal, setOpenModal] = useState(false);
  const [menuIdDelete, setMenuIdDelete] = useState(null);
  const { data: { data: dataMenu } = {}, isLoading } = useListSubMenu(menuId);
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteMenu();
  const {
    mutate: mutateDisplay,
    isLoading: isLoadingDislay,
    isSuccess: isSuccessDisplay,
  } = useUpdateDisplayMenu();
  const [newMenu, setNewMenu] = useState([]);
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

  dataMenu?.sort((a, b) => new Date(a.display) - new Date(b.display));

  const handleDragEnd = async (e) => {
    if (!e.destination) return;
    let tempData = Array.from(newMenu);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setNewMenu(tempData);

    let data = {
      source: newMenu[e.source.index].id,
      display_source: newMenu[e.destination.index].display,
      destination: newMenu[e.destination.index].id,
      display_destination: newMenu[e.source.index].display,
    };
    mutateDisplay(data);
  };

  useEffect(() => {
    if (dataMenu) {
      setNewMenu(dataMenu);
    }
  }, [dataMenu]);

  const handleDelete = () => {
    mutate(menuIdDelete);
  };

  const showModal = (menuId) => {
    setOpenModal(true);
    setMenuIdDelete(menuId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setMenuIdDelete(null);
    setOpenModal(false);
  };

  newMenu?.map((menu) => {
    menu.key = menu.id;
    menu.showModal = showModal;
    return menu;
  });

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách menu</p>
          <Tooltip placement="top" title='Thêm mới'>
          <Button
            className="btn-success btn"
            onClick={() => router.push(`/menu/create`)}
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
                  <th className="text-center" scope="col">
                    STT
                  </th>
                  <th scope="col">Tiêu đề</th>
                  <th scope="col">Đường dẫn</th>
                  <th id="" scope="col">
                    {t("common.action")}
                  </th>
                </tr>
              </thead>
              <Droppable droppableId="droppable-1">
                {(provider) => (
                  <tbody ref={provider.innerRef} {...provider.droppableProps}>
                    {newMenu?.map((menu, index) => (
                      <Draggable
                        key={menu.id}
                        draggableId={menu.id.toString()}
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
                            <td class="text-center">{menu.display}</td>
                            <td>{menu?.title_vi}</td>
                            <td>{menu?.link}</td>
                            <td>
                              <Space
                                size="middle"
                                className="flex justify-center"
                              >
                                <Tooltip placement="top" title='Sửa'>
                                <Button
                                  className="btn-info btn"
                                  onClick={() =>
                                    router.push(`/menu/edit?id=${menu?.id}`)
                                  }
                                >
                                  <div className="parent-icon text-white">
                                    <BiEdit className="text-[22px]" />
                                  </div>
                                </Button></Tooltip>
                                <Tooltip placement="top" title='Xoá'>
                                <Button
                                  className="btn-danger btn"
                                  onClick={() => menu.showModal(menu?.id)}
                                >
                                  <div className="parent-icon text-white">
                                    <BiTrash className="text-[22px]" />
                                  </div>
                                </Button></Tooltip>
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

export default ListSubMenu;
