import { Modal, Space, Tooltip } from "antd";
import { BiEdit, BiTrash, BiPlus, BiMenu } from "react-icons/bi";
import { FiMove } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loading from "~/components/common/Loading";

import { useDeleteMenu, useListMenu, useUpdateDisplayMenu } from "~/hooks/menu";
import Button from "~/components/common/Button";
import { Pagination } from 'antd';
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { SORT_TITLE } from "~/constants";

const ListMenu = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [openModal, setOpenModal] = useState(false);
  const [menuIdDelete, setMenuIdDelete] = useState(null);
  const { data: { data: dataMenu } = {}, isLoading } = useListMenu();
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteMenu();
  const {
    mutate: mutateDisplay,
    isLoading: isLoadingDislay,
    isSuccess: isSuccessDisplay,
  } = useUpdateDisplayMenu();
  const [newMenu, setNewMenu] = useState([]);
  const [isLoadingg, setIsLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortTitle, setSortTitle] = useState(SORT_TITLE.NONE);

  const onChangePage = (page, pageSize) => {
    setPageCurrent(page)
    setPageSize(pageSize)
  }
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
    if((newMenu.length % 10) === 1){
      setPageCurrent( prevState =>{
        return prevState - 1;
      })
    }
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

  // useEffect(() => {
  //   if (newMenu) {
  //     let temp = [...newMenu]
  //     temp?.sort((a, b) => (sortTitle === SORT_TITLE.ASC ? b.title_vi.localeCompare(a.title_vi) : (sortTitle === SORT_TITLE.DESC ? a.title_vi.localeCompare(b.title_vi) : new Date(a.display) - new Date(b.display))))
  //     setNewMenu(temp);
  //   }

  // }, [sortTitle])

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách menu</p>
          <Tooltip placement="top" title='Thêm mới'>
            <Button
              className="btn-success btn"
              onClick={() => router.push("/menu/create")}
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
                  <th onClick={handleClickSort} scope="col" className="cursor-pointer relative">

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
                    {newMenu?.slice(pageSize * (pageCurrent - 1), pageSize * (pageCurrent - 1) + pageSize)?.map((menu, index) => (
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
                                <Tooltip placement="top" title='Xem chi tiết'>
                                  <Button
                                    className="btn-primary btn"
                                    onClick={() =>
                                      router.push(`/menu/sub-menu?id=${menu?.id}`)
                                    }
                                  >
                                    <div className="parent-icon text-white">
                                      <BiMenu className="text-[22px]" />
                                    </div>
                                  </Button></Tooltip>
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
          <Pagination locale={{ items_per_page: "/ trang" }} showSizeChanger={true} defaultCurrent={1} pageSize={pageSize} current={pageCurrent} onChange={onChangePage} total={newMenu.length} />
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

export default ListMenu;
