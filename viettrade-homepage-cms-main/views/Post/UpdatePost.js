/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-target-blank */
import { Form, Input, Tabs } from "antd";
import React, { useState, useRef, useEffect, useContext } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

import Button from "../../components/common/Button";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDetailPost, useUpdatePost } from "../../hooks/post";
import { useListCategory } from "../../hooks/category";
import { toast } from "react-toastify";
import { AdminContext } from "~/contexts/AdminContext";
import {
  permissions,
  postStatus,
  publishOptions,
  publishEditorOptions,
} from "~/constants";
import Loading from "~/components/common/Loading";
import { AiOutlineFileText } from "react-icons/ai";
import { ellipsShortNameFile } from "~/utils/string";

const UpdatePost = ({ postId }) => {
  const { t } = useTranslation("common");
  const { data: { data: post } = {}, isLoading } = useDetailPost(postId);
  const { data: { data: dataCategory } = {} } = useListCategory();

  dataCategory?.map((category) => {
    category.value = category.id;
    category.label = category.title_vi;
    return category;
  });


  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h4 className="text-[18px] font-semibold">Cập nhật tin tức</h4>
          <div className="mt-4">
            <FormUpdate post={post} dataCategory={dataCategory} t={t} />
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

const FormUpdate = ({ post, dataCategory, t }) => {
  if (!post || !dataCategory) return;
  const [tab, setTab] = useState(1);
  const [image, setImage] = useState({ preview: "" });
  const [pointEvent, setPointEvent] = useState('pointer-events-auto');
  const [document, setDocument] = useState([]);
  const [documentPre, setDocumentPre] = useState([]);
  const { mutate, data: dataUpdate, isLoading, isSuccess } = useUpdatePost();
  const { admin } = useContext(AdminContext);
  const router = useRouter();
  const editorViRef = useRef();
  const editorEnRef = useRef();
  const schema = yup.object().shape({
    title_vi: yup
      .string()
      .trim()
      .required("Tên bài viết là bắt buộc")
      .max(255, "Trường tên bài viết không dài quá 255 kí tự"),
    description_vi: yup.string().trim().required("Mô tả bài viết là bắt buộc"),
    content_vi: yup.string().trim().required("Mô tả là bắt buộc"),
    title_en: yup
      .string()
      .trim()
      .required("Tên tiếng anh bài viết là bắt buộc")
      .max(255, "Trường tên bài viết không dài quá 255 kí tự"),
    content_en: yup.string().trim().required("Mô tả tiếng anh là bắt buộc"),
    description_en: yup.string().trim().required("Mô tả bài viết là bắt buộc"),
    feature_image: yup
      .mixed()
      .test("file-type", "Ảnh không hợp lệ", (value) => {
        if (typeof value === "string") {
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
        if (typeof value === "string") {
          return true;
        }
        if (value && !value[0]) {
          return true;
        }
        return value && value[0]?.size <= 3 * 1024 * 1024;
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

  useEffect(() => {
    if (dataUpdate) {
      toast.success("Cập nhật bài viết thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/post");
      }, 1000);
    }
  }, [isSuccess]);

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    } else {
      setImage({
        preview: "",
        raw: "",
      });
    }
  };

  const onChange = (tab) => {
    setTab(tab);
  };

  useEffect(() => {
    if (post) {
      reset({
        ...post,
        publishSelected: publishEditorOptions.find(
          (item) => item.value === post?.publish
        ),
        categorySelected: dataCategory?.find(
          (category) => category.id === post?.category_id
        ),
      });
    }
  }, [post]);

  useEffect(() => {
    if (post?.feature_image) {
      setImage({
        preview: post?.feature_image,
      });
    }
    if (post?.feature_document) {
      setDocument(JSON.parse(post.feature_document));
    }
  }, []);

  const handleDocumentChange = (e) => {
    if (e.target.files.length) {
      setDocumentPre(Object.values(e.target.files));
      setDocument([]);
    } else {
      setDocument(JSON.parse(post.feature_document));
      setDocumentPre([]);
    }
  };

  const onSubmit = handleSubmit((data) => {
    // Get the file object from the data object
    const id = post?.id;
    const file = data.feature_image.length ? data.feature_image[0] : null;
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const content_vi = data.content_vi;
    const content_en = data.content_en;
    const description_vi = data.description_vi;
    const description_en = data.description_en;
    const category_id = data.category_id;
    const publish = data.publish;
    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    if (data.feature_document?.length > 0) {
      for (let i = 0; i < data.feature_document.length; i++) {
        formData.append("feature_document", data.feature_document[i]);
      }
    }
    formData.append("feature_image", file);
    formData.append("title_vi", title_vi);
    formData.append("title_en", title_en);
    formData.append("content_en", content_en);
    formData.append("content_vi", content_vi);
    formData.append("description_en", description_en);
    formData.append("description_vi", description_vi);
    formData.append("category_id", category_id);
    formData.append("publish", publish);
    formData.append("id", id);
    // Send the file to the API endpoint using the useMutation hook
    mutate({ formData, id });
  });

  if (isSuccess) {
    setTimeout(() => {
      router.push("/post");
    }, 500);
  }

  return (
    <form onSubmit={onSubmit}>
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
                    {t("post.name")}{" "}
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
                <div className="form-group mt-3">
                  <label className="form-label">
                    {t("post.description")}{" "}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <input
                    className={`form-control ${errors.description_vi && "is-invalid"
                      }`}
                    {...register("description_vi", { required: true })}
                  />
                  {errors.title_vi && (
                    <p className="text-danger">
                      {errors.description_vi?.message}
                    </p>
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
                    onInit={(evt, editor) => (editorViRef.current = editor)}
                    initialValue={post?.content_vi}
                    textareaName={post?.content_vi}
                    onChange={() =>
                      setValue("content_vi", editorViRef.current.getContent())
                    }
                    init={{
                      min_height: 500,
                      menubar: false,
                      automatic_uploads: true,
                      image_title: true,
                      font_size_formats:
                        "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                      font_family_formats:
                        "Roboto=roboto; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
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
                        "body { font-family:Roboto,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                  {errors.content_en && (
                    <p className="text-danger">{errors.content_en.message}</p>
                  )}
                </div>

                <div class="mt-3">
                  <div class="card-title">
                    <h4 class="mb-0">
                      {t("post.category")}{" "}
                      <span className="text-danger text-[18px]">*</span>
                    </h4>
                  </div>

                  <Controller
                    control={control}
                    name="categorySelected"
                    render={({ field: { onChange, value, ref } }) => {
                      return (
                        <Select
                          inputRef={ref}
                          options={dataCategory}
                          value={value}
                          onChange={(val) => {
                            onChange(
                              dataCategory?.find(
                                (category) => category.id === val.id
                              )
                            );
                            setValue("category_id", val.id);
                          }}
                        />
                      );
                    }}
                  />
                </div>

                <div class="mt-3">
                  <div class="card-title">
                    <h4 class="mb-0">
                      {t("post.publish")}{" "}
                      <span className="text-danger text-[18px]">*</span>
                    </h4>
                  </div>
                  <Controller
                    control={control}
                    name="publishSelected"
                    render={({ field: { onChange, value, ref } }) => {
                      return (
                        <Select
                          inputRef={ref}
                          options={
                            admin?.role === permissions.content
                              ? publishEditorOptions
                              : publishOptions
                          }
                          value={value}
                          onChange={(val) => {
                            onChange(val);
                            setValue("publish", val.value);
                          }}
                        />
                      );
                    }}
                  />
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
                    {t("post.name")}{" "}
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
                <div className="form-group mt-3">
                  <label className="form-label">
                    {t("post.description")}{" "}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <input
                    className={`form-control ${errors.description_en && "is-invalid"
                      }`}
                    {...register("description_en", { required: true })}
                  />
                  {errors.title_vi && (
                    <p className="text-danger">
                      {errors.description_en?.message}
                    </p>
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
                    initialValue={post?.content_en}
                    textareaName={post?.content_en}
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
                        "Roboto=roboto; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
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
                        "body { font-family:Roboto,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                  {errors.content_en && (
                    <p className="text-danger">{errors.content_en.message}</p>
                  )}
                </div>

                <div class="mt-3">
                  <div class="card-title">
                    <h4 class="mb-0">
                      {t("post.category")}{" "}
                      <span className="text-danger text-[18px]">*</span>
                    </h4>
                  </div>
                  <Controller
                    control={control}
                    name="categorySelected"
                    render={({ field: { onChange, value, ref } }) => {
                      return (
                        <Select
                          inputRef={ref}
                          options={dataCategory}
                          value={value}
                          onChange={(val) => {
                            onChange(
                              dataCategory?.find(
                                (category) => category.id === val.id
                              )
                            );
                            setValue("category_id", val.id);
                          }}
                        />
                      );
                    }}
                  />
                </div>

                <div class="mt-3">
                  <div class="card-title">
                    <h4 class="mb-0">
                      {t("post.publish")}{" "}
                      <span className="text-danger text-[18px]">*</span>
                    </h4>
                  </div>
                  <Controller
                    control={control}
                    name="publishSelected"
                    render={({ field: { onChange, value, ref } }) => (
                      <Select
                        inputRef={ref}
                        options={
                          admin?.role === permissions.content
                            ? publishEditorOptions
                            : publishOptions
                        }
                        value={value}
                        onChange={(val) => {
                          onChange(val);
                          setValue("publish", val.value);
                        }}
                      />
                    )}
                  />
                </div>
              </>
            ),
          },
        ]}
      />
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="form-group mc-3">
            <label className="form-label">
              {t("post.feature_image")}{" "}
              <span className="text-danger text-[18px]">*</span>
            </label>
            <div className="input-group mb-3">
              <input
                type="file"
                className="form-control"
                id="inputGroupFile01"
                {...register("feature_image")}
                onChange={handleImageChange}
              />
            </div>
            {errors.feature_image && (
              <p className="text-danger">
                <span>{errors.feature_image.message}</span>
              </p>
            )}
          </div>
          <div className="form-group mc-3">
            <label className="form-label">
              {t("post.feature_document")}{" "}              
            </label>
            <div className="input-group mb-3">
              <input
                type="file"
                className="form-control"
                id="inputGroupFile01"
                {...register("feature_document")}
                onChange={handleDocumentChange}
                multiple
              />
            </div>
            {errors.feature_document && (
              <p className="text-danger">
                <span>{errors.feature_document.message}</span>
              </p>
            )}
          </div>
          <div className="input-group mb-3">
            <div className="flex flex-col">
              {document?.map((doc) => {
                return (
                  <>
                    <div className="flex p-1">
                      <div className="px-3">
                        <AiOutlineFileText
                          style={{ fontSize: "23px", color: "#4e77c1" }}
                        />
                      </div>
                      <a target="_blank" href={doc}>
                        {ellipsShortNameFile(doc, 7, -25)}
                      </a>
                    </div>
                  </>
                );
              })}
              {documentPre?.map((doc) => {
                return (
                  <>
                    <div className="flex p-1">
                      <div className="px-3">
                        <AiOutlineFileText
                          style={{ fontSize: "23px", color: "#4e77c1" }}
                        />
                      </div>
                      <a target="_blank" href={URL.createObjectURL(doc)}>
                        {doc.name}
                      </a>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="wp-preview-image">
            <img
              src={
                image.preview
                  ? image.preview
                  : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
              }
              alt=""
              width="300"
            />
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
          className={`!bg-blue mt-3 ${pointEvent}`}
          disabled={isSubmitSuccessful || isSubmitting}
          onClick={()=>setPointEvent('pointer-events-none')}
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

export default UpdatePost;
