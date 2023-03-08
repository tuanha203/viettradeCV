import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../components/common/Button";
import { useListMenu, useCreateMenu } from "../../hooks/menu";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";

const CreateMenu = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h4 className="text-[20px] font-semibold">Thêm mới menu</h4>
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
  const { data: { data: parentMenu } = {} } = useListMenu();

  parentMenu?.map((parentMenu) => {
    parentMenu.value = parentMenu.id;
    parentMenu.label = parentMenu.title_vi;
    return parentMenu;
  });

  const { mutate, data: dataCreate, isSuccess, isLoading } = useCreateMenu();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const schema = yup.object().shape({
    title_vi: yup
      .string()
      .trim()
      .required("Tên menu là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    title_en: yup
      .string()
      .trim()
      .required("Tên menu tiếng anh là bắt buộc")
      .max(191, "Trường tên không dài quá 191 kí tự"),
    link: yup.string().trim().max(191, "Trường link không dài quá 191 kí tự"),
  });

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
      title_vi: "",
      title_en: "",
      link: "",
      parent_id: 0,
      display: 0,
    },
  });

  useEffect(() => {
    if (dataCreate) {
      toast.success("Tạo mới menu thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/menu");
      }, 1000);
    }
  }, [isSuccess]);

  const onSubmit = (data) => {
    // Get the file object from the data object
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const link = data.link;
    const display = 0;
    const parent_id = data.parent_id || 0;

    let menuData = {
      title_vi: title_vi,
      title_en: title_en,
      link: link,
      display: display,
      parent_id: parent_id,
    };

    mutate(menuData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">
          Tiêu đề menu tiếng việt{" "}
          <span className="text-danger text-[18px]">*</span>
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
          Tiêu đề menu tiếng anh
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

      <div className="mt-3">
        <div className="card-title">
          <h4 className="mb-0">Menu chính</h4>
        </div>
        <Controller
          control={control}
          name="parentMenuSelected"
          render={({ field: { onChange, value, ref } }) => (
            <Select
              placeholder="Lựa chọn"
              options={parentMenu}
              value={value}
              className={`${errors.parentMenuSelected && "is-invalid"}`}
              onChange={(val) => {
                onChange(
                  parentMenu?.find((parentMenu) => parentMenu.id === val.id)
                );
                setValue("parent_id", val.id);
              }}
            />
          )}
        />
        {errors.parentStructureSelected && (
          <p className="text-danger">{errors.parentMenuSelected.message}</p>
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

export default CreateMenu;
