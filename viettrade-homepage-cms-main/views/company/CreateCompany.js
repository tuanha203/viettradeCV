import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "next-i18next";
import Loading from "~/components/common/Loading";
import * as yup from "yup";

import Button from "../../components/common/Button";
import { useCreateCompany } from "~/hooks/company";
import { toast } from "react-toastify";
import Image from "next/image";
import noImage from "../../public/images/no-image.png";
import convertValidNameImage from "~/utils/image/convertValidNameImage";
import { createFile } from "~/utils/file";

const CreateCompany = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">
            Thêm mới doanh nghiệp
          </p>
          <div className="mt-4 flex">
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
  const { t } = useTranslation("common");
  const { mutate, data: dataCreate, isSuccess, isLoading } = useCreateCompany();
  const [isDisable, setIsDisable] = useState(false);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const onChange = (tab) => {
    setTab(tab);
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

 


  useEffect(() => {
    if (dataCreate) {
      toast.success("Tạo mới doanh nghiệp thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/company");
      }, 1000);
    }
  }, [isSuccess]);

  const schema = yup.object().shape({
    name_vi: yup
      .string()
      .trim()
      .trim()
      .required("Tên doanh nghiệp là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    name_en: yup
      .string()
      .trim()
      .required("Tên tiếng anh doanh nghiệp là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    phone: yup
      .string()
      .trim()
      .required("Số điện thoại là bắt buộc")
      .matches(/^[0-9_@.( )/#&+-]*$/, "Số điện thoại không đúng định dạng")
      .max(25, "Số điện thoại tối đa 25 số"),
    address: yup.string().trim().required("Địa chỉ là bắt buộc"),
    feature_image: yup
      .mixed()
      .required("Ảnh là bắt buộc")
      .test("file-cancel", "Ảnh là bắt buộc", (value) => {
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
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (Object.keys(errors).findIndex(item => item.includes("_vi")) !== -1 || Object.keys(errors).findIndex(item => !item.includes("_vi") && !item.includes("_en")) !== -1 ) {
      setTab(1);
    } else if (Object.keys(errors).findIndex(item => item.includes("_en")) !== -1) {
      setTab(2);
    }
  }, [errors])

  const onSubmit = async (data) => {
    setIsDisable(true);
    let file = data.feature_image[0];
    if (data.feature_image[0]) {
      const newNameImage = convertValidNameImage(data.feature_image[0].name);
      file = createFile(data.feature_image, newNameImage, {
        type: data.feature_image[0].type,
      });
    }
    const name_vi = data.name_vi;
    const name_en = data.name_en;
    const address = data.address;
    const link = data.link;
    const phone = data.phone;
    const connective = data.connective ? 1 : 0;
    const formData = new FormData();

    formData.append("feature_image", file);
    formData.append("name_vi", name_vi);
    formData.append("name_en", name_en);
    formData.append("description_en", "");
    formData.append("description_vi", "");
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("connective", connective);
    formData.append("link", link);
    mutate(formData);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p> {isSubmitting}</p>
      <div className="row">
        <div className="col-6">
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
                          {t("company.name")}{" "}
                          <span className="text-danger text-[18px]">*</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.name_vi && "is-invalid"
                          }`}
                          {...register("name_vi", { required: true })}
                        />
                        {errors.name_vi && (
                          <p className="text-danger">
                            {errors.name_vi.message}
                          </p>
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
                          {t("company.name")}{" "}
                          <span className="text-danger text-[18px]">*</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.name_en && "is-invalid"
                          }`}
                          {...register("name_en", { required: true })}
                        />
                        {errors.name_en && (
                          <p className="text-danger">
                            {errors.name_en.message}
                          </p>
                        )}
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </div>
          <div className="row">
            <div className="form-group mb-3">
              <label className="form-label">{t("company.link")}</label>
              <input
                className={`form-control ${errors.link && "is-invalid"}`}
                {...register("link", { required: true })}
              />
              {errors.link && (
                <p className="text-danger">{errors.link.message}</p>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label">
                {t("company.phone")}{" "}
                <span className="text-danger text-[18px]">*</span>
              </label>
              <input
                className={`form-control ${errors.phone && "is-invalid"}`}
                {...register("phone", { required: true })}
              />
              {errors.phone && (
                <p className="text-danger">{errors.phone.message}</p>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label">
                {t("company.address")}{" "}
                <span className="text-danger text-[18px]">*</span>
              </label>
              <input
                className={`form-control ${errors.address && "is-invalid"}`}
                {...register("address", { required: true })}
              />
              {errors.address && (
                <p className="text-danger">{errors.address.message}</p>
              )}
            </div>
            <div className="from-group mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="connective"
                  {...register("connective")}
                />
                <label className="form-check-label" htmlFor="connective">
                  {t("company.connective")}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 flex flex-col pt-[65px]">
          <label className="text-center">
            Ảnh <span className="text-danger text-[18px]">*</span>
          </label>
          <div className="wp-preview-image flex items-center">
            <label htmlFor="feature_image">
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
              {...register("feature_image", { required: true })}
              onChange={handleImageChange}
              style={{ width: 0, height: 0, opacity: 0 }}
            />
          </div>
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
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => router.back()}
          type="button"
          className="!bg-zinc-600 mt-3 mr-3"
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isDisable} className="!bg-blue mt-3">
          Lưu
        </Button>
      </div>
    </form>
  );
};

export default CreateCompany;
