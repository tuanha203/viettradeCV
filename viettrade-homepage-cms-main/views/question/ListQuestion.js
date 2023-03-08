import {
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Tooltip,
  Input,
  Column,
  Row,
  Col,
} from "antd";
import { BiEdit, BiTrash, BiPlus, BiMove } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  useDeleteQuestion,
  useListQuestion,
  useUpdateQuestion,
} from "~/hooks/question";
import Button from "~/components/common/Button";
import { FiMove } from "react-icons/fi";
import Loading from "~/components/common/Loading";
import { Pagination } from 'antd';
const ListQuestion = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [openModal, setOpenModal] = useState(false);
  const [questionIdDelete, setQuestionIdDelete] = useState(null);
  const { data: { data: dataQuestion } = {}, isLoading } = useListQuestion();
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeleteQuestion();
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoadingg, setIsLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onChangePage = (page, pageSize) => {
    setPageCurrent(page)
    setPageSize(pageSize)
  }
  const {
    mutate: mutateUpdate,
    isLoading: isLoadingUpdate,
    isSuccess: isSuccessUpdate,
  } = useUpdateQuestion();

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

  useEffect(() => {
    if (isLoadingUpdate) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingUpdate]);

  useEffect(() => {
    if (dataQuestion) {
      setQuestions(dataQuestion);
    }
  }, [dataQuestion]);

  const handleDelete = () => {
    if ((questions.length % 10) === 1) {
      setPageCurrent((prevState)=>{        
        return prevState - 1;
      })
    }
    
    mutate(questionIdDelete);
  };

  const showModal = (questionId) => {
    setOpenModal(true);
    setQuestionIdDelete(questionId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setQuestionIdDelete(null);
    setOpenModal(false);
  };

  const showDetailModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDetailCancel = () => {
    setIsModalOpen(false);
  };

  dataQuestion?.map((question) => {
    question.key = question.id;
    question.showModal = showModal;
    return question;
  });
  const handleDragEnd = async (item) => {
    const { destination, source } = item;
    if (!destination) return;
    let tempData = Array.from(questions);
    let data = { id: item.draggableId, display: null };

    setQuestions(tempData);
    data.id = tempData[source.index].id;
    data.display = destination.index + 1;

    let [source_data] = tempData.splice(source.index, 1);
    tempData.splice(destination.index, 0, source_data);
    mutateUpdate({ data, id: data.id });
  };

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách câu hỏi</p>
          <Tooltip placement="top" title='Thêm mới'>
          <Button
            className="btn-success btn"
            onClick={() => router.push("/question/create")}
          >
            <div className="parent-icon text-white">
              <BiPlus className="text-[22px]" />
            </div>
          </Button>
          </Tooltip>
        </div>
        <hr className="my-4" />
        <div className="overflow-y-auto" style={{ height: "70vh" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="table table-hover custom-table">
              <thead
                style={{ background: "#fafafa", height: "57px" }}
                className="sticky top-0"
              >
                <tr className="text-center">
                  <th scope="col">
                    <FiMove className="m-auto" />
                  </th>
                  <th scope="col">STT</th>
                  <th scope="col" style={{ width: "30%" }}>
                    {t("question.question_vi")}
                  </th>
                  <th scope="col" style={{ width: "40%" }}>
                    {t("question.answer_vi")}
                  </th>
                  <th scope="col">{t("common.action")}</th>
                </tr>
              </thead>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="border-top-0"
                  >
                    {questions?.slice(pageSize * (pageCurrent - 1), pageSize * (pageCurrent - 1) + pageSize)?.map((question, index) => (
                      <Draggable
                        key={question.id}
                        draggableId={question.id.toString()}
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
                            <td className="text-center">{question.display}</td>
                            <td className="cursor-default">
                              <div className="wp_detail_button">
                                <Typography.Paragraph ellipsis={{ rows: 2 }}>
                                  <div
                                  className="cursor-pointer text-blue"
                                    onClick={() => showDetailModal(question)}
                                  >
                                    {question.question_vi}
                                  </div>
                                </Typography.Paragraph>
                              </div>
                            </td>
                            <td>
                              <Typography.Paragraph ellipsis={{ rows: 2 }}>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: question.answer_vi,
                                  }}
                                ></div>
                              </Typography.Paragraph>
                            </td>
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
                                      `/question/edit?id=${question.id}`
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
                                    question.showModal(question.id)
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
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </table>
          </DragDropContext>
          <Pagination locale={{ items_per_page: "/ trang" }} showSizeChanger={true} defaultCurrent={1} pageSize={pageSize} current={pageCurrent} onChange={onChangePage} total={questions.length} />
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
        open={isModalOpen}
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
            Chi tiết câu hỏi : {selectedRecord?.question_vi}
          </p>
        </Row>
        <div className="wp-modal-info">
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("question.question_vi")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {selectedRecord?.question_vi ?? "Không có dữ liệu"}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("question.answer_vi")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {selectedRecord?.answer_vi ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedRecord.answer_vi,
                  }}
                ></div>
              ) : (
                "Không có dữ liệu"
              )}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("question.question_en")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {selectedRecord?.question_en ?? "Không có dữ liệu"}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("question.answer_en")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {selectedRecord?.answern_en ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedRecord.answern_en,
                  }}
                ></div>
              ) : (
                "Không có dữ liệu"
              )}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("question.display")}
            </Col>
            <Col className="content_modal-info" span={20}>
              {selectedRecord?.display ?? "Không có dữ liệu"}
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default ListQuestion;
