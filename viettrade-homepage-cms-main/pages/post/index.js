import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout";
import ListPost from "../../views/Post/ListPost";

const PostPage = () => {
  return (
    <Layout>
      <ListPost />
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
