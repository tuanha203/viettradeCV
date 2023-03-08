import React, { useRef, useState } from "react";
import Button from "../../components/common/Button";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreatePublication } from "~/hooks/publication";
import { useTranslation } from "next-i18next";
import { Editor as MyEditor1 } from "@tinymce/tinymce-react";
import { Editor as MyEditor2 } from "@tinymce/tinymce-react";
import { Tabs } from "antd";
import axios from "axios";
import Loading from "~/components/common/Loading";
import Image from "next/image";
import noImage from "../../public/images/no-image.png";
import convertValidNameImage from "~/utils/image/convertValidNameImage";
import { createFile } from "~/utils/file";

const CreatePublication = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">Thêm mới ấn phẩm</p>
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
  const [tab, setTab] = useState(1);
  const [image, setImage] = useState({ preview: "" });
  const editorViRef = useRef();
  const editorEnRef = useRef();

  const schema = yup.object().shape({
    title_vi: yup
      .string().trim()
      .required("Tên bài viết là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    content_vi: yup.string().trim().required("Nội dung là bắt buộc"),    
    title_en: yup
      .string().trim()
      .required("Tên tiếng anh bài viết là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    content_en: yup.string().trim().required("Nội dung tiếng anh là bắt buộc"),  
    feature_image: yup
      .mixed()
      .required("Ảnh là bắt buộc")
      .test("file-cancel", "Ảnh là bắt buộc", (value) => {
        return value[0] ? true : false;
      })
      .test("file-type", "Ảnh không hợp lệ", (value) => {
        if (typeof value === "string" || !value) {
          return true;
        }
        if (value && !value[0]) {
          return true;
        }
        return ["image/jpeg", "image/png", "image/jpg"].includes(
          value[0]?.type
        );
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
      if (typeof value === "string") {
        return true;
      }
      if (value && !value[0]) {
        return true;
      }
      return ["application/pdf"].includes(value[0]?.type);
    }),
  });

  const {
    mutate,
    data,
    isSuccess,
    isLoading,
    data: dataCreate,
  } = useCreatePublication();

  useEffect(() => {
    if (dataCreate) {
      toast.success("Thêm mới ấn phẩm thành công!", {
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
    formState: { errors, isSubmitSuccessful, isSubmitting },
    setValue,
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

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    } else {
      setImage({
        preview: "",
      });
    }
  };

  const onChange = (tab) => {
    setTab(tab);
  };

  const onSubmit = (data) => {
    // Get the file object from the data object
    let file = data.feature_image[0];
    if (data.feature_image[0]) {
      const newNameImage = convertValidNameImage(data.feature_image[0].name);
      file = createFile(data.feature_image, newNameImage, {
        type: data.feature_image[0].type,
      });
    }
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const content_vi = data.content_vi;
    const content_en = data.content_en;
    const description_vi = data.description_vi;
    const description_en = data.description_en;
    const pdf_file = data.pdf_file[0];
    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    formData.append("pdf_file", pdf_file);
    formData.append("feature_image", file);
    formData.append("title_vi", title_vi);
    formData.append("title_en", title_en);
    formData.append("content_en", content_en);
    formData.append("content_vi", content_vi);
    formData.append("description_en", description_en);
    formData.append("description_vi", description_vi);
    mutate(formData);
  };

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
                      className={`form-control ${errors.title_vi && "is-invalid"
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
                      className={`form-control ${errors.description_vi && "is-invalid"
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
                      <MyEditor1
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
                              const formData2 = new FormData();
                              formData2.append(
                                "file",
                                blobInfo.blob(),
                                blobInfo.filename()
                              );

                              axios
                                .post(
                                  `${process.env.NEXT_PUBLIC_HOST}/post/upload`,
                                  formData2
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
                      className={`form-control ${errors.title_en && "is-invalid"
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
                      className={`form-control ${errors.description_en && "is-invalid"
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
                      <MyEditor2
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        onInit={(evt, editor) => (editorEnRef.current = editor)}
                        initialValue=""
                        textareaName="content_en"
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
                {t("post.feature_image")}{" "}
                <span className="text-danger text-[18px]">*</span>
              </label>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  id="inputGroupFile01"
                  {...register("feature_image", { required: true })}
                  onChange={handleImageChange}
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
            </div>
          </div>
          <div className="col-6">
            <div className="wp-preview-image">
              <label htmlFor="inputGroupFile01">
                <Image
                  src={image.preview ? image.preview : noImage}
                  alt=""
                  width={231}
                  height={231}
                  style={{
                    width: "231px",
                    height: "231px",
                  }}
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
            disabled={isSubmitSuccessful || isSubmitting}
            type="submit"
            className="!bg-blue mt-3"
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

export default CreatePublication;
