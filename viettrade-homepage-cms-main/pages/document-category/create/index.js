import React from 'react';
import Layout from '../../../components/Layout';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreateCategory from '../../../views/category-document/CreateCategoryDocument';

const Create = () => {
  return (
    <Layout>
      <CreateCategory />
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
