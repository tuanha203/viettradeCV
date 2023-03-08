import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import Layout from "../../components/Layout";
import ListCategoryDocument from "../../views/category-document/ListCategoryDocument";

const CategoryDocumentPage = () => {
  return (
    <Layout>
      <ListCategoryDocument />
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

export default CategoryDocumentPage;
