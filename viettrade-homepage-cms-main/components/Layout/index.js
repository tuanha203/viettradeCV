import Head from "next/head";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { setDefaultHeaders } from "../../config/Axios";
import { useEffect, useState, useContext,useCallback } from "react";
import axios from "../../config/Axios";
import { AdminContext } from "contexts/AdminContext";
import { API } from "~/constants";

const Layout = ({ children }) => {
  const [showLayout, setShowLayout] = useState(false);
  const { setAdmin } = useContext(AdminContext);

  const getAdmin = useCallback(async () => {
    try {
      const res = await axios.get(`${API.API_ROOT}${API.ADMIN.INFO}`);
      if (res?.data) {
        setAdmin(res.data);
      } else {
        localStorage.setItem("accessToken", "");
        localStorage.setItem("email", "");
        localStorage.setItem("name", "");
        localStorage.setItem("feature_image", "");
        window.location.replace("/login");
      }
    } catch (e) {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("email", "");
      localStorage.setItem("name", "");
      localStorage.setItem("feature_image", "");
      window.location.replace("/login");
    }
  }, [setAdmin]);

  useEffect(() => {
    
    if (localStorage.getItem("accessToken")) {
      setShowLayout(true);
      setDefaultHeaders({
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      });
      getAdmin();
    } else {
      window.location.replace("/login");
    }
  }, [getAdmin]);
  if (!showLayout) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Vietrade</title>
        <meta name="description" content="viettrade" />
      </Head>
      <div className="wrapper">
        <Header />
        <Sidebar />
        <main className="w-full min-h-screen">
          <div className="page-wrapper">
            <div className="page-content-wrapper">
              <div className="page-content">{children}</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Layout;
