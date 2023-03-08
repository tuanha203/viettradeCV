import React from "react";
import Layout from "../../../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreatePost from "../../../views/Post/CreatePost";

const Create = () => {
  return (
    <Layout>
      <CreatePost />
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
