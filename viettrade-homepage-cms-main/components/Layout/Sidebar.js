import { Collapse } from 'antd';
import { AdminContext } from 'contexts/AdminContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AiOutlineFundProjectionScreen } from 'react-icons/ai';
import {
  BiCategoryAlt,
  BiMenu,
  BiNews,
  BiSitemap,
  BiSlider,
  BiUserCircle,
  BiVideoPlus,
} from 'react-icons/bi';
import { BsQuestionLg } from 'react-icons/bs';
import { FaCity } from 'react-icons/fa';
import { GiWhiteBook } from 'react-icons/gi';
import { GrDocumentText } from 'react-icons/gr';
import { ImNewspaper, ImUsers } from 'react-icons/im';
import { MdOutlineAirplaneTicket, MdOutlineWebAsset } from 'react-icons/md';
import { permissions } from '~/constants';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { FaUserTie } from 'react-icons/fa';
const Sidebar = () => {
  const router = useRouter();
  const [key, setKeyActive] = useState('');
  const { admin } = useContext(AdminContext);

  useEffect(() => {
    if (
      router.pathname.includes('/question') ||
      router.pathname.includes('/structure') ||
      router.pathname.includes('/department') ||
      router.pathname.includes('/project')
    ) {
      setKeyActive(1);
    }
    if (
      router.pathname.includes('/category') ||
      router.pathname.includes('/post') ||
      // router.pathname === "/" ||
      router.pathname.includes('/company') ||
      router.pathname.includes('/media') ||
      router.pathname.includes('/publication') ||
      router.pathname.includes('/document-category') ||
      router.pathname.includes('/document')
    ) {
      setKeyActive(2);
    }
  }, [router.pathname]);

  return (
    <div
      className="sidebar-wrapper max-h-screen overflow-scroll"
      data-simplebar="true"
    >
      <div className="sidebar-header">
        <Link href="/post" className="hover:text-blue text-[#404142]">
          <div className="flex pl-[9px]">
            <Image
              src="/images/logo-icon.png"
              alt="Logo"
              width={35}
              height={35}
            />
            <h4 className="logo-text">Vietrade</h4>
          </div>
        </Link>

        <button className="toggle-btn ms-auto">
          <i className="bx bx-menu"></i>
        </button>
      </div>
      <ul className="metismenu" id="menu">
        <li className="menu-label">Qu???n l??</li>
        <Collapse
          defaultActiveKey={1}
          activeKey={key}
          ghost
          expandIconPosition={'end'}
          accordion
        >
          {(admin?.role === permissions.admin ||
            admin?.role === permissions.manager) && (
            <Collapse.Panel
              key="1"
              header={
                <div
                  className="flex"
                  onClick={() => {
                    key != 1 ? setKeyActive(1) : setKeyActive('');
                  }}
                >
                  <div className="parent-icon icon-color-2">
                    <MdOutlineWebAsset
                      className="text-gray"
                      style={{ fontSize: '24px' }}
                    />
                  </div>
                  <div className="menu-title ml-3">Qu???n l?? trang t??nh</div>
                </div>
              }
            >
              {(admin?.role === permissions.admin ||
                admin?.role === permissions.manager) && (
                <li
                  className={`${
                    router.pathname.includes('/question') ? 'mm-active' : ''
                  }`}
                >
                  <Link
                    style={{ paddingLeft: '30px' }}
                    href="/question"
                    className="pl-9"
                  >
                    <div className="parent-icon icon-color-1">
                      <BsQuestionLg className="text-gray" />
                    </div>
                    <p className="menu-title">FAQ</p>
                  </Link>
                </li>
              )}
              {(admin?.role === permissions.admin ||
                admin?.role === permissions.manager) && (
                <li
                  className={`${
                    router.pathname.includes('/structure') ? 'mm-active' : ''
                  }`}
                >
                  <Link style={{ paddingLeft: '30px' }} href="/structure">
                    <div className="parent-icon icon-color-10">
                      <BiSitemap className="text-gray" />
                    </div>
                    <p className="menu-title">C?? c???u t??? ch???c</p>
                  </Link>
                </li>
              )}
              {(admin?.role === permissions.admin ||
                admin?.role === permissions.manager) && (
                <li
                  className={`${
                    router.pathname.includes('/project') ? 'mm-active' : ''
                  }`}
                >
                  <Link style={{ paddingLeft: '30px' }} href="/project">
                    <div className="parent-icon icon-color-4">
                      <AiOutlineFundProjectionScreen className="text-gray" />
                    </div>
                    <p className="menu-title">D??? ??n</p>
                  </Link>
                </li>
              )}
              {(admin?.role === permissions.admin ||
                admin?.role === permissions.manager) && (
                <li
                  className={`${
                    router.pathname.includes('/department') ? 'mm-active' : ''
                  }`}
                >
                  <Link style={{ paddingLeft: '30px' }} href="/department">
                    <div className="parent-icon" style={{ color: '#0d95a3' }}>
                      <ImUsers className="text-gray" />
                    </div>
                    <p className="menu-title">L??nh ?????o c???c</p>
                  </Link>
                </li>
              )}
            </Collapse.Panel>
          )}
          <Collapse.Panel
            key="2"
            header={
              <div
                className="flex"
                onClick={() => {
                  key != 2 ? setKeyActive(2) : setKeyActive('');
                }}
              >
                <div className="parent-icon icon-color-2">
                  <ImNewspaper
                    className="text-gray"
                    style={{ fontSize: '24px' }}
                  />
                </div>
                <div className="menu-title ml-3">Qu???n l?? b??i vi???t</div>
              </div>
            }
          >
            {(admin?.role === permissions.admin ||
              admin?.role === permissions.manager) && (
              <li
                className={` ${
                  router.pathname.includes('/category') ? 'mm-active' : ''
                }`}
              >
                <Link style={{ paddingLeft: '30px' }} href="/category">
                  <div className="parent-icon icon-color-3">
                    <BiCategoryAlt className="text-gray" />
                  </div>
                  <p className="menu-title">Th??? lo???i</p>
                </Link>
              </li>
            )}
            {(admin?.role === permissions.admin ||
              admin?.role === permissions.manager ||
              admin?.role === permissions.content) && (
              <li
                className={`${
                  router.pathname === '/' || router.pathname.includes('/post')
                    ? 'mm-active'
                    : ''
                }`}
              >
                <Link style={{ paddingLeft: '30px' }} href="/post">
                  <div className="parent-icon icon-color-4">
                    <BiNews className="text-gray" />
                  </div>
                  <div className="menu-title">Tin t???c</div>
                </Link>
              </li>
            )}
            {(admin?.role === permissions.admin ||
              admin?.role === permissions.manager) && (
              <li
                className={`${
                  router.pathname.includes('/company') ? 'mm-active' : ''
                }`}
              >
                <Link style={{ paddingLeft: '30px' }} href="/company">
                  <div className="parent-icon icon-color-2">
                    <FaCity className="text-gray" />
                  </div>
                  <div className="menu-title">Doanh nghi???p</div>
                </Link>
              </li>
            )}
            {(admin?.role === permissions.admin ||
              admin?.role === permissions.manager) && (
              <li
                className={`${
                  router.pathname.includes('/media') ? 'mm-active' : ''
                }`}
              >
                <Link style={{ paddingLeft: '30px' }} href="/media">
                  <div className="parent-icon icon-color-8">
                    <BiVideoPlus className="text-gray" />
                  </div>
                  <div className="menu-title">Media</div>
                </Link>
              </li>
            )}
            {(admin?.role === permissions.admin ||
              admin?.role === permissions.manager) && (
              <li
                className={`${
                  router.pathname.includes('/publication') ? 'mm-active' : ''
                }`}
              >
                <Link style={{ paddingLeft: '30px' }} href="/publication">
                  <div className="parent-icon icon-color-2">
                    <GiWhiteBook className="text-gray" />
                  </div>
                  <div className="menu-title">???n ph???m</div>
                </Link>
              </li>
            )}
            {(admin?.role === permissions.admin ||
              admin?.role === permissions.manager) && (
              <li
                className={`mt-1 ${
                  router.pathname.includes('/document-category')
                    ? 'mm-active'
                    : ''
                }`}
              >
                <Link style={{ paddingLeft: '30px' }} href="/document-category">
                  <div className="parent-icon ">
                    <BiCategoryAlt className="text-gray" />
                  </div>
                  <p className="menu-title">Danh m???c t??i li???u</p>
                </Link>
              </li>
            )}
            {(admin?.role === permissions.admin ||
              admin?.role === permissions.manager) && (
              <li
                className={`mt-1 ${
                  /^.*document(\/.*)?$/.test(router.pathname) ? 'mm-active' : ''
                }`}
              >
                <Link style={{ paddingLeft: '30px' }} href="/document">
                  <div className="parent-icon icon-color-4">
                    <HiOutlineDocumentDuplicate className="text-gray" />
                  </div>
                  <p className="menu-title">T??i li???u</p>
                </Link>
              </li>
            )}
          </Collapse.Panel>
        </Collapse>

        {/* {(admin?.role === permissions.admin ||
          admin?.role === permissions.manager) && (
            <li
              className={`mt-1 ${router.pathname.includes("/project") ? "mm-active" : ""
                }`}
            >
              <Link href="/project">
                <div className="parent-icon icon-color-4">
                  < AiOutlineFundProjectionScreen />
                </div>
                <p className="menu-title">Qu???n l?? d??? ??n</p>
              </Link>
            </li>
          )} */}
        {(admin?.role === permissions.admin ||
          admin?.role === permissions.manager) && (
          <li
            className={`mt-1 ${
              router.pathname.includes('/digital') ? 'mm-active' : ''
            }`}
          >
            <Link href="/digital">
              <div className="parent-icon icon-color-4">
                <MdOutlineAirplaneTicket className="text-gray" />
              </div>
              <p className="menu-title">Bi???u ng???</p>
            </Link>
          </li>
        )}
        {(admin?.role === permissions.admin ||
          admin?.role === permissions.manager) && (
          <li
            className={`mt-1 ${
              router.pathname.includes('/banner') ? 'mm-active' : ''
            }`}
          >
            <Link href="/banner">
              <div className="parent-icon icon-color-4">
                <BiSlider className="text-gray" />
              </div>
              <p className="menu-title">Banner</p>
            </Link>
          </li>
        )}
        {admin?.role === permissions.admin && (
          <li
            className={`${
              router.pathname.includes('/user') ? 'mm-active' : ''
            }`}
          >
            <Link href="/user">
              <div className="parent-icon icon-color-4">
                <BiUserCircle className="text-gray" />
              </div>
              <div className="menu-title">Ng?????i d??ng</div>
            </Link>
          </li>
        )}
        {admin?.role === permissions.admin && (
          <li
            className={`${
              router.pathname.includes('/admin') ? 'mm-active' : ''
            }`}
          >
            <Link href="/admin">
              <div className="parent-icon icon-color-10">
                <FaUserTie className="text-gray" />
              </div>
              <p className="menu-title">Qu???n tr??? vi??n</p>
            </Link>
          </li>
        )}
        {admin?.role === permissions.admin && (
          <li
            className={`${
              router.pathname.includes('/menu') ? 'mm-active' : ''
            }`}
          >
            <Link href="/menu">
              <div className="parent-icon" style={{ color: '#fc3bff' }}>
                <BiMenu className="text-gray" />
              </div>
              <p className="menu-title">Qu???n l?? menu</p>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
