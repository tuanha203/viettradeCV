/* eslint-disable react/jsx-no-target-blank */
import { Form, Input, Tabs, Typography } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";

import Button from "../../components/common/Button";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  useDetailPublication,
  useUpdatePublication,
} from "~/hooks/publication";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";

const UpdatePublication = ({ publicationId }) => {
  const { t } = useTranslation("common");
  const { data: { data: publication } = {}, isLoading } =
    useDetailPublication(publicationId);

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">Cập nhật ấn phẩm</p>
          <div className="mt-4">
            <FormUpdate publication={publication} t={t} />
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
          </div>
        </div>
      </div>
    </div>
  );
};

const FormUpdate = ({ publication, t }) => {
  if (!publication) return;
  const [tab, setTab] = useState(1);
  const [image, setImage] = useState({ preview: "" });
  const [pdf, setPdf] = useState({ preview: "" });
  const { mutate, isLoading, isSuccess } = useUpdatePublication();
  const router = useRouter();
  const editorViRef = useRef();
  const editorEnRef = useRef();
  const schema = yup.object().shape({
    title_vi: yup
      .string()
      .trim()
      .required("Tên bài viết là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),  
    content_vi: yup.string().trim().required("Mô tả là bắt buộc"),
    title_en: yup
      .string()
      .trim()
      .required("Tên tiếng anh bài viết là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    content_en: yup.string().trim().required("Mô tả tiếng anh là bắt buộc"),   
    feature_image: yup
      .mixed()
      .test("file-type", "Ảnh không hợp lệ", (value) => {
        if (typeof value === "string" || !value) {
          return true;
        }
        if (value && !value[0]) {
          return true;
        }
        if (["image/jpeg", "image/png", "image/jpg"].includes(value[0]?.type)) {
          setImage({
            preview: URL.createObjectURL(value[0]),
          });
          return true;
        } else {
          setImage({
            preview: publication.feature_image ? publication.feature_image : "",
          });
          return false;
        }
      })
      .test("fileSize", "Kích thước ảnh tối đa là 3 MB", (value) => {
        if (typeof value === "string" || !value) {
          return true;
        }
        if (value && !value[0]) {
          return true;
        }
        return value && value[0]?.size <= 3 * 1024 * 1024;
      }),
    pdf_file: yup.mixed().test("file-type", "Tệp không hợp lệ", (value) => {
      if (typeof value === "string" || !value) {
        return true;
      }
      if (value && !value[0]) {
        return true;
      }
      if (["application/pdf"].includes(value[0]?.type)) {
        setPdf({
          preview: URL.createObjectURL(value[0]),
        });
        return true;
      } else {
        setPdf({
          preview: publication.pdf_file ? publication.pdf_file : "",
        });
      }
    }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    setValue,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (Object.keys(errors).findIndex(item => item.includes("_vi")) !== -1 || Object.keys(errors).findIndex(item => !item.includes("_vi") && !item.includes("_en")) !== -1) {
      setTab(1);
    } else if (Object.keys(errors).findIndex(item => item.includes("_en")) !== -1) {
      setTab(2);
    }
  }, [errors])

  const onChange = (tab) => {
    setTab(tab);
  };

  useEffect(() => {
    if (publication) {
      reset({
        ...publication,
      });
    }
  }, [publication]);

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

  useEffect(() => {
    if (publication?.feature_image) {
      setImage({
        preview: publication?.feature_image,
      });
    }
    if (publication?.pdf_file) {
      setPdf({
        preview: publication?.pdf_file,
      });
    }
  }, []);

  const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
      <Typography.Text
        style={{
          maxWidth: "90%",
        }}
        ellipsis={{
          suffix,
        }}
      >
        {start}
      </Typography.Text>
    );
  };

  const onSubmit = handleSubmit((data) => {
    // Get the file object from the data object
    const id = publication?.id;
    const file = data.feature_image.length ? data.feature_image[0] : null;
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const content_vi = data.content_vi;
    const content_en = data.content_en;
    const description_vi = data.description_vi;
    const description_en = data.description_en;
    const pdf_file =
      data.pdf_file && data.pdf_file.length ? data.pdf_file[0] : null;
    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    if (file) {
    }
    formData.append("feature_image", file);
    formData.append("title_vi", title_vi);
    formData.append("title_en", title_en);
    formData.append("content_en", content_en);
    formData.append("content_vi", content_vi);
    formData.append("description_en", description_en);
    formData.append("description_vi", description_vi);
    formData.append("pdf_file", pdf_file);
    // Send the file to the API endpoint using the useMutation hook
    mutate({ formData, id });
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Cập nhật ấn phẩm thành công!", {
        toastId: "update",
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/publication");
      }, 500);
    }
  }, [isSuccess]);

  return (
    <div>
      <form name="publication" onSubmit={handleSubmit(onSubmit)}>
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
                      {t("publication.title")}
                      <span className="text-danger text-[18px]">*</span>
                    </label>
                    <input
                      className={`form-control ${
                        errors.title_vi && "is-invalid"
                      }`}
                      placeholder="Tiêu đề"
                      {...register("title_vi", { required: true })}
                    />
                    {errors.title_vi && (
                      <p className="text-danger">{errors.title_vi.message}</p>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("publication.description")}                     
                    </label>
                    <input
                      className={`form-control ${
                        errors.description_vi && "is-invalid"
                      }`}
                      placeholder="Mô tả"
                      {...register("description_vi", { required: true })}
                    />
                    {errors.description_vi && (
                      <p className="text-danger">
                        {errors.description_vi.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="card-title">
                      <h4 className="mb-0">
                        {t("publication.content")}
                        <span className="text-danger text-[18px]">*</span>
                      </h4>
                    </div>
                    <>
                      <Editor
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        onInit={(evt, editor) => (editorViRef.current = editor)}
                        initialValue={publication?.content_vi}
                        textareaName={publication?.content_vi}
                        onChange={() => {
                          setValue(
                            "content_vi",
                            editorViRef.current.getContent()
                          );
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
                                  `${process.env.NEXT_PUBLIC_HOST}/publication/upload`,
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
                    </>
                    {errors.content_vi && (
                      <p className="text-danger">{errors.content_vi.message}</p>
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
                      {t("publication.title_en")}
                      <span className="text-danger text-[18px]">*</span>
                    </label>
                    <input
                      className={`form-control ${
                        errors.title_en && "is-invalid"
                      }`}
                      placeholder="Tiêu đề"
                      {...register("title_en", { required: true })}
                    />
                    {errors.title_en && (
                      <p className="text-danger">{errors.title_en.message}</p>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("publication.description_en")}                      
                    </label>
                    <input
                      className={`form-control ${
                        errors.description_en && "is-invalid"
                      }`}
                      placeholder="Mô tả"
                      {...register("description_en", { required: true })}
                    />
                    {errors.description_en && (
                      <p className="text-danger">
                        {errors.description_en.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="card-title">
                      <h4 className="mb-0">
                        {t("publication.content_en")}
                        <span className="text-danger text-[18px]">*</span>
                      </h4>
                    </div>
                    <>
                      <Editor
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        onInit={(evt, editor) => (editorEnRef.current = editor)}
                        initialValue={publication?.content_en}
                        textareaName={publication?.content_en}
                        onChange={() => {
                          setValue(
                            "content_en",
                            editorEnRef.current.getContent()
                          );
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
                                  `${process.env.NEXT_PUBLIC_HOST}/publication/upload`,
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
                    </>
                    {errors.content_en && (
                      <p className="text-danger">{errors.content_en.message}</p>
                    )}
                  </div>
                </>
              ),
            },
          ]}
        ></Tabs>
        <div className="row mt-3">
          <div className="col-md-6 mt flex justify-center flex-col">
            <div className="form-group mc-3 ">
              <label className="form-label">
                {t("publication.feature_image")}
                <span className="text-danger text-[18px]">*</span>
              </label>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  id="inputGroupFile01"
                  {...register("feature_image", { required: true })}
                />
              </div>
              {errors.feature_image && (
                <p className="text-danger">
                  <span>{errors.feature_image.message}</span>
                </p>
              )}
            </div>
            <div className="form-group mb-3 mt-3">
              <label className="form-label">{t("publication.pdf_file")}</label>
              <input
                type="file"
                className="form-control"
                {...register("pdf_file", { required: false })}
              />
              {errors.pdf_file && (
                <p className="text-danger">{errors.pdf_file.message}</p>
              )}
              <a
                href={pdf.preview}
                target="_blank"
                className="flex items-center align-middle mt-3 "
              >
                <BsFillFileEarmarkPdfFill
                  className="mr-3"
                  style={{ fontSize: "24px", color: "red" }}
                />
                <EllipsisMiddle suffixCount={20}>
                  {pdf.preview.replace("blob:", "")}
                </EllipsisMiddle>
              </a>
            </div>
          </div>
          <div className="col-6">
            <div className="wp-preview-image">
              <label htmlFor="inputGroupFile01">
                <img
                  src={
                    image.preview
                      ? image.preview
                      : "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg"
                  }
                  alt=""
                  width="300"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => router.back()}
            type="button"
            className="!bg-zinc-600 mt-3 mr-3"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="!bg-blue mt-3"
            disabled={isSubmitSuccessful || isSubmitting}
          >
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
    </div>
  );
};

export default UpdatePublication;
