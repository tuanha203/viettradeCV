/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Select, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../components/common/Button";
import { Router, useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  useDetailCategoryDocument,
  useListCategoryDocument,
  useUpdateCategoryDocument,
} from "~/hooks/category-document";
import { useTranslation } from "react-i18next";
import Loading from "~/components/common/Loading";

const UpdateCategoryDocument = ({ categoryDocumentId }) => {
  const { data: { data: categoryDocument } = {}, isLoading } =
    useDetailCategoryDocument(categoryDocumentId);

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">
            Cập nhật danh mục tài liệu
          </p>
          <div className="mt-4">
            <FormUpdate categoryDocument={categoryDocument} />
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

const FormUpdate = ({ categoryDocument }) => {
  if (!categoryDocument) return;
  const { t } = useTranslation("common");
  const {
    mutate,
    data: dataUpdate,
    isLoading,
    isSuccess,
  } = useUpdateCategoryDocument();
  const router = useRouter();
  const schema = yup.object().shape({
    title_vi: yup
      .string()
      .trim()
      .required("Tên thể loại là bắt buộc")
      .max(191, "Trường tên thể loại không dài quá 191 kí tự"),
    title_en: yup
      .string()
      .trim()
      .required("Tên tiếng anh thể loại là bắt buộc")
      .max(191, "Trường tên thể loại không dài quá 191 kí tự"),
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
    if (categoryDocument) {
      reset({
        ...categoryDocument,
      });
    }
  }, [categoryDocument]);

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

  useEffect(() => {
    if (dataUpdate) {
      toast.success("Cập nhật danh mục tài liệu thành công!", {
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

  useEffect(() => {
    if (categoryDocument) {
      reset({
        ...categoryDocument,
        categorySelected: dataCategoryParent.find(
          (cat) => cat.value === categoryDocument.category_id
        ),
      });
    }
  }, [categoryDocument]);

  useEffect(() => {
    if (Object.keys(errors).findIndex(item => item.includes("_vi")) !== -1 || Object.keys(errors).findIndex(item => !item.includes("vi") && !item.includes("_en")) !== -1) {
      setTab(1);
    } else if (Object.keys(errors).findIndex(item => item.includes("_en")) !== -1) {
      setTab(2);
    }
  }, [errors])

  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
    >
      <Tabs
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
                <div className="form-group">
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
      <div className="form-group mb-3">
        <label className="form-label">
          {t("category-document.category_id")}
          <span className="text-danger text-[18px]">*</span>
        </label>
        <Controller
          control={control}
          name="categorySelected"
          render={({ field: { value, onChange, ref } }) => (
            <Select
              disabled={categoryDocument.category_id === 0 ? true : false}
              options={[{ value: 0, label: "Lựa chọn" }, ...dataCategoryParent]}
              value={value}
              style={{
                width: "100%",
              }}
              className={`${errors.categorySelected && "is-invalid"}`}
              onChange={(val) => {
                onChange(val);
                setValue("category_id", val);
              }}
            />
          )}
        />
        {errors.categorySelected && (
          <p className="text-danger">{errors.categorySelected.message}</p>
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

export default UpdateCategoryDocument;
