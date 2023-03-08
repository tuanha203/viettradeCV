import {appWithTranslation} from "next-i18next";
import {AppProviders} from "../contexts";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import AdminProvider from "contexts/AdminContext";

function MyApp({Component, pageProps}) {
  return (
    <AppProviders pageProps={pageProps}>
      <AdminProvider>
        <Component {...pageProps} />
      </AdminProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppProviders>
  );
}

export default appWithTranslation(MyApp);
