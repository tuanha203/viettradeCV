/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import Button from "../../components/common/Button";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";
import {
  useDetailDepartment,
  useListDepartment,
  useUpdateDepartment,
} from "~/hooks/department";

const UpdateDepartment = ({ departmentId }) => {
  const { data: { data: department } = {}, isLoading } =
    useDetailDepartment(departmentId);
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-[20px] font-semibold">Cập nhật lãnh đạo cục</h2>
          <div className="mt-4">
            <FormUpdate department={department} />
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

const FormUpdate = ({ department }) => {
  if (!department) return;
  const { t } = useTranslation("common");
  const {
    mutate,
    data: dataUpdate,
    isSuccess,
    isLoading,
  } = useUpdateDepartment();

  const router = useRouter();

  const [image, setImage] = useState({ preview: "" });
  const [pointEvent, setPointEvent] = useState('pointer-events-auto');

  const schema = yup.object().shape(
    {
      full_name: yup
        .string()
        .trim()
        .required("Tên là bắt buộc")
        .max(191, "Trường tên không dài quá 191 kí tự"),
      position_vi: yup
        .string()
        .trim()
        .required("Chức vụ tiếng việt là bắt buộc"),
      position_en: yup
        .string()
        .trim()
        .required("Chức vụ tiếng anh là bắt buộc"),
      phone: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .when("phone", {
          is: (value) => value?.length,
          then: (rule) =>
            rule.matches(
              /^[0-9_@.( )/#&+-]*$/,
              "Số điện thoại không đúng định dạng"
            ),
        }),

      email: yup
        .string()
        .trim()
        .required("Email là bắt buộc")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Email không đúng định dạng"
        ),

      feature_image: yup
        .mixed()
        .required("Ảnh là bắt buộc")
        .test("file-cancel", "Ảnh là bắt buộc", (value) => {
          if (typeof value === "string" || !value) {
            return true;
          }
          if (value && !value[0]) {
            return true;
          }
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
    },
    [["phone", "phone"]]
  );

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
    if (dataUpdate) {
      toast.success("Cập nhật lãnh đạo cục thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/department");
      }, 1000);
    }
  }, [isSuccess]);
  const { data: { data: parentDepartments } = {} } = useListDepartment({
    pagination: {
      pageSize: null,
      current: 1,
    },
    sorter: {
      sort: "asc",
      sortColumn: "createdAt",
    },
    parent_id: 0,
  });

  parentDepartments?.map((parent) => {
    parent.label = parent.position_vi;
    parent.value = parent.id;
    return parent;
  });

  useEffect(() => {
    if (department) {
      reset({
        ...department,
        parentDepartmentSelected: parentDepartments?.find(
          (parentDepartment) => parentDepartment.id === department?.parent_id
        ),
      });
    }
  }, [department]);

  useEffect(() => {
    if (department?.feature_image) {
      setImage({
        preview: department?.feature_image,
      });
    }
  }, []);

  const onSubmit = (data) => {
    // Get the file object from the data object
    const id = department?.id;
    const file = data.feature_image?.length ? data.feature_image[0] : null;
    const full_name = data.full_name;
    const position_vi = data.position_vi;
    const position_en = data.position_en;
    const parent_id = data.parent_id;
    const phone = data.phone;
    const email = data.email;
    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    formData.append("id", id);
    formData.append("feature_image", file);
    formData.append("full_name", full_name);
    formData.append("position_vi", position_vi);
    formData.append("position_en", position_en);
    formData.append("parent_id", parent_id);
    formData.append("phone", phone);
    formData.append("email", email);
    mutate({ formData, id });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      setImage({
        preview: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">
          Tên <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.full_name && "is-invalid"}`}
          {...register("full_name", { required: true })}
        />
        {errors.full_name && (
          <p className="text-danger">{errors.full_name.message}</p>
        )}
      </div>

      <div className="form-group mt-3">
        <label className="form-label">
          Chức vụ tiếng việt
          <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.position_vi && "is-invalid"}`}
          {...register("position_vi")}
        />
        {errors.position_vi && (
          <p className="text-danger">{errors.position_vi.message}</p>
        )}
      </div>

      <div className="form-group mt-3">
        <label className="form-label">
          Chức vụ tiếng anh
          <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.position_en && "is-invalid"}`}
          {...register("position_en")}
        />
        {errors.position_en && (
          <p className="text-danger">{errors.position_en.message}</p>
        )}
      </div>
      <div className="form-group mt-3">
        <label className="form-label">Số điện thoại</label>
        <input
          className={`form-control ${errors.phone && "is-invalid"}`}
          {...register("phone")}
        />
        {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
      </div>

      <div className="form-group mt-3">
        <label className="form-label">
          Email
          <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.email && "is-invalid"}`}
          {...register("email")}
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>

      <div className="mt-3" style={{ display: "none" }}>
        <div className="card-title">
          <h4 className="mb-0">Parent id</h4>
        </div>
        <Controller
          control={control}
          name="parentDepartmentSelected"
          render={({ field: { onChange, value, ref } }) => (
            <Select
              inputRef={ref}
              options={parentDepartments}
              value={value}
              onChange={(val) => {
                onChange(val);
                setValue("parent_id", val.id);
              }}
            />
          )}
        />
        {errors.parentDepartmentSelected && (
          <p className="text-danger">
            {errors.parentDepartmentSelected.message}
          </p>
        )}
      </div>
      <div className="col-6 flex flex-col mt-3">
        <label>
          Ảnh <span className="text-danger text-[18px]">*</span>
        </label>
        <div className="wp-preview-image">
          <label htmlFor="feature_image">
            <img
              src={
                image.preview
                  ? image.preview
                  : "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg"
              }
              alt=""
              width="300"
            />
            {errors.feature_image && (
              <p className="text-danger text-center">
                {errors.feature_image.message}
              </p>
            )}
          </label>
          <input
            type="file"
            className="form-control flex-row-reverse"
            id="feature_image"
            {...register("feature_image")}
            onChange={handleImageChange}
            style={{ width: 0, height: 0, opacity: 0 }}
          />
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
          className={`btn-info font-medium mt-3 ${pointEvent}`}
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

export default UpdateDepartment;
