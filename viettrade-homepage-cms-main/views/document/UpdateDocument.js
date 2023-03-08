/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import { Form, Input, Select, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../components/common/Button";
import { Router, useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDetailDocument, useUpdateDocument } from "~/hooks/document";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { AiOutlineFileText } from "react-icons/ai";
import { useListCategoryDocument } from "~/hooks/category-document";
import Loading from "~/components/common/Loading";
import { SUPPORTED_FORMATS } from "~/constants";
import { ellipsShortNameFile } from "~/utils/string";

const UpdateDocument = ({ documentId }) => {
  const { data: { data: document } = {}, isLoading } =
    useDetailDocument(documentId);
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">Cập nhật tài liệu</p>
          <div className="mt-4">
            <FormUpdate document={document} />
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

const FormUpdate = React.memo(({ document }) => {
  if (!document) return;

  const {
    mutate,
    data: dataUpdate,
    isLoading,
    isSuccess,
  } = useUpdateDocument();
  const [tab, setTab] = useState(1);
  const { t } = useTranslation("common");
  const [subCategory, setSubCategory] = useState();
  const [parentSelected, setParentSelected] = useState();
  const [childSelected, setChildSelected] = useState();
  const [subCategoryList, setSubCategoryList] = useState([]);

  const router = useRouter();
  const [file, setFile] = useState("");

  const schema = yup.object().shape({
    title_vi: yup.string().trim().required("Tên bài viết không được để trống"),
    title_en: yup
      .string()
      .trim()
      .required("Tên tiếng anh bài viết không được để trống"),
    feature_document: yup
      .mixed()
      .test("file-cancel", "Tài liệu đính kèm không được để trống", (value) => {
        if (file === document.feature_document) return true
        if (value.length !== 0 && typeof value !== "string") {
          setFile(URL.createObjectURL(value[0]));
          return true;
        }
        else {
          setFile(document.feature_document ? document.feature_document : "");
          return false;
        }
        // return value[0] ? true : false;        
      })
      .test("file-type", "Tài liệu đính kèm không hợp lệ", (value) => {
        if (file === document.feature_document) return true
        if (!value) return true;
        return SUPPORTED_FORMATS.includes(value[0]?.type);
      }),
    childSelected: yup
      .number()
      .required()
      .test("number", "Danh mục phụ không được để trống", (value) => {
        if (value === -1) {
          return false;
        }
        return true;
      }),
    parentSelected: yup
      .mixed()
      .required()
      .test("number", "Danh mục không được để trống", (value) => {
        if (value === -1) {
          return false;
        }
        return true;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
    control,
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

  useEffect(() => {
    if (dataUpdate) {
      toast.success("Cập nhật tài liệu thành công!", {
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
      }, 1000);
    }
  }, [isSuccess]);

  const onChange = (tab) => {
    setTab(tab);
  };

  const onSubmit = (data) => {
    const id = document.id;
    const file =
      typeof data.feature_document !== "string" && data.feature_document.length
        ? data.feature_document[0]
        : null;
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const description_vi = "";
    const description_en = "";
    const category_id = data.childSelected;

    const formData = new FormData();

    formData.append("feature_document", file);
    formData.append("title_vi", title_vi);
    formData.append("category_id", category_id);
    formData.append("title_en", title_en);
    formData.append("description_en", description_en);
    formData.append("description_vi", description_vi);
    mutate({ formData, id });
  };

  useEffect(() => {
    if (document?.feature_document) {
      setFile(document?.feature_document);
    }
  }, []);

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

  useEffect(() => {
    if (dataSubCategory) {
      dataSubCategory.map((cat) => {
        if (cat.id == document.category_id) {
          setChildSelected(cat.id);
          setParentSelected(cat.category_id);
        }
      });
    }



  }, [dataSubCategory]);
  useEffect(() => {
    setSubCategoryList(
      dataSubCategory.filter((cat) => cat.category_id === parentSelected)
    );
  }, [parentSelected]);



  useEffect(() => {
    reset({
      ...document,
      childSelected: childSelected,
      parentSelected: parentSelected,
    });
  }, [childSelected, parentSelected]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
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
                      className={`form-control ${errors.title_vi && "is-invalid"
                        }`}
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
                      className={`form-control ${errors.title_en && "is-invalid"
                        }`}
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
        />
        <div className="from-group mb-3">
          <label className="form-label">
            Chọn danh mục
            <span className="text-danger text-[18px]">*</span>
          </label>
          <Controller
            control={control}
            name="parentSelected"
            render={({ field: { value, onChange, ref } }) => {
              return (
                <Select
                  options={[
                    { value: -1, label: "Lựa chọn" },
                    ...dataCategoryParent,
                  ]}
                  value={value}
                  placeholder="Lựa chọn"
                  style={{
                    width: "100%",
                  }}
                  onChange={(val) => {
                    onChange(val);
                    setParentSelected(val);
                    setValue("parent_id", val);
                    if (val !== -1) {
                      setSubCategoryList(
                        dataSubCategory.filter((cat) => cat.category_id === val)
                      );
                    } else {
                      setSubCategoryList([]);
                    }
                    setChildSelected(-1);
                  }}
                />
              );
            }}
          />
          {errors.parentSelected && (
            <p className="text-danger">{errors.parentSelected.message}</p>
          )}
        </div>
        <div className="from-group mb-3">
          <label className="form-label">
            Chọn danh mục phụ
            <span className="text-danger text-[18px]">*</span>
          </label>
          <Controller
            control={control}
            name="childSelected"
            render={({ field: { value, onChange, ref } }) => (
              <Select
                options={[
                  { value: -1, label: "Lựa chọn" },
                  ...subCategoryList,
                ].filter((sl) => sl.parent !== null)}
                value={value}
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
          {errors.childSelected && (
            <p className="text-danger">{errors.childSelected.message}</p>
          )}
        </div>
        <div className="form-group mb-3 mt-3">
          <label className="form-label">{t("document.feature_document")}<span className="text-danger text-[18px]">*</span></label>
          <input
            type="file"
            className="form-control"
            {...register("feature_document", { required: false })}
          />
          {errors.feature_document && (
            <p className="text-danger">{errors.feature_document.message}</p>
          )}
          <a
            href={file}
            target="_blank"
            className="flex items-center align-middle mt-3 "
          >
            <AiOutlineFileText
              className="mr-3"
              style={{ fontSize: "24px", color: "blue" }}
            />
            {ellipsShortNameFile(file, 20, -20)}
          </a>
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
  );
});

export default UpdateDocument;
