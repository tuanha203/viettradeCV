/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Select, Tabs } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { types } from "~/constants";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";
import {
  useCreateCategoryDocument,
  useListCategoryDocument,
} from "~/hooks/category-document";
import { useTranslation } from "react-i18next";
import Loading from "~/components/common/Loading";

const CreateCategoryDocument = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">
            Thêm mới danh mục tài liệu
          </p>
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
  const {
    mutate,
    data: dataCreate,
    isSuccess,
    isLoading,
  } = useCreateCategoryDocument();
  const onChange = (tab) => {
    setTab(tab);
  };

  const schema = yup.object().shape({
    title_vi: yup
      .string()
      .trim()
      .required("Tên danh mục là bắt buộc")
      .max(191, "Trường tên danh mục không dài quá 191 kí tự"),
    title_en: yup
      .string()
      .trim()
      .required("Tên tiếng anh danh mục là bắt buộc")
      .max(191, "Trường tên danh mục không dài quá 191 kí tự"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (Object.keys(errors).findIndex(item => item.includes("_vi")) !== -1 || Object.keys(errors).findIndex(item => !item.includes("_vi") && !item.includes("_vi")) !== -1) {
      setTab(1);
    } else if (Object.keys(errors).findIndex(item => item.includes("_en")) !== -1) {
      setTab(2);
    }
  }, [errors])

  useEffect(() => {
    if (dataCreate) {
      toast.success("Tạo mới danh mục thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/document-category");
      }, 1000);
    }
  }, [isSuccess]);

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

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))}>
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
                    {t("category-document.title_vi")}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <input
                    className={`form-control ${
                      errors.title_vi && "is-invalid"
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
                    {t("category-document.title_en")}
                    <span className="text-danger text-[18px]">*</span>
                  </label>
                  <input
                    className={`form-control ${
                      errors.title_en && "is-invalid"
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
        <label className="form-label pr-3 font-semibold">Chọn danh mục:</label>
        <Controller
          control={control}
          name="category_id"
          render={({ field: { value, onChange, ref } }) => (
            <Select
              options={[{ value: 0, label: "Lựa chọn" }, ...dataCategoryParent]}
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
};

export default CreateCategoryDocument;
