import React from "react";
import Layout from "../../../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreateDepartment from "../../../views/department/CreateDepartment";

const Create = () => {
  return (
    <Layout>
      <CreateDepartment />
    </Layout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default Create;
