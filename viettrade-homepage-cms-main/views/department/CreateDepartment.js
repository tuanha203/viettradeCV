/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { useCreateDepartment, useListDepartment } from "~/hooks/department";
import noImage from "../../public/images/no-image.png";
import Image from "next/image";
import convertValidNameImage from "~/utils/image/convertValidNameImage";
import { createFile } from "~/utils/file";

const CreateDepartment = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-[20px] font-semibold">Thêm mới lãnh đạo cục</h2>
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
  const {
    mutate,
    data: dataCreate,
    isSuccess,
    isLoading,
  } = useCreateDepartment();

  const router = useRouter();
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

  parentDepartments?.map((parentDepartment) => {
    parentDepartment.value = parentDepartment.id;
    parentDepartment.label = parentDepartment.position_vi;
    return parentDepartment;
  });
  const [image, setImage] = useState({ preview: "" });

  const schema = yup.object().shape(
    {
      full_name: yup
        .string().trim()
        .required("Tên là bắt buộc")
        .max(191, "Trường tên không dài quá 191 kí tự"),
      position_vi: yup.string().trim().required("Chức vụ tiếng việt là bắt buộc"),
      position_en: yup.string().trim().required("Chức vụ tiếng anh là bắt buộc"),
      phone: yup
        .string().trim()
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
        .string().trim()
        .required("Email là bắt buộc")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Email không đúng định dạng"
        ),
      feature_image: yup
        .mixed()
        .test("file-cancel", "Ảnh là bắt buộc", (value) => {
          if (!value) return true;
          return value[0] ? true : false;
        })
        .test("file-type", "Ảnh không hợp lệ", (value) => {          
          if (!value) return true;
          return ["image/jpeg", "image/png", "image/jpg"].includes(
            value[0]?.type
          );
        })
        .test("fileSize", "Kích thước ảnh tối đa là 3 MB", (value) => {
          if (!value) return true;
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
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      parent_id: 0,
    },
  });

  useEffect(() => {
    if (dataCreate) {
      toast.success("Tạo mới lãnh đạo cục thành công!", {
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

  const onSubmit = (data) => {
    // Get the file object from the data object
    let file = data.feature_image[0];
    if (data.feature_image[0]) {
      const newNameImage = convertValidNameImage(data.feature_image[0].name);
      file = createFile(data.feature_image, newNameImage, {
        type: data.feature_image[0].type,
      });
    }
    const full_name = data.full_name;
    const position_vi = data.position_vi;
    const position_en = data.position_en;
    const parent_id = data.parent_id;
    const email = data.email;
    const phone = data.phone;
    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    formData.append("feature_image", file);
    formData.append("full_name", full_name);
    formData.append("position_vi", position_vi);
    formData.append("position_en", position_en);
    formData.append("parent_id", parent_id);
    formData.append("email", email);
    formData.append("phone", phone);
    mutate(formData);
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
              placeholder="Select parent id"
              options={parentDepartments}
              value={value}
              className={`${errors.parentDepartmentSelected && "is-invalid"}`}
              onChange={(val) => {
                onChange(
                  parentDepartments?.find(
                    (parentDepartment) => parentDepartment.id === val.id
                  )
                );
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
      <div className="row mt-3">
        <div className="form-group mc-3 col-md-6">
          <label className="form-label">
            {t("common.feature_image")}{" "}
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
          type="submit"
          className="btn-info font-medium mt-3"
          disabled={isSubmitSuccessful || isSubmitting}
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

export default CreateDepartment;
