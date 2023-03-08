import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { types } from "~/constants";
import Button from "../../components/common/Button";
import { useCreateCategory } from "../../hooks/category";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";

const CreateCategory = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">Thêm mới thể loại</p>
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
  const {
    mutate,
    data: dataCreate,
    isSuccess,
    isLoading,
  } = useCreateCategory();

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
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });


  useEffect(() => {
    if (dataCreate) {
      toast.success("Tạo mới thể loại thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/category");
      }, 1000);
    }
  }, [isSuccess]);

  const onSubmit = (data) => {
    if (isLoading) {
      return;
    }
    // Get the file object from the data object
    const title_vi = data.title_vi;
    const title_en = data.title_en;

    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    formData.append("title_vi", title_vi);
    formData.append("title_en", title_en);
    // Send the file to the API endpoint using the useMutation hook
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group mb-3">
        <label className="form-label">
          Tên thể loại tiếng Việt <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.title_vi && "is-invalid"}`}
          {...register("title_vi", { required: true })}
        />
        {errors.title_vi && (
          <p className="text-danger">{errors.title_vi.message}</p>
        )}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">
          Tên thể loại tiếng Anh <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.title_en && "is-invalid"}`}
          {...register("title_en", { required: true })}
        />
        {errors.title_en && (
          <p className="text-danger">{errors.title_en.message}</p>
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

export default CreateCategory;
