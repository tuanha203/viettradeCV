import { Form, Input, Tabs } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";

import Button from "../../components/common/Button";
import FormInput from "../../components/Form/FormInput";
import { useDetailBanner, useUpdateBanner } from "../../hooks/banner";
import { Router, useRouter } from "next/router";
import Loading from "~/components/common/Loading";
import noImage from "../../public/images/no-image.png";

const UpdateBanner = ({ bannerId }) => {
  const { data: { data: banner } = {}, isLoading } = useDetailBanner(bannerId);

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h4 className="text-[18px] font-semibold">Cập nhật banner</h4>
          <div className="mt-4">
            <FormUpdate banner={banner} />
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

const FormUpdate = React.memo(({ banner }) => {
  if (!banner) return;
  const [image, setImage] = useState({ preview: "" });
  const { mutate, data: dataUpdate, isLoading, isSuccess } = useUpdateBanner();
  const [pointEvent, setPointEvent] = useState('pointer-events-auto');
  const router = useRouter();
  const schema = yup.object().shape({
    title: yup
      .string()
      .trim()
      .required("Tên banner không được để trống")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    link: yup.string().trim().max(191, "Trường link không dài quá 191 kí tự"),
    feature_image: yup
      .mixed()
      .test("file-cancel", "Ảnh không được để trống", (value) => {
        if (value === banner?.feature_image) return true   
        if (value.length && typeof value !== 'string') {          
          setImage({
            preview: URL.createObjectURL(value[0]),
            raw: value[0],
          });
          return true;
        } else {
          setImage({
            preview: "",
            raw: "",
          });
          return false;
        } 
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
  });

  const {
    register,
    handleSubmit,
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
      toast.success("Cập nhật banner thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/banner");
      }, 1000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (banner) {
      reset({ ...banner });
    }
  }, [banner]);

  useEffect(() => {
    if (banner?.feature_image) {
      setImage({
        preview: banner?.feature_image,
      });
    }
  }, []);

  const onSubmit = (data) => {
    const id = data.id;
    const title = data.title;
    const link = data.link;
    const display = data.display;
    const file = data.feature_image[0];

    const formData = new FormData();

    // Add the file to the FormData object

    formData.append("feature_image", file);
    formData.append("id", id);
    formData.append("title", title);
    formData.append("link", link);
    formData.append("display", display);
    // Send the file to the API endpoint using the useMutation hook
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

  const handleClick = (event) => {
    event.currentTarget.disabled = true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group mb-3">
        <label className="form-label">
          Tên banner <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.title && "is-invalid"}`}
          {...register("title", { required: true })}
        />
        {errors.title && <p className="text-danger">{errors.title.message}</p>}
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
          <label className="form-label">
            Ảnh <span className="text-danger text-[18px]">*</span>
          </label>
          <div className="input-group mb-3">
            <input
              type="file"
              className="form-control"
              id="inputGroupFile01"
              {...register("feature_image")}
              // onChange={handleImageChange}
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
            <img
              src={image.preview ? image.preview : noImage.src}
              alt=""
              style={{width:231, height:231}}           
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

export default UpdateBanner;
