/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import Button from "../../components/common/Button";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "next-i18next";
import { Select, Tabs, Typography } from "antd";
import { useCreateDocument } from "~/hooks/document";
import { AiOutlineFileText } from "react-icons/ai";
import { useListCategoryDocument } from "~/hooks/category-document";
import Loading from "~/components/common/Loading";
import { SUPPORTED_FORMATS } from "~/constants";

const CreateDocument = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">Thêm mới tài liệu</p>
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
  const [file, setFile] = useState({ preview: "" });
  const [subCategory, setSubCategory] = useState(-1);
  const editorViRef = useRef();
  const editorEnRef = useRef();

  const schema = yup.object().shape({
    title_vi: yup.string().trim().required("Tên bài viết không được để trống"),
    title_en: yup
      .string()
      .trim()
      .required("Tên tiếng anh bài viết không được để trống"),
    feature_document: yup
      .mixed()
      .test("file-cancel", "Tài liệu đính kèm không được để trống", (value) => {       
        if (value.length !== 0) {
          setFile({
            preview: URL.createObjectURL(value[0]),
          });
        } else {
          setFile({
            preview: null,
          });
        }
        
        return value[0] ? true : false;
      })
      .test("file-type", "Tài liệu đính kèm không hợp lệ", (value) => {
        if (!value) return true;
        return SUPPORTED_FORMATS.includes(value[0]?.type);
      }),
    parent_id: yup.number().required("Vui lòng chọn danh mục"),
    category_id: yup.number().required("Danh mục phụ không được để trống"),
  });

  const {
    mutate,
    data,
    isSuccess,
    isLoading,
    data: dataCreate,
  } = useCreateDocument();

  useEffect(() => {
    if (dataCreate) {
      toast.success("Thêm mới tài liệu thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/document");
      }, 500);
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    setValue,
    control,
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

  const { data: { data: dataCategoryParent = [] } = {} } =
    useListCategoryDocument({
      pagination: {
        pageSize: null,
        current: 1,
      },
      sorter: {
        sort: "asc",
        sortColumn: "createdAt",
      },
      category_id: 0,
    });

  dataCategoryParent?.map((parent) => {
    parent.label = parent.title_vi;
    parent.value = parent.id;
    return parent;
  });

  const { data: { data: dataSubCategory = [] } = {} } = useListCategoryDocument(
    {
      pagination: {
        pageSize: null,
        current: 1,
      },
      sorter: {
        sort: "asc",
        sortColumn: "createdAt",
      },
      category_id: subCategory,
    }
  );

  dataSubCategory?.map((parent) => {
    parent.label = parent.title_vi;
    parent.value = parent.id;
    return parent;
  });

  const onSubmit = (data) => {
    // Get the file object from the data object
    const file = data.feature_document[0];
    const category_id = data.category_id;
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const description_vi = "";
    const description_en = "";
    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    formData.append("feature_document", file);
    formData.append("title_vi", title_vi);
    formData.append("category_id", category_id);
    formData.append("title_en", title_en);
    formData.append("description_en", description_en);
    formData.append("description_vi", description_vi);
    mutate(formData);
  };

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
                      {t("document.title")}
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
                      {t("document.title_en")}
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
                </>
              ),
            },
          ]}
        ></Tabs>
        <div className="from-group mb-3">
          <label className="form-label">
            Chọn danh mục
            <span className="text-danger text-[18px]">*</span>            
          </label>
          <Controller
            control={control}
            name="parent_id"
            render={({ field: { value, onChange, ref } }) => (
              <Select
                options={[
                  { value: -1, label: "Lựa chọn" },
                  ...dataCategoryParent,
                ]}
                placeholder="Lựa chọn"
                style={{
                  width: "100%",
                }}
                onChange={(val) => {
                  onChange(val);
                  setValue("parent_id", val);
                  setSubCategory(val);
                }}
              />
            )}
          />
          {errors.parent_id && (
            <p className="text-danger">{errors.parent_id.message}</p>
          )}
        </div>
        <div className="from-group mb-3">
          <label className="form-label">
            Chọn danh mục phụ
            <span className="text-danger text-[18px]">*</span>
          </label>
          <Controller
            control={control}
            name="category_id"
            render={({ field: { value, onChange, ref } }) => (
              <Select
                options={[
                  { value: null, label: "Lựa chọn" },
                  ...dataSubCategory,
                ].filter((sl) => sl.parent !== null)}
                placeholder="Lựa chọn"
                style={{
                  width: "100%",
                }}
                onChange={(val) => {
                  onChange(val);
                  setValue("category_id", val);
                }}
              />
            )}
          />
          {errors.category_id && (
            <p className="text-danger">{errors.category_id.message}</p>
          )}
        </div>
        <div className="row mt-3">
          <div className="col-md-6 mt flex justify-center flex-col">
            <div className="form-group mb-3 mt-3">
              <label className="form-label">
                {t("document.feature_document")}
                <span className="text-danger text-[18px]">*</span>
              </label>
              <input
                type="file"
                className="form-control"
                {...register("feature_document", { required: false })}
              />
              {file.preview && (
                <a
                  href={file.preview}
                  target="_blank"
                  className="flex items-center align-middle mt-3 "
                >
                  <AiOutlineFileText
                    className="mr-3 "
                    style={{ fontSize: "24px", color: "blue" }}
                  />
                  <EllipsisMiddle suffixCount={20}>
                    {file.preview.replace("blob:", "")}
                  </EllipsisMiddle>
                </a>
              )}
              {errors.feature_document && (
                <p className="text-danger">{errors.feature_document.message}</p>
              )}
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

export default CreateDocument;
