import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import Layout from "../../components/Layout";
import ListDocument from "../../views/document/ListDocument";

const DocumentPage = () => {
  return (
    <Layout>
      <ListDocument />
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

export default DocumentPage;
