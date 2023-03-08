import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import Button from "../../components/common/Button";
import {
  useCreateStructure,
  useListStructureNoTable,
  useDetailStructure,
} from "../../hooks/structure";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import Loading from "~/components/common/Loading";

const CreateStructure = ({ structureId }) => {
  const { data: { data: parentStructure } = {}, isLoading } =
    useDetailStructure(structureId);
  const [title, setTitle] = useState("Thêm mới đơn vị");
  useEffect(() => {
    if (parentStructure?.level === 1) {
      setTitle("Thêm mới phòng ban");
    }
    if (parentStructure?.level === 2) {
      setTitle("Thêm mới chức vụ");
    }
  }, []);

  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-[20px] font-semibold">{title}</h2>
          <div className="mt-4">
            <FormCreate parentStructure={parentStructure} />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormCreate = ({ parentStructure }) => {
  const { t } = useTranslation("common");
  const {
    mutate,
    data: dataCreate,
    isSuccess,
    isLoading,
  } = useCreateStructure();

  const router = useRouter();

  const schema = yup.object().shape(
    {
      full_name_vi: yup
        .string()
        .trim()
        .required("Tên tiếng việt là bắt buộc")
        .max(255, "Trường tên không dài quá 255 kí tự"),
      full_name_en: yup
        .string()
        .trim()
        .required("Tên tiếng anh là bắt buộc")
        .max(255, "Trường tên không dài quá 255 kí tự"),
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
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      full_name_vi: "",
      full_name_en: "",
      position_vi: "",
      position_en: "",
      phone: "",
      email: "",
      parent_id: 0,
    },
  });

  useEffect(() => {
    if (dataCreate) {
      let msgSuccess = "";
      if (dataCreate.data.structure.level == 1) {
        msgSuccess = "Tạo mới đơn vị thành công!";
      }
      if (dataCreate.data.structure.level == 2) {
        msgSuccess = "Tạo mới phòng ban thành công!";
      }
      if (dataCreate.data.structure.level == 3) {
        msgSuccess = "Tạo mới chức vụ thành công!";
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
        if (dataCreate.data.structure.level == 1) {
          router.push("/structure");
        }
        if (
          dataCreate.data.structure.level == 2 ||
          dataCreate.data.structure.level == 3
        ) {
          router.push(
            `/structure/sub-structure?id=${dataCreate.data.structure.parent_id}`
          );
        }
      }, 1000);
    }
  }, [isSuccess]);

  const onSubmit = (data) => {
    // Get the file object from the data object
    const full_name_vi = data.full_name_vi;
    const full_name_en = data.full_name_en;
    const position_vi = data.position_vi;
    const position_en = data.position_en;
    const parent_id = parentStructure?.id || 0;
    const parent_level = parentStructure?.level;
    let level = 1;
    if (parent_level == 1) {
      level = 2;
    } else if (parent_level == 2) {
      level = 3;
    }
    const email = data.email;
    const phone = data.phone;
    const fax = data.fax;
    const website = data.website;
    const address = data.address;

    let formData = {
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
    mutate(formData);
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
      {parentStructure?.level === 1 ? (
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

      {/* <div className="mt-3">
        <div className="card-title">
          <h4 className="mb-0">Phòng ban</h4>
        </div>
        <Controller
          control={control}
          name="parentStructureSelected"
          render={({ field: { onChange, value, ref } }) => (
            <Select
              placeholder="Phòng ban"
              options={parentStructures}
              value={value}
              className={`${errors.parentStructureSelected && "is-invalid"}`}
              onChange={(val) => {
                onChange(
                  parentStructures?.find(
                    (parentStructure) => parentStructure.id === val.id
                  )
                );
                setValue("parent_id", val.id);
                setValue("parent_level", val.level);
              }}
            />
          )}
        />
        {errors.parentStructureSelected && (
          <p className="text-danger">
            {errors.parentStructureSelected.message}
          </p>
        )}
      </div> */}

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

export default CreateStructure;
