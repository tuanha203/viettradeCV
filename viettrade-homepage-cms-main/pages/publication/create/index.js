import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from 'react';
import Layout from '../../../components/Layout';
import CreatePublication from '../../../views/publication/CreatePublication';

const CreatePublicationPage = () => {
  return (
    <Layout>
      <CreatePublication />
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

export default CreatePublicationPage;
