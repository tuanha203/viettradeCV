import React from "react";
import Layout from "../../../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreateMedia from "../../../views/media/CreateMedia";

const Create = () => {
  return (
    <Layout>
      <CreateMedia />
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
