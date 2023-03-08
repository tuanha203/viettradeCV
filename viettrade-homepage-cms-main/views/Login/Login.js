import Image from 'next/image';
import image1 from '../../public/images/login-images/login-frent-img.png';
import image2 from '../../public/images/logo-icon.png';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLogin } from '../../hooks/login';
import { setDefaultHeaders } from '../../config/Axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiEyeOff, FiEye } from 'react-icons/fi';

const ERROR_MESSAGE = {
  'Account is inactive!': 'Tài khoản của bạn đã bị tắt kích hoạt',
  'Incorrect email or password.': 'Email hoặc Mật khẩu không chính xác',
};

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Email là bắt buộc')
    .matches(
      /^([a-z0-9_+.-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,8}$/,
      'Email không đúng định dạng.'
    ),
  password: yup
    .string()
    .trim()
    .required('Mật khẩu là bắt buộc.')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});
const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { mutate, isSuccess, isLoading, data: dataLogin } = useLogin();
  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (dataLogin) {
      if (dataLogin.success === false) {
        if (!toast.isActive('update')) {
          toast.error(
            ERROR_MESSAGE[dataLogin?.messages?.[0]] || 'Đăng nhập thất bại!',
            {
              toastId: 'error',
              position: 'top-right',
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }
      } else {
        localStorage.setItem('id', dataLogin.id);
        localStorage.setItem('accessToken', dataLogin.token.accessToken);
        localStorage.setItem('email', dataLogin.email);
        localStorage.setItem('name', dataLogin.name);
        localStorage.setItem('role', dataLogin.role);
        localStorage.setItem('feature_image', dataLogin.feature_image);
        setDefaultHeaders({
          Authorization: 'Bearer ' + dataLogin.token.accessToken,
        });
        if (!toast.isActive('update')) {
          toast.success('Đăng nhập thành công!', {
            toastId: 'success',
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    }
  }, [isSuccess]);

  return (
    <>
      <div className="bg-login  pace-done">
        <div className="pace  pace-inactive">
          <div
            className="pace-progress"
            data-progress-text="100%"
            data-progress="99"
            // style="transform: translate3d(100%, 0px, 0px);"
          >
            <div className="pace-progress-inner"></div>
          </div>
          <div className="pace-activity"></div>
        </div>
        <div className="wrapper">
          <div className="section-authentication-login d-flex align-items-center justify-content-center mt-4">
            <div className="row">
              <div className="col-12 col-lg-8 mx-auto">
                <div className="card radius-15 overflow-hidden">
                  <div className="row g-0">
                    <div className="col-xl-6">
                      <div className="card-body p-5">
                        <div className="text-center">
                          <Image
                            src={image2}
                            width={80}
                            style={{ marginLeft: 'auto', marginRight: 'auto' }}
                          />
                          <p className="text-[20px] font-semibold">
                            Chào mừng bạn đến với Vietrade
                          </p>
                        </div>
                        <div className="">
                          <div className="form-body">
                            <form className="row g-3" onSubmit={onSubmit}>
                              <div className="col-12">
                                <label
                                  htmlFor="inputEmailAddress"
                                  className="form-label"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  placeholder="Email"
                                  className={`form-control ${
                                    errors.email && 'is-invalid'
                                  }`}
                                  {...register('email')}
                                />
                                {errors.email && (
                                  <p className="text-danger">
                                    {errors.email.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-12">
                                <label
                                  htmlFor="inputChoosePassword"
                                  className="form-label"
                                >
                                  Mật khẩu
                                </label>
                                <div
                                  className="input-group"
                                  id="show_hide_password"
                                >
                                  <input
                                    type={isShow ? 'text' : 'password'}
                                    className={`form-control ${
                                      errors.password && 'is-invalid'
                                    }`}
                                    id="inputChoosePassword"
                                    placeholder="Mật khẩu"
                                    {...register('password')}
                                  />
                                  <div>
                                    {isShow ? (
                                      <FiEye
                                        className="icon-pass"
                                        onClick={() => setIsShow(!isShow)}
                                      />
                                    ) : (
                                      <FiEyeOff
                                        className="icon-pass"
                                        onClick={() => setIsShow(!isShow)}
                                      />
                                    )}
                                  </div>
                                </div>
                                {errors.password && (
                                  <p className="text-danger">
                                    {errors.password.message}
                                  </p>
                                )}
                                {errors.server && (
                                  <p className="text-danger">{errors.server}</p>
                                )}
                              </div>
                              <div className="col-12">
                                <div className="d-grid">
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ backgroundColor: '#673ab7' }}
                                  >
                                    <i className="bx bxs-lock-open"></i>Đăng
                                    nhập
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 bg-login-color d-flex align-items-center justify-content-center">
                      <Image
                        src={image1}
                        className="object-cover"
                        alt="Affiliate4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
