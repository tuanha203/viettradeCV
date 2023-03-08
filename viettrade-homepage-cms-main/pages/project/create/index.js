import React from "react";
import Layout from "../../../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreateProject from "../../../views/Project/CreateProject";

const Create = () => {
  return (
    <Layout>
      <CreateProject />
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
