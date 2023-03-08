import React, { useState } from "react";
import Button from "../../components/common/Button";
import { useCreateUser } from "../../hooks/user";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Loading from "~/components/common/Loading";

const User = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">Thêm mới người dùng</p>
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
  const [isShow, setIsShow] = useState(false);
  const [checkStatus, setCheckStatus] = useState(1);

  const {
    mutate,
    isSuccess,
    isLoading,
    error,
    data: dataCreate,
  } = useCreateUser();
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
      .required("Mật khẩu là bắt buộc")
      .min(8, "Mật khẩu có ít nhất 8 kí tự")
      .max(20, "Mật khẩu không được vượt quá 20 kí tự"),
    phone: yup
      .string()
      .trim()
      .required("Số điện thoại là bắt buộc")
      .matches(/^[0-9_@.( )/#&+-]*$/, "Số điện thoại không đúng định dạng"),
  });

  useEffect(() => {
    if (dataCreate) {
      toast.success("Tạo mới người dùng thành công!", {
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
      }, 500);
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });


  return (
    <div>
      <form
        name="user"
        onSubmit={handleSubmit((values) =>
          mutate({ ...values, status: checkStatus })
        )}
      >
        <div className="form-group mb-3">
          <label className="form-label">
            Tên người dùng <span className="text-danger text-[18px]">*</span>
          </label>
          <input
            className={`form-control ${errors.name && "is-invalid"}`}
            placeholder="Tên người dùng"
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
            placeholder="Số điện thoại"
            {...register("phone", { required: true })}
          />
          {errors.phone && (
            <p className="text-danger">{errors.phone.message}</p>
          )}
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
          <label className="form-label">
            Mật khẩu <span className="text-danger text-[18px]">*</span>
          </label>
          <div className="input-group">
            <input
              type={isShow ? "text" : "password"}
              placeholder="Mật khẩu"
              className={`form-control ${errors.password && "is-invalid"}`}
              {...register("password", { required: true })}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setIsShow(!isShow)}
            >
              {isShow ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group mb-3 flex items-center">
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
    </div>
  );
};

export default User;
