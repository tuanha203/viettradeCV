import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from 'react';
import Layout from '../../../components/Layout';
import CreateDocument from '../../../views/document/CreateDocument';

const CreateDocumentPage = () => {
  return (
    <Layout>
      <CreateDocument />
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

export default CreateDocumentPage;
