import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import Layout from "../../components/Layout";
import ListBanner from "../../views/banner/ListBanner";

const BannerPage = () => {
  return (
    <Layout>
      <ListBanner />
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

export default BannerPage;
