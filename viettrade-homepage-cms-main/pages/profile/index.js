import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout";
import Profile from "~/views/profile";

const PostPage = () => {
  return (
    <Layout>
      <Profile />
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

export default PostPage;