import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../components/common/Button";
import { useListBanner, useCreateBanner } from "../../hooks/banner";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";
import noImage from "../../public/images/no-image.png";
import Image from "next/image";
import convertValidNameImage from "~/utils/image/convertValidNameImage";
import { createFile } from "~/utils/file";

const CreateBanner = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h4 className="text-[20px] font-semibold">Thêm mới banner</h4>
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
  const [tab, setTab] = useState(1);
  const { data: { data: dataBanner } = {} } = useListBanner();
  const { mutate, data: dataCreate, isSuccess, isLoading } = useCreateBanner();
  const [image, setImage] = useState({ preview: "", raw: "" });
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
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      link: "",
      display: 0,
    },
  });

  useEffect(() => {
    if (dataCreate) {
      toast.success("Tạo mới banner thành công!", {
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

  const onSubmit = (data) => {
    if (isLoading) {
      return;
    }
    // Get the file object from the data object
    const title = data.title;
    const link = data.link;
    const display = dataBanner?.length + 1;

    const newNameImage = convertValidNameImage(data.feature_image[0].name);
    const fileImage = createFile(data.feature_image, newNameImage, { type: data.feature_image[0].type })

    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    formData.append("feature_image", fileImage);
    formData.append("title", title);
    formData.append("link", link);
    formData.append("display", display);
    // Send the file to the API endpoint using the useMutation hook
    mutate(formData);
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
              {...register("feature_image", { required: true })}
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

export default CreateBanner;
