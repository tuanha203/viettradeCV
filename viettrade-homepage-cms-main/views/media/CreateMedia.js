import React, { useEffect, useRef, useState } from "react";
import { Tabs } from "antd";
import { useForm, Controller } from "react-hook-form";
import Button from "../../components/common/Button";
import { Editor } from "@tinymce/tinymce-react";
import { useCreateMedia } from "../../hooks/media";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";

const CreateMedia = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-[20px] font-semibold">Thêm mới media</h2>
          <div className="mt-4">
            <FormCreate />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormCreate = () => {
  const { t } = useTranslation("common");
  const [tab, setTab] = useState(1);
  const { mutate, data, isSuccess, isLoading } = useCreateMedia();
  const [isDisable, setIsDisable] = useState(false);
  const editorViRef = useRef();
  const editorEnRef = useRef();

  const router = useRouter();

  const onChange = (tab) => {
    setTab(tab);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Tạo mới Media thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/media");
      }, 500);
    }
  }, [isSuccess]);

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
  const schema = yup.object().shape({
    title_vi: yup
      .string()
      .trim()
      .required("Tên là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    content_vi: yup.string().trim().required("Nội dung là bắt buộc"),
    title_en: yup
      .string()
      .trim()
      .required("Tên tiếng anh là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    content_en: yup.string().trim().required("Nội dung tiếng anh là bắt buộc"),
    feature_video: yup.string().trim().required("Đường dẫn video là bắt buộc"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title_vi: "",
      title_en: "",
      content_vi: "",
      content_en: "",
      feature_video: "",
    },
  });

  useEffect(() => {
    if (Object.keys(errors).findIndex(item => item.includes("_vi")) !== -1 || Object.keys(errors).findIndex(item => !item.includes("_vi") && !item.includes("_en")) !== -1) {
      setTab(1);
    } else if (Object.keys(errors).findIndex(item => item.includes("_en")) !== -1) {
      setTab(2);
    }
  }, [errors])


  const onSubmit = (data) => {
    setIsDisable(true);
    const feature_video = data.feature_video;
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const content_vi = data.content_vi;
    const content_en = data.content_en;

    let mediaData = {
      title_vi: title_vi,
      title_en: title_en,
      content_en: content_en,
      content_vi: content_vi,
      feature_video: feature_video,
    };
    mutate(mediaData);
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
                <div className="form-group">
                  <label className="form-label">
                    {t("media.name")}{" "}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <input
                    className={`form-control ${errors.title_vi && "is-invalid"
                      }`}
                    {...register("title_vi", { required: true })}
                  />
                  {errors.title_vi && (
                    <p className="text-danger">{errors.title_vi.message}</p>
                  )}
                </div>

                <div className="mt-3">
                  <div className="card-title">
                    <h4 className="mb-0">
                      Nội dung{" "}
                      <span className="text-danger text-[18px]">*</span>
                    </h4>
                  </div>
                  <>
                    <Editor
                      tinymceScriptSrc="/tinymce/tinymce.min.js"
                      onInit={(evt, editor) => (editorViRef.current = editor)}
                      initialValue=""
                      textareaName="content_vi"
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
                                `${process.env.NEXT_PUBLIC_HOST}/gallery/upload`,
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
                <div className="form-group">
                  <label className="form-label">
                    {t("media.name")}{" "}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <input
                    className={`form-control ${errors.title_en && "is-invalid"
                      }`}
                    {...register("title_en", { required: true })}
                  />
                  {errors.title_en && (
                    <p className="text-danger">{errors.title_en.message}</p>
                  )}
                </div>

                <div className="mt-3">
                  <div className="card-title">
                    <h4 className="mb-0">
                      Nội dung{" "}
                      <span className="text-danger text-[18px]">*</span>
                    </h4>
                  </div>
                  <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    onInit={(evt, editor) => (editorEnRef.current = editor)}
                    initialValue=""
                    textareaName="content_en"
                    onChange={() =>
                      setValue("content_en", editorEnRef.current.getContent())
                    }
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
                      // images_upload_url: `${process.env.NEXT_PUBLIC_HOST}/post/upload`,
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
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                  {errors.content_en && (
                    <p className="text-danger">{errors.content_en.message}</p>
                  )}
                </div>
              </>
            ),
          },
        ]}
      ></Tabs>

      <div className="form-group mt-3">
        <label className="form-label">
          {t("media.feature_video")}{" "}
          <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.feature_video && "is-invalid"}`}
          {...register("feature_video")}
        />
        {errors.feature_video && (
          <p className="text-danger">{errors.feature_video.message}</p>
        )}
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
          className="btn-info font-medium mt-3"
          disabled={isDisable}
        >
          {t("common.save")}
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

export default CreateMedia;
