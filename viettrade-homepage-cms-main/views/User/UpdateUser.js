import React, { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiEyeOff, FiEdit, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loading from "../../components/common/Loading";

import { useDetailUser, useUpdateUser } from "../../hooks/user";

const UpdateUser = ({ userId }) => {
  const { data: { data: user } = {}, isLoading } = useDetailUser(userId);
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
          <p className="text-[20px] font-semibold col-6">Cập nhật người dùng</p>
          <div className="mt-4">
            {isLoadingg ? <Loading /> : <FormUpdate user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const FormUpdate = ({ user }) => {
  if (!user) return;
  const router = useRouter();
  const {
    mutate,
    isLoading,
    isSuccess,
    data: dataUpdate,
    error,
  } = useUpdateUser();

  const [isDisable, setIsDisable] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [checkStatus, setCheckStatus] = useState(1);

  const schema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required("Tên người dùng  là bắt buộc")
      .matches(
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_]+$/,
        "Tên không đúng định dạng"
      )
      .max(191, "Trường tên không dài quá 191 kí tự"),
    email: yup
      .string()
      .trim()
      .required("Email là bắt buộc")
      .matches(
        /^([a-z0-9_+.-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/,
        "Email không đúng định dạng"
      )
      .max(191, "Trường email không dài quá 191 kí tự"),
    password: yup
      .string()
      .trim()
      .test("input-cancel", "Mật khẩu có ít nhất 8 kí tự", (value) => {
        if (value?.length > 0 && value?.length < 8) {
          return false;
        }
        return true;
      })
      .max(20, "Mật khẩu không được vượt quá 20 kí tự")
      .nullable(),
    phone: yup
      .string()
      .trim()
      .required("Số điện thoại là bắt buộc")
      .matches(/^[0-9_@.( )/#&+-]*$/, "Số điện thoại không đúng định dạng"),
  });

  useEffect(() => {
    if (dataUpdate) {
      toast.success("Cập nhật người dùng thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/user");
      }, 1000);
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
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
    if (user) {
      reset({
        ...user,
        password: null,
      });
      setCheckStatus(user.status);
    }
  }, user);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutate({ ...data, status: checkStatus });
      })}
    >
      <div className="form-group mb-3">
        <label className="form-label">
          Tên người dùng <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.name && "is-invalid"}`}
          {...register("name", { required: true })}
        />
        {errors.name && <p className="text-danger">{errors.name.message}</p>}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">
          Số điện thoại <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.phone && "is-invalid"}`}
          {...register("phone", { required: true })}
        />
        {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">
          Email <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${
            (error?.response.data.errors.includes("email is exist") ||
              errors.email) &&
            "is-invalid"
          }`}
          {...register("email", { required: true })}
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
        {error?.response.data.errors.includes("email is exist") && (
          <p className="text-danger">Email đã tồn tại.</p>
        )}
      </div>
      <div className="form-group mb-3">
        <div className="form-group mb-3">
          <label className="form-label">
            Mật khẩu <span className="text-danger text-[18px]">*</span>
          </label>
          <div className="input-group">
            <input
              type={isShow ? "text" : "password"}
              className={`form-control ${errors.password && "is-invalid"}`}
              {...register("password", { required: false })}
              disabled={isDisable ? true : false}
            />

            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={isDisable ? true : false}
              onClick={() => setIsShow(!isShow)}
            >
              {isShow ? <FiEye /> : <FiEyeOff />}
            </button>
            <button
              type="button"
              className="btn btn-primary bg-primary"
              onClick={() => setIsDisable(!isDisable)}
            >
              <FiEdit />
            </button>
          </div>
        </div>
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>

      <div className="form-group mb-3 flex items-center">
        <label className="mr-5">
          Trạng thái <span className="text-danger text-[18px]">*</span>
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
        <Button
          type="submit"
          className="!bg-blue mt-3"
          disabled={(isSubmitSuccessful || isSubmitting) && isSuccess}
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

export default UpdateUser;
