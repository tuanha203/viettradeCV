import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import Layout from "../../components/Layout";
import ListMedia from "../../views/media/ListMedia";

const MediaPage = () => {
  return (
    <Layout>
      <ListMedia />
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

export default MediaPage;
