import { Form, Input, Tabs } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";

import Button from "../../components/common/Button";
import FormInput from "../../components/Form/FormInput";
import { useDetailDigital, useUpdateDigital } from "../../hooks/digital";
import { Router, useRouter } from "next/router";
import Loading from "~/components/common/Loading";
import noImage from "../../public/images/no-image.png";
import Image from "next/image";

const UpdateDigital = ({ digitalId }) => {
  const { data: { data: digital } = {}, isLoading } =
    useDetailDigital(digitalId);

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h4 className="text-[18px] font-semibold">Cập nhật biểu ngữ</h4>
          <div className="mt-4">
            <FormUpdate digital={digital} />
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

const FormUpdate = React.memo(({ digital }) => {
  if (!digital) return;

  const [image, setImage] = useState({ preview: "" });
  const [icon, setIcon] = useState({ preview: "" });
  const { mutate, data: dataUpdate, isLoading, isSuccess } = useUpdateDigital();
  const router = useRouter();
  const schema = yup.object().shape({
    title_vi: yup
      .string()
      .trim()
      .required("Tên biểu ngữ tiếng việt là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    title_en: yup
      .string()
      .trim()
      .required("Tên biểu ngữ tiếng anh là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    link: yup.string().trim().max(191, "Trường link không dài quá 191 kí tự"),
    feature_image: yup
      .mixed()
      .notRequired()
      .nullable()
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
    feature_icon: yup
      .mixed()
      .notRequired()
      .nullable()
      .test("file-type", "Icon không hợp lệ", (value) => {
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
      .test("fileSize", "Kích thước icon tối đa là 3 MB", (value) => {
        if (typeof value === "string" || !value) {
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
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: null,
      title: "",
      link: "",
    },
  });
  useEffect(() => {
    if (dataUpdate) {
      toast.success("Cập nhật biểu ngữ thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/digital");
      }, 1000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (digital) {
      reset({ ...digital });
    }
  }, [digital]);

  useEffect(() => {
    if (digital?.feature_image) {
      setImage({
        preview: digital?.feature_image,
      });
    }
    if (digital?.feature_icon) {
      setIcon({
        preview: digital?.feature_icon,
      });
    }
  }, []);

  const onSubmit = (data) => {
    const id = data.id;
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const link = data.link;
    const fileImage = data.feature_image?.length
      ? data.feature_image[0]
      : undefined;

    const fileIcon = data.feature_icon?.length
      ? data.feature_icon[0]
      : undefined;

    const formData = new FormData();

    formData.append("feature_image", fileImage);
    formData.append("feature_icon", fileIcon);
    formData.append("id", id);
    formData.append("title_vi", title_vi);
    formData.append("title_en", title_en);
    formData.append("link", link);
    mutate({ formData, id });
  };

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

  const handleIconChange = (e) => {
    if (e.target.files.length) {
      setIcon({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    } else {
      setIcon({
        preview: "",
        raw: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group mb-3">
        <label className="form-label">
          Tên biểu ngữ tiếng việt{" "}
          <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.title_vi && "is-invalid"}`}
          {...register("title_vi", { required: true })}
        />
        {errors.title_vi && (
          <p className="text-danger">{errors.title_vi.message}</p>
        )}
        <label className="form-label mt-3">
          Tên biểu ngữ tiếng anh{" "}
          <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.title_en && "is-invalid"}`}
          {...register("title_en", { required: true })}
        />
        {errors.title_en && (
          <p className="text-danger">{errors.title_en.message}</p>
        )}
      </div>

      <div className="form-group mb-3">
        <label className="form-label">Đường dẫn</label>
        <input
          className={`form-control ${errors.link && "is-invalid"}`}
          {...register("link", { required: false })}
        />
        {errors.link && <p className="text-danger">{errors.link.message}</p>}
      </div>
      <div className="row mt-3">
        <div className="form-group mc-3 col-md-6">
          <label className="form-label">Ảnh</label>
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
            {image.preview ? (
              <img
                className="overflow-hidden img-table"
                src={image.preview}
                alt=""
                width="300"
              />
            ) : (
              <Image src={noImage} className="object-cover" alt="noImageList" />
            )}
          </div>
        </div>
      </div>
      <div className="row mt-6">
        <div className="form-group mc-3 col-md-6">
          <label className="form-label">Icon</label>
          <div className="input-group mb-3">
            <input
              type="file"
              className="form-control"
              id="inputGroupFile02"
              {...register("feature_icon")}
              onChange={handleIconChange}
            />
          </div>
          {errors.feature_icon && (
            <p className="text-danger">
              <span>{errors.feature_icon.message}</span>
            </p>
          )}
        </div>
        <div className="col-6">
          <div className="wp-preview-image">
            {icon.preview ? (
              <img
                className="overflow-hidden img-table bg-slate-400"
                src={icon.preview}
                alt=""
                width="300"
              />
            ) : (
              <Image src={noImage} className="object-cover" alt="noImageList" />
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

export default UpdateDigital;
