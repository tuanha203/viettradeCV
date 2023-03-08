import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout";
import ListDepartment from "../../views/department/ListDepartment";

const DepartmentPage = () => {
  return (
    <Layout>
      <ListDepartment />
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

export default DepartmentPage;
