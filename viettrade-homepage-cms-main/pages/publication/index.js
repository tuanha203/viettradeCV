import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from 'react';
import Layout from '../../components/Layout';
import ListPublication from '../../views/publication/ListPublication';

const PublicationPage = () => {
  return (
    <Layout>
      <ListPublication />
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

export default PublicationPage;
