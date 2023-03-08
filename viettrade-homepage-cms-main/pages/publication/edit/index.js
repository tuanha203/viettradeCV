import React from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "../../../components/Layout";
import UpdatePublication from "../../../views/publication/UpdatePublication";

const Update = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return;

  return (
    <Layout>
      <UpdatePublication publicationId={id} />
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

export default Update;
