import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout";
import ListStructurePaging from "../../views/structure/ListStructurePaging";

const StructurePage = () => {
  return (
    <Layout>
      <ListStructurePaging />
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

export default StructurePage;
