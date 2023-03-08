import { Modal, Space } from "antd";
import { BiEdit, BiTrash, BiPlus, BiMenu } from "react-icons/bi";
import { FiMove } from "react-icons/fi";
import { useEffect, useState, useContext, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loading from "~/components/common/Loading";
import { PAGE_SIZE } from "~/constants";
import { AdminContext } from "~/contexts/AdminContext";
import {
  useDeleteStructure,
  useListStructure,
  useUpdateDisplayStructure,
} from "~/hooks/structure";
import Button from "~/components/common/Button";

const ListStructure = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const { admin } = useContext(AdminContext);
  const [openModal, setOpenModal] = useState(false);
  const [structureIdDelete, setStructureIdDelete] = useState(null);
  const { data: { data: dataStructure } = {}, isLoading } = useListStructure();
  const {
    mutate,
    isLoading: isLoadingDelete,
    isSuccess,
  } = useDeleteStructure();
  const {
    mutate: mutateDisplay,
    isLoading: isLoadingDislay,
    isSuccess: isSuccessDisplay,
  } = useUpdateDisplayStructure();

  const [newStructure, setNewStructure] = useState([]);
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

  dataStructure?.sort((a, b) => new Date(a.display) - new Date(b.display));

  const handleDragEnd = async (e) => {
    if (!e.destination) return;
    let tempData = Array.from(newStructure);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setNewStructure(tempData);

    let data = {
      source: newStructure[e.source.index].id,
      display_source: newStructure[e.destination.index].display,
      destination: newStructure[e.destination.index].id,
      display_destination: newStructure[e.source.index].display,
    };
    mutateDisplay(data);
  };

  useEffect(() => {
    if (dataStructure) {
      setNewStructure(dataStructure);
    }
  }, [dataStructure]);

  const handleDelete = () => {
    mutate(structureIdDelete);
  };

  const showModal = (structureId) => {
    setOpenModal(true);
    setStructureIdDelete(structureId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setStructureIdDelete(null);
    setOpenModal(false);
  };

  newStructure?.map((structure) => {
    structure.key = structure.id;
    structure.showModal = showModal;
    return structure;
  });

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách đơn vị</p>
          <Button
            className="btn-success btn"
            onClick={() => router.push("/structure/create")}
          >
            <div className="parent-icon text-white">
              <BiPlus className="text-[22px]" />
            </div>
          </Button>
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
                  <th scope="col">Tên đơn vị</th>
                  <th id="" scope="col">
                    {t("common.action")}
                  </th>
                </tr>
              </thead>
              <Droppable droppableId="droppable-1">
                {(provider) => (
                  <tbody ref={provider.innerRef} {...provider.droppableProps}>
                    {newStructure?.map((structure, index) => (
                      <Draggable
                        key={structure.id}
                        draggableId={structure.id.toString()}
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
                            <td className="text-center">{structure.display}</td>
                            <td>{structure?.full_name_vi}</td>
                            <td>
                              <Space
                                size="middle"
                                className="flex justify-center"
                              >
                                <Button
                                  className="btn-primary btn"
                                  onClick={() =>
                                    router.push(
                                      `/structure/sub-structure?id=${structure?.id}`
                                    )
                                  }
                                >
                                  <div className="parent-icon text-white">
                                    <BiMenu className="text-[22px]" />
                                  </div>
                                </Button>
                                <Button
                                  className="btn-info btn"
                                  onClick={() =>
                                    router.push(
                                      `/structure/edit?id=${structure?.id}`
                                    )
                                  }
                                >
                                  <div className="parent-icon text-white">
                                    <BiEdit className="text-[22px]" />
                                  </div>
                                </Button>
                                <Button
                                  className="btn-danger btn"
                                  onClick={() =>
                                    structure.showModal(structure?.id)
                                  }
                                >
                                  <div className="parent-icon text-white">
                                    <BiTrash className="text-[22px]" />
                                  </div>
                                </Button>
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

export default ListStructure;
