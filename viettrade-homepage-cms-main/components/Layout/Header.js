import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { BiArrowFromLeft } from "react-icons/bi";
import { AiOutlinePoweroff } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import Button from "../../components/common/Button";
import { useRouter } from "next/router";
import noImage from "../../public/images/no-avatar.png";
import Image from 'next/image';

const Header = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("role")) {
      setRole(localStorage.getItem("role"));
      setName(localStorage.getItem("name"));
      setAvatar(localStorage.getItem("feature_image"));
    }
  }, []);

  const logout = () => {
    localStorage.setItem("accessToken", "");
    localStorage.setItem("email", "");
    localStorage.setItem("name", "");
    localStorage.setItem("feature_image", "");
    window.location.replace("/login");
  };
  const items = [
    {
      key: "1",
      label: (
        <>
          <a
            class="dropdown-item flex justify-start items-center px-0"
            href="javascript:;"
            onClick={() => router.push(`/profile`)}
          >
            <AiOutlineUser className="mr-2" />
            <span>Thông tin cá nhân</span>
          </a>
        </>
      ),
    },
    {
      key: "2",
      label: (
        <>
          <a
            class="dropdown-item flex justify-start items-center px-0"
            href="javascript:;"
            onClick={logout}
          >
            <AiOutlinePoweroff className="mr-2" />
            <span>Đăng xuất</span>
          </a>
        </>
      ),
    },
  ];
  return (
    <header className="top-header">
      <nav className="navbar navbar-expand">
        <div className="left-topbar d-flex align-items-center">
          <button className="toggle-btn">
            <i className="bx bx-menu"></i>
          </button>
        </div>
        <div className="flex-grow-1 search-bar"></div>
        <div className="right-topbar ms-auto">
          <ul className="navbar-nav">
            <li className="nav-item search-btn-mobile">
              <a className="nav-link position-relative" href="">
                <i className="bx bx-search vertical-align-middle"></i>
              </a>
            </li>
            <li className="nav-item dropdown dropdown-user-profile">
              <div className="d-flex user-box align-items-center">
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottomRight"
                  arrow
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="user-info">
                      <p className="user-name mb-0">{name}</p>
                      <p className="designattion mb-0">{role == 0 ? 'Quản trị viên': (role == 1 ? 'Biên tậP viên' : 'Quản lý')}</p>
                    </div>
                    <Image
                      src={avatar && avatar != 'null' ? avatar : noImage}
                      className="user-img" 
                      alt="user avatar"
                      width={35}
                      height={35}
                    />
                  </div>
                </Dropdown>
              </div>
            </li>

            {/* <li className="nav-item dropdown dropdown-user-profile">
              <div className="d-flex user-box align-items-center">
                <div className="user-info">
                  <p className="user-name mb-0">
                    <span onClick={logout}></span>
                  </p>
                  <Button
                    className="btn-warning btn"
                    onClick={logout}
                    style={{ display: "flex" }}
                  >
                    Logout&nbsp;
                    <div className="parent-icon text-white">
                      <BiArrowFromLeft className="text-[22px]" />
                    </div>
                  </Button>
                </div>
              </div>
            </li> */}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
