import React from "react";
import Layout from "../../../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreateMenu from "../../../views/menu/CreateMenu";

const Create = () => {
  return (
    <Layout>
      <CreateMenu />
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
