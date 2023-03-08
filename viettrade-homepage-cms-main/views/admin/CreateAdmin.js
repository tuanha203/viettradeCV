import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Button from '~/components/common/Button';
import { roles } from '~/constants';
import { useCreateAdmin } from '~/hooks/admin';
import { createFile } from '~/utils/file';
import convertValidNameImage from '~/utils/image/convertValidNameImage';
import noImage from '../../public/images/no-avatar.png';

const CreateAdmin = () => {
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title">
          <p className="text-[20px] font-semibold col-6">
            Thêm mới quản trị viên
          </p>
          <div className="mt-4">
            <FormCreate />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormCreate = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [image, setImage] = useState({ preview: '', raw: '' });
  const [isDisable, setIsDisable] = useState(false);
  const [checkStatus, setCheckStatus] = useState(1);
  const {
    mutate,
    data,
    isSuccess,
    isLoading,
    data: dataCreate,
    error,
  } = useCreateAdmin(setIsDisable);
  const schema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required('Tên người dùng là bắt buộc')
      .matches(
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_]+$/,
        'Tên không đúng định dạng'
      )
      .max(191, 'Trường tên không dài quá 191 kí tự'),
    role: yup.string().trim().required('Vai trò người dùng là bắt buộc'),
    email: yup
      .string()
      .trim()
      .required('Email là bắt buộc')
      .matches(
        /^([a-z0-9_+.-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/,
        'Email không đúng định dạng'
      )
      .max(191, 'Trường email không dài quá 191 kí tự'),
    password: yup
      .string()
      .trim()
      .required('Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu có ít nhất 8 kí tự')
      .max(20, 'Mật khẩu không được vượt quá 20 kí tự'),
    roleSelected: yup.object().required('Trường vai trò không được bỏ trống'),
    feature_image: yup
      .mixed()
      .notRequired()
      .test('file-type', 'Ảnh không hợp lệ', (value) => {
        if (typeof value === 'string' || !value) {
          return true;
        }
        if (value && !value[0]) {
          return true;
        }
        return ['image/jpeg', 'image/png', 'image/jpg'].includes(
          value[0]?.type
        );
      })
      .test('fileSize', 'Kích thước ảnh tối đa là 3 MB', (value) => {
        if (typeof value === 'string' || !value) {
          return true;
        }
        if (value && !value[0]) {
          return true;
        }
        return value && value[0]?.size <= 3 * 1024 * 1024;
      }),
  });
  useEffect(() => {
    if (dataCreate) {
      toast.success('Tạo mới quản trị viên thành công!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    } else {
      setImage({
        preview: '',
        raw: '',
      });
    }
  };

  const onSubmit = (values) => {
    setIsDisable(true);
    let file = values.feature_image[0];
    if (values.feature_image[0]) {
      const newNameImage = convertValidNameImage(values.feature_image[0].name);
      file = createFile(values.feature_image, newNameImage, {
        type: values.feature_image[0].type,
      });
    }

    const name = values.name;
    const email = values.email;
    const password = values.password;
    const role = values.role;

    // Create a FormData object to store the file
    const formData = new FormData();

    // Add the file to the FormData object
    formData.append('feature_image', file);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('status', checkStatus);
    mutate(formData);
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
                className={`form-control ${errors.name && 'is-invalid'}`}
                placeholder="Tên"
                {...register('name', { required: true })}
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
                className={`form-control ${
                  (error?.response.data.errors.includes('email is exist') ||
                    errors.email) &&
                  'is-invalid'
                }`}
                placeholder="Email"
                {...register('email', { required: true })}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
              {error?.response.data.errors.includes('email is exist') && (
                <p className="text-danger">Email đã tồn tại.</p>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label">
                Mật khẩu <span className="text-danger text-[18px]">*</span>
              </label>
              <input
                type="password"
                placeholder="Mật khẩu"
                className={`form-control ${errors.password && 'is-invalid'}`}
                {...register('password', { required: true })}
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label">
                {t('user.role')}{' '}
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
                    className={`${errors.roleSelected && 'is-invalid'}`}
                    onChange={(val) => {
                      onChange(val);
                      setValue('role', val.value);
                    }}
                  />
                )}
              />
              {errors.roleSelected && (
                <p className="text-danger">{errors.roleSelected.message}</p>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mc-3 text-center">
              <label>Ảnh</label>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control opacity-0"
                  id="inputGroupFile01"
                  {...register('feature_image')}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="wp-preview-image">
                <label htmlFor="inputGroupFile01">
                  <img
                    src={image.preview ? image.preview : noImage.src}
                    alt=""
                    style={{
                      borderRadius: '50%',
                      width: '250px',
                      height: '250px',
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
            <label className="form-check-label" style={{ fontSize: '14px' }}>
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
            <label className="form-check-label" style={{ fontSize: '14px' }}>
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
      </form>
    </div>
  );
};

export default CreateAdmin;
