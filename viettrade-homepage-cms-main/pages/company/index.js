import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from 'react';
import Layout from '../../components/Layout';
import ListCompany from '../../views/company/ListCompany';

const CompanyPage = () => {
  return (
    <Layout>
      <ListCompany />
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

export default CompanyPage;
