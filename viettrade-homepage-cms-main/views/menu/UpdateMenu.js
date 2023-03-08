import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import Button from "../../components/common/Button";
import { useUpdateMenu, useDetailMenu, useListMenu } from "../../hooks/menu";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";

const UpdateMenu = ({ menuId }) => {
  const { t } = useTranslation("common");
  const { data: { data: parentMenu } = {} } = useListMenu();
  const { data: { data: menu } = {} } = useDetailMenu(menuId);

  parentMenu?.map((parentMenu) => {
    parentMenu.value = parentMenu.id;
    parentMenu.label = parentMenu.title_vi;
    // parentMenu.subLength = parentMenu.Menus.length + 1;
    return parentMenu;
  });

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-[20px] font-semibold">Cập nhật menu</h2>
          <div className="mt-4">
            <FormUpdate parentMenu={parentMenu} menu={menu} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormUpdate = ({ parentMenu, menu, t }) => {
  if (!menu) return;
  const { mutate, data: dataUpdate, isSuccess, isLoading } = useUpdateMenu();

  const router = useRouter();

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
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title_vi: "",
      title_en: "",
      link: "",
      display: 0,
      parent_id: 0,
    },
  });

  useEffect(() => {
    if (dataUpdate) {
      toast.success("Cập nhật menu thành công!", {
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

  useEffect(() => {
    if (menu) {
      reset({
        ...menu,
        parentMenuSelected: parentMenu?.find(
          (parentMenuSelected) => parentMenuSelected.id === menu?.parent_id
        ),
      });
    }
  }, [menu]);

  const onSubmit = (data) => {
    const id = menu?.id;
    const title_vi = data.title_vi;
    const title_en = data.title_en;
    const parent_id = data.parent_id || 0;
    const link = data.link;
    // const display = data.display;
    let menuData = {
      id: id,
      title_vi: title_vi,
      title_en: title_en,
      link: link,
      parent_id: parent_id,
      // display: display,
    };
    mutate(menuData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">
          Tiêu đề tiếng việt
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

      <div className="form-group mt-3">
        <label className="form-label">
          Tiêu đề tiếng anh
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
      <div className="form-group mt-3">
        <label className="form-label">Đường dẫn</label>
        <input
          className={`form-control ${errors.link && "is-invalid"}`}
          {...register("link")}
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
              disabled={true}
              inputRef={ref}
              options={parentMenu.filter((men) => men.id !== menu.id)}
              value={value}
              onChange={(val) => {
                onChange(val);
                setValue("parent_id", val.id);
                // setValue("display", val.subLength);
              }}
            />
          )}
        />
        {errors.parentMenuUpdateMenuSelected && (
          <p className="text-danger">
            {errors.parentMenuUpdateMenuSelected.message}
          </p>
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

export default UpdateMenu;
