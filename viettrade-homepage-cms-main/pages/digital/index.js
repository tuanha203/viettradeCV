import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import Layout from "../../components/Layout";
import ListDigital from "../../views/digital/ListDigital";

const DigitalPage = () => {
  return (
    <Layout>
      <ListDigital />
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

export default DigitalPage;
