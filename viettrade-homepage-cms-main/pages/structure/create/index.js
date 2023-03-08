import React from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreateStructure from "../../../views/structure/CreateStructure";

const Create = () => {
  const router = useRouter();
  let { id } = router.query;

  if (!id) {
    id = 0;
  }
  return (
    <Layout>
      <CreateStructure structureId={id} />
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
