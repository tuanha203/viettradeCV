import { Modal, Space, Table, Tag, Typography,Tooltip, Input, Column } from "antd";
import { BiEdit, BiTrash, BiPlus, BiMove } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  useDeleteCategory,
  useListCategory,
  useUpdateDisplayCategory,
} from "~/hooks/category";
import Button from "~/components/common/Button";
import { PAGE_SIZE } from "~/constants";
import { FiMove } from "react-icons/fi";
import Loading from "~/components/common/Loading";

const ListCategory = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [searchedText, setSearchedText] = useState("");
  const [page, setPage] = useState(1);

  const useColumns = (t, searchedText) => [
    {
      title: <div className="text-center">STT</div>,
      dataIndex: "index",
      key: "index",
      colSpan: 1,
      width: "10%",
      sortDirections: ["ascend", "descend"],
      render: (value, item, index) => {
        return (
          <div className="text-center">
            {(page - 1) * PAGE_SIZE + index + 1}
          </div>
        );
      },
    },
    {
      title: <div className="text-center">{t("category.name")}</div>,
      dataIndex: "title_vi",
      key: "title_vi",
      colSpan: 1,
      width: "20%",
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
      sorter: (a, b) => a.title_vi.length - b.title_vi.length,
      render: (text) => <div className="">{text}</div>,
    },
    {
      title: <div className="text-center">{t("category.description")}</div>,
      dataIndex: "description_vi",
      key: "description_vi",
      colSpan: 1,
      sorter: (a, b) => a.description_vi.length - b.description_vi.length,
    },
    {
      title: <div className="text-center">{t("common.action")}</div>,
      key: "action",
      center: true,
      width: "150px",
      render: (_, record) => {
        return (
          <Space size="middle" className="flex justify-center">
           
            <Button
              className="btn-info btn"
              onClick={(e) => {
                e.defaultprevented();
                router.push(`/category/edit?id=${record.id}`);
              }}
            >
              <div className="parent-icon text-white">
                <BiEdit className="text-[22px]" />
              </div>
            </Button>
            
            
            <Button
              className="btn-danger btn"
              onClick={() => record.showModal(record.id)}
            >
              <div className="parent-icon text-white">
                <BiTrash className="text-[22px]" />
              </div>
            </Button>
          </Space>
        );
      },
    },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [categoryIdDelete, setCategoryIdDelete] = useState(null);
  const { data: { data: dataCategory } = {}, isLoading } = useListCategory();
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteCategory();
  const columns = useColumns(t, searchedText);
  const [categories, setCategories] = useState([]);
  const [isLoadingg, setIsLoading] = useState(false);
  const {
    mutate: mutateDisplay,
    isLoading: isLoadingDislay,
    isSuccess: isSuccessDisplay,
  } = useUpdateDisplayCategory();
  useEffect(() => {
    if (dataCategory) {
      setCategories(dataCategory);
    }
  }, [dataCategory]);

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
    mutate(categoryIdDelete);
  };

  const showModal = (categoryId) => {
    setOpenModal(true);
    setCategoryIdDelete(categoryId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setCategoryIdDelete(null);
    setOpenModal(false);
  };

  dataCategory?.map((category) => {
    category.key = category.id;
    category.showModal = showModal;
    return category;
  });
  const handleDragEnd = async (item) => {
    const { destination, source } = item;
    if (!destination) return;
    let tempData = Array.from(categories);
    let data = { id: item.draggableId, display: null };

    setCategories(tempData);
    data.id = tempData[source.index].id;
    data.display = destination.index + 1;

    let [source_data] = tempData.splice(source.index, 1);
    tempData.splice(destination.index, 0, source_data);
    mutateDisplay(data);
  };

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách thể loại</p>
          <Tooltip placement="top" title='Thêm mới'>
          <Button
            className="btn-success btn"
            onClick={() => router.push("/category/create")}
          >
            <div className="parent-icon text-white">
              <BiPlus className="text-[22px]" />
            </div>
          </Button></Tooltip>
        </div>
        <hr className="my-4" />
        <DragDropContext onDragEnd={handleDragEnd}>
          <table className="table table-hover custom-table">
            <thead style={{ background: "#fafafa", height: "57px" }}>
              <tr className="text-center">
                <th scope="col">
                  <FiMove className="m-auto" />
                </th>
                <th scope="col">STT</th>
                <th scope="col">{t("category.name")}</th>
                <th id="" scope="col">
                  {t("common.action")}
                </th>
              </tr>
            </thead>
            <Droppable droppableId="droppable">
              {(provided) => (
                <tbody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border-top-0"
                >
                  {categories?.map((category, index) => (
                    <Draggable
                      key={category.id}
                      draggableId={category.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <tr
                          className="ant-table-row ant-table-row-level-0 cursor-move"
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                        >
                          <td>
                            <FiMove className=" m-auto" />
                          </td>
                          <td className="text-center">{category.display}</td>
                          <td>{category.title_vi}</td>
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
                                    `/category/edit?id=${category.id}`
                                  )
                                }
                              >
                                <div className="parent-icon text-white">
                                  <BiEdit className="text-[22px]" />
                                </div>
                              </Button></Tooltip>
                              <Tooltip placement="top" title='Xoá'>
                              <Button
                                className="btn-danger btn"
                                onClick={() => category.showModal(category.id)}
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
                  {provided.placeholder}
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

export default ListCategory;
