/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiEdit, FiEye, FiEyeOff } from "react-icons/fi";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import * as crypto from "crypto";
import Select from "react-select";
import { isEqual } from "lodash";

import Button from "~/components/common/Button";
import Loading from "~/components/common/Loading";
import { useDetailAdmin, useUpdateAdmin } from "~/hooks/admin";
import { useTranslation } from "react-i18next";
import { roles } from "~/constants";
import noImage from "../../public/images/no-avatar.png";

const Profile = () => {
    const adminId = localStorage.getItem('id');
  const { data: { data: admin } = {}, isLoading } = useDetailAdmin(adminId);
  const [isLoadingg, setIsLoading] = useState(false);
  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">
            Cập nhật thông tin cá nhân
          </p>
          <div className="mt-4">
            {isLoadingg ? <Loading /> : <FormUpdate admin={admin} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const FormUpdate = ({ admin }) => {
  if (!admin) return;
  const router = useRouter();
  const { t } = useTranslation();
  const [isDisable, setIsDisable] = useState(false);

  const {
    mutate,
    isLoading,
    isSuccess,
    data: dataUpdate,
    error,
  } = useUpdateAdmin(setIsDisable);

  const [image, setImage] = useState({ preview: "", raw: "" });
  const [showPass, setShowPass] = useState(false);
  const [editPass, setEditPass] = useState(false);
  const [checkStatus, setCheckStatus] = useState(1);

  const schema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required("Tên người dùng  là bắt buộc")
      .matches(
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲÝỴÝỶỸửữựỳýỵỷỹ\s|_]+$/,
        "Tên không đúng định dạng"
      )
      .max(191, "Trường tên không dài quá 191 kí tự"),
    role: yup.string().trim().required("Vai trò người dùng là bắt buộc"),
    email: yup
      .string()
      .trim()
      .required("Email là bắt buộc")
      .matches(
        /^([a-z0-9_+.-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/,
        "Email không đúng định dạng"
      )
      .max(191, "Trường email không dài quá 191 kí tự"),
    roleSelected: yup.object().required("Trường vai trò không được bỏ trống"),
    feature_image: yup
      .mixed()
      .notRequired()
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
    password: yup
      .string()
      .trim()
      .test("input-cancel", "Mật khẩu có ít nhất 8 kí tự", (value) => {
        if (value?.length > 0 && value?.length < 8) {
          return false;
        }
        return true;
      })
      .nullable()
      .test("input-cancel", "Mật khẩu có tối đa 20 kí tự", (value) => {
        if (value?.length > 20) {
          return false;
        }
        return true;
      })
      .nullable(),
  });

  useEffect(() => {
    if (dataUpdate) {
      if (!toast.isActive("update")) {
        toast.success("Cập nhật quản trị viên thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    }
  }, [isSuccess]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      email: "",
      password: null,
    },
  });

  useEffect(() => {
    if (admin) {
      reset({
        ...admin,
        password: null,
        roleSelected: roles.find((role) => role.value === admin.role),
      });
    }
  }, [admin]);

  useEffect(() => {
    if (admin?.feature_image) {
      setImage({
        preview: admin?.feature_image,
      });
      setCheckStatus(admin?.status);
    }
  }, [admin]);

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

  const onSubmit = (values) => {
    setIsDisable(true);
    const file = values.feature_image ? values.feature_image[0] : undefined;
    const name = values.name;
    const email = values.email;
    const password = values.password;
    const role = values.role;
    const id = values.id;

    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    formData.append("feature_image", file);
    formData.append("name", name);
    formData.append("email", email);
    if (password) {
      const hashedPassword = crypto
        .createHmac("sha256", admin.salt)
        .update(password)
        .digest("hex");
      if (admin.password !== hashedPassword) {
        formData.append("password", password);
      }
    }
    formData.append("role", role);
    formData.append("id", id);
    formData.append("status", checkStatus);
    mutate({ formData, id });
    localStorage.setItem('name',name);
    localStorage.setItem('email',email);
  };

  return (
    <div>
      <form name="admin" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">
                Tên <span className="text-danger text-[18px]">*</span>
              </label>
              <input
                className={`form-control ${errors.name && "is-invalid"}`}
                placeholder="Tên"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-danger">{errors.name.message}</p>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label">
                Email <span className="text-danger text-[18px]">*</span>
              </label>
              <input
                className={`form-control ${(error?.response.data.errors.includes("email is exist") ||
                  errors.email) &&
                  "is-invalid"
                  }`}
                placeholder="Email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
              {error?.response.data.errors.includes("email is exist") && (
                <p className="text-danger">Email đã tồn tại.</p>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label d-block">
                Mật khẩu <span className="text-danger text-[18px]">*</span>
              </label>
              <div className="input-group relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Mật khẩu"
                  disabled={!editPass}
                  onClick={() => setEditPass(true)}
                  className={`form-control ${errors.password && "is-invalid"}`}
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={!editPass ? true : false}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FiEye /> : <FiEyeOff />}
                </button>
                <button
                  type="button"
                  className="btn btn-primary bg-primary"
                  onClick={() => setEditPass(!editPass)}
                >
                  <FiEdit onClick={() => setEditPass(!editPass)} />
                </button>
              </div>
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            {/* <div className="form-group mb-3">
              <label className="form-label">
                {t("user.role")}{" "}
                <span className="text-danger text-[18px]">*</span>
              </label>
              <Controller
                control={control}
                name="roleSelected"
                render={({ field: { value, onChange, ref } }) => (
                  <Select
                    options={roles}
                    value={value}
                    placeholder="Lựa chọn"
                    className={`${errors.roleSelected && "is-invalid"}`}
                    onChange={(val) => {
                      onChange(val);
                      setValue("role", val.value);
                    }}
                  />
                )}
              />
              {errors.roleSelected && (
                <p className="text-danger">{errors.roleSelected.message}</p>
              )}
            </div> */}
          </div>
          <div className="col-md-6">
            <div className="form-group mc-3 text-center">
              <label>Ảnh</label>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control opacity-0"
                  id="inputGroupFile01"
                  {...register("feature_image")}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="wp-preview-image relative -top-[48px]">
                <label htmlFor="inputGroupFile01">
                  <img
                    src={image.preview ? image.preview : noImage.src}
                    alt=""
                    style={{
                      borderRadius: "50%",
                      width: "250px",
                      height: "250px",
                    }}
                    className="cursor-pointer"
                  />
                </label>
              </div>
              {errors.feature_image && (
                <p className="col-md-12 text-center text-danger">
                  {errors.feature_image.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={`form-group mb-3 ${admin.id == localStorage.getItem('id') ? 'hidden' : 'flex'} items-center`}>
          <label className="mr-5">
            Trạng thái <span className="text-danger text-[18px]">*</span>{" "}
          </label>
          <div className="mr-5 form-check">
            <input
              className="form-check-input"
              type="radio"
              onChange={() => setCheckStatus(1)}
              checked={checkStatus === 1 ? true : false}
            />
            <label className="form-check-label" style={{ fontSize: "14px" }}>
              Kích hoạt
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              onChange={() => setCheckStatus(2)}
              checked={checkStatus === 2 ? true : false}
            />
            <label className="form-check-label" style={{ fontSize: "14px" }}>
              Chưa kích hoạt
            </label>
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
          <Button type="submit" className="!bg-blue mt-3" disabled={isDisable}>
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
    </div>
  );
};

export default Profile;
