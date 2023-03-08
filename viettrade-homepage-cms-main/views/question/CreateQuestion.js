import React, { useEffect, useState, useRef } from "react";
import { Tabs } from "antd";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../components/common/Button";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { useCreateQuestion } from "~/hooks/question";
import { Editor } from "@tinymce/tinymce-react";
import Loading from "~/components/common/Loading";
import axios from "axios";

const CreateCategory = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">Thêm mới câu hỏi</p>
          <div className="mt-4">
            <FormCreate />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormCreate = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [isDisable, setIsDisable] = useState(false);
  const [tab, setTab] = useState(1);
  const editorViRef = useRef();
  const editorEnRef = useRef();
  const {
    mutate,
    data: dataCreate,
    isSuccess,
    isLoading,
  } = useCreateQuestion();
  const onChange = (tab) => {
    setTab(tab);
  };

  const schema = yup.object().shape({
    question_vi: yup.string().trim().required("Câu hỏi là bắt buộc"),
    answer_vi: yup.string().trim().required("Câu trả lời là bắt buộc"),
    question_en: yup.string().trim().required("Câu hỏi tiếng anh là bắt buộc"),
    answern_en: yup
      .string()
      .trim()
      .required("Câu trả lời tiếng anh là bắt buộc"),
  });

  const [imageList, setImageList] = useState([
    {
      title: "My image 1",
      value: "https://www.example.com/my1.gif",
    },
    {
      title: "My image 2",
      value: "http://www.moxiecode.com/my2.gif",
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (dataCreate) {
      toast.success("Tạo mới câu hỏi thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/question");
      }, 1000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (errors.question_vi || errors.answer_vi) {
      setTab(1);
    } else if (errors.question_en || errors.answer_en) {
      setTab(2);
    }
  }, [errors])

  const onSubmit = (data) => {
    setIsDisable(true);
    const question_vi = data.question_vi;
    const question_en = data.question_en;
    const answer_vi = data.answer_vi;
    const answer_en = data.answer_en;

    let questionData = {
      question_vi: question_vi,
      question_en: question_en,
      answer_vi: answer_vi,
      answer_en: answer_en,
    };

    mutate(questionData);
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs
        activeKey={tab}
        onChange={onChange}
        type="card"
        items={[
          {
            key: 1,
            label: "Tiếng Việt",
            children: (
              <>
                <div className="form-group mb-3">
                  <label className="form-label">
                    {t("question.question_vi")}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <input
                    className={`form-control ${errors.question_vi && "is-invalid"
                      }`}
                    {...register("question_vi", { required: true })}
                  />
                  {errors.question_vi && (
                    <p className="text-danger">{errors.question_vi.message}</p>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">
                    {t("question.answer_vi")}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    onInit={(evt, editor) => (editorViRef.current = editor)}
                    initialValue=""
                    textareaName="answer_vi"
                    onChange={() => {
                      setValue("answer_vi", editorViRef.current.getContent());
                    }}
                    init={{
                      min_height: 500,
                      menubar: false,
                      automatic_uploads: true,
                      image_title: true,
                      font_size_formats:
                        "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                      font_family_formats:
                        "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                      plugins: [
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "image",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | fontfamily fontsize | casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent | removeformat | a11ycheck code table image link media help",
                      images_upload_handler: (blobInfo, progress) =>
                        new Promise((resolve, reject) => {
                          const formData = new FormData();
                          formData.append(
                            "file",
                            blobInfo.blob(),
                            blobInfo.filename()
                          );

                          axios
                            .post(
                              `${process.env.NEXT_PUBLIC_HOST}/post/upload`,
                              formData
                            )
                            .then((res) => {
                              const location =
                                process.env.NEXT_PUBLIC_HOST_IMAGE +
                                res.data.location;
                              resolve(location);
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        }),
                      image_list: imageList,
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                  {errors.answer_vi && (
                    <p className="text-danger">{errors.answer_vi.message}</p>
                  )}
                </div>
              </>
            ),
          },
          {
            key: 2,
            label: "Tiếng Anh",
            children: (
              <>
                <div className="form-group mb-3">
                  <label className="form-label">
                    {t("question.question_en")}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <input
                    className={`form-control ${errors.question_en && "is-invalid"
                      }`}
                    {...register("question_en", { required: true })}
                  />
                  {errors.question_en && (
                    <p className="text-danger">{errors.question_en.message}</p>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">
                    {t("question.answer_en")}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    onInit={(evt, editor) => (editorEnRef.current = editor)}
                    initialValue=""
                    textareaName="answern_en"
                    onChange={() => {
                      setValue("answern_en", editorEnRef.current.getContent());
                    }}
                    init={{
                      min_height: 500,
                      menubar: false,
                      automatic_uploads: true,
                      image_title: true,
                      font_size_formats:
                        "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                      font_family_formats:
                        "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                      plugins: [
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "image",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | fontfamily fontsize | casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent | removeformat | a11ycheck code table image link media help",
                      images_upload_handler: (blobInfo, progress) =>
                        new Promise((resolve, reject) => {
                          const formData = new FormData();
                          formData.append(
                            "file",
                            blobInfo.blob(),
                            blobInfo.filename()
                          );

                          axios
                            .post(
                              `${process.env.NEXT_PUBLIC_HOST}/post/upload`,
                              formData
                            )
                            .then((res) => {
                              const location =
                                process.env.NEXT_PUBLIC_HOST_IMAGE +
                                res.data.location;
                              resolve(location);
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        }),
                      image_list: imageList,
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                  {errors.answern_en && (
                    <p className="text-danger">{errors.answern_en.message}</p>
                  )}
                </div>
              </>
            ),
          },
        ]}
      />
      <div className="flex justify-end">
        <Button
          onClick={() => router.back()}
          type="button"
          className="!bg-zinc-600 mt-3 mr-3"
        >
          Hủy
        </Button>
        <Button type="submit" className="!bg-blue mt-3" disabled={isDisable}>
          Lưu
        </Button>
      </div>
      {isLoading ? (
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
    </form>
  );
};

export default CreateCategory;
