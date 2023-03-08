import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout";
import ListMenu from "../../views/menu/ListMenu";

const MenuPage = () => {
  return (
    <Layout>
      <ListMenu />
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

export default MenuPage;
