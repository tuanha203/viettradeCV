import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import Button from "../../components/common/Button";
import {
  useUpdateStructure,
  useDetailStructure,
  useListStructureNoTable,
} from "../../hooks/structure";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";
import { useQueryClient } from "@tanstack/react-query";
import { STRUCTURE_LIST_KEY } from "../../constants";

const UpdateStructure = ({ structureId }) => {
  const { t } = useTranslation("common");
  const { data: { data: parentStructures } = {} } = useListStructureNoTable();
  const { data: { data: structure } = {}, isLoading } =
    useDetailStructure(structureId);

  const [title, setTitle] = useState("Cập nhật đơn vị");
  useEffect(() => {
    if (structure?.level === 1) {
      setTitle("Cập nhật đơn vị");
    }
    if (structure?.level === 2) {
      setTitle("Cập nhật phòng ban");
    }
    if (structure?.level === 3) {
      setTitle("Cập nhật chức vụ");
    }
  }, [structure]);

  useEffect(() => {
    parentStructures?.map((parentStructure) => {
      parentStructure.value = parentStructure.id;
      parentStructure.label = parentStructure.full_name_vi;
      parentStructure.level = parentStructure.level;
      return parentStructure;
    });
  }, [parentStructures]);

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-[20px] font-semibold">{title}</h2>
          <div className="mt-4">
            <FormUpdate
              parentStructures={parentStructures}
              structure={structure}
              t={t}
            />
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

const FormUpdate = ({ parentStructures, structure, t }) => {
  if (!structure) return;
  const {
    mutate,
    data: dataUpdate,
    isSuccess,
    isLoading,
  } = useUpdateStructure();

  const router = useRouter();

  const queryClient = useQueryClient();
  const schema = yup.object().shape(
    {
      full_name_vi: yup
        .string()
        .trim()
        .required("Tên tiếng việt là bắt buộc")
        .max(191, "Trường tên không dài quá 191 kí tự"),
      full_name_en: yup
        .string()
        .trim()
        .required("Tên tiếng anh là bắt buộc")
        .max(191, "Trường tên không dài quá 191 kí tự"),
      position_vi: yup.string().trim().nullable().notRequired(),
      position_en: yup.string().trim().nullable().notRequired(),
      phone: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .when("phone", {
          is: (value) => value?.length,
          then: (rule) => rule.max(25, "Số điện thoại tối đa 25 số"),
        }),
      email: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .when("email", {
          is: (value) => value?.length,
          then: (rule) =>
            rule.matches(
              /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              "Email không đúng định dạng"
            ),
        }),
      address: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .max(191, "Trường địa chỉ không dài quá 191 kí tự"),
    },
    [
      ["full_name_en", "full_name_en"],
      ["phone", "phone"],
      ["email", "email"],
    ]
  );

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
  });

  useEffect(() => {
    if (dataUpdate) {
      let msgSuccess = "";
      if (dataUpdate.data.structure.level == 1) {
        msgSuccess = "Cập nhật đơn vị thành công!";
      }
      if (dataUpdate.data.structure.level == 2) {
        msgSuccess = "Cập nhật phòng ban thành công!";
      }
      if (dataUpdate.data.structure.level == 3) {
        msgSuccess = "Cập nhật chức vụ thành công!";
      }
      toast.success(msgSuccess, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        if (dataUpdate.data.structure.level == 1) {
          router.push("/structure");
        }
        if (
          dataUpdate.data.structure.level == 2 ||
          dataUpdate.data.structure.level == 3
        ) {
          router.push(
            `/structure/sub-structure?id=${dataUpdate.data.structure.parent_id}`
          );
        }
      }, 1000);
    }
  }, [isSuccess]);

  useEffect(() => {
    queryClient.invalidateQueries(STRUCTURE_LIST_KEY);
    if (structure) {
      reset({
        ...structure,
        parentStructureSelected: parentStructures?.find(
          (parentStructure) => parentStructure.id === structure?.parent_id
        ),
      });
    }
  }, [structure]);

  const onSubmit = (data) => {
    // Get the file object from the data object
    const id = structure?.id;
    const full_name_vi = data.full_name_vi;
    const full_name_en = data.full_name_en;
    const position_vi = data.position_vi;
    const position_en = data.position_en;
    const parent_id = data.parent_id;
    const phone = data.phone;
    const email = data.email;
    const fax = data.fax;
    const website = data.website;
    const parent_level = data.parent_level;
    let level = structure?.level;
    if (parent_level == 1) {
      level = 2;
    } else if (parent_level == 2) {
      level = 3;
    }
    const address = data.address;
    let formData = {
      id: id,
      full_name_vi: full_name_vi,
      full_name_en: full_name_en,
      position_vi: position_vi,
      position_en: position_en,
      parent_id: parent_id,
      email: email,
      phone: phone,
      fax: fax,
      website: website,
      level: level,
      address: address,
    };

    mutate(formData, id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">
          Tên tiếng việt <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.full_name_vi && "is-invalid"}`}
          {...register("full_name_vi", { required: true })}
        />
        {errors.full_name_vi && (
          <p className="text-danger">{errors.full_name_vi.message}</p>
        )}
        <label className="form-label mt-3">
          Tên tiếng anh <span className="text-danger text-[18px]">*</span>
        </label>
        <input
          className={`form-control ${errors.full_name_en && "is-invalid"}`}
          {...register("full_name_en", { required: true })}
        />
        {errors.full_name_en && (
          <p className="text-danger">{errors.full_name_en.message}</p>
        )}
      </div>

      <div className="form-group mt-3">
        <label className="form-label">Chức vụ tiếng việt</label>
        <input
          className={`form-control ${errors.position_vi && "is-invalid"}`}
          {...register("position_vi")}
        />
        {errors.position_vi && (
          <p className="text-danger">{errors.position_vi.message}</p>
        )}
      </div>

      <div className="form-group mt-3">
        <label className="form-label">Chức vụ tiếng anh</label>
        <input
          className={`form-control ${errors.position_en && "is-invalid"}`}
          {...register("position_en")}
        />
        {errors.position_en && (
          <p className="text-danger">{errors.position_en.message}</p>
        )}
      </div>
      <div className="form-group mt-3">
        <label className="form-label">Fax</label>
        <input
          className={`form-control ${errors.fax && "is-invalid"}`}
          {...register("fax")}
        />
        {errors.fax && <p className="text-danger">{errors.fax.message}</p>}
      </div>
      <div className="form-group mt-3">
        <label className="form-label">Website</label>
        <input
          className={`form-control ${errors.website && "is-invalid"}`}
          {...register("website")}
        />
        {errors.website && (
          <p className="text-danger">{errors.website.message}</p>
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
        <label className="form-label">Email</label>
        <input
          className={`form-control ${errors.email && "is-invalid"}`}
          {...register("email")}
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>
      {structure?.level === 2 ? (
        <div className="form-group mt-3">
          <label className="form-label">Địa chỉ</label>
          <input
            className={`form-control ${errors.address && "is-invalid"}`}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-danger">{errors.address.message}</p>
          )}
        </div>
      ) : (
        <div></div>
      )}
      {structure.level !== 1 ? (
        <div className="mt-3">
          <div className="card-title">
            <h4 className="mb-0">Phòng ban, đơn vị</h4>
          </div>
          <Controller
            control={control}
            name="parentStructureSelected"
            render={({ field: { onChange, value, ref } }) => (
              <Select
                inputRef={ref}
                options={parentStructures?.filter(
                  (struc) => struc.id !== structure.id
                )}
                value={value}
                onChange={(val) => {
                  onChange(val);
                  setValue("parent_id", val.id);
                  setValue("parent_level", val.level);
                }}
              />
            )}
          />
        </div>
      ) : (
        <div></div>
      )}

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

export default UpdateStructure;
