import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from 'react';
import Layout from '../../components/Layout';
import ListCategory from '../../views/category/ListCategory';

const CategoryPage = () => {
  return (
    <Layout>
      <ListCategory />
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

export default CategoryPage;
