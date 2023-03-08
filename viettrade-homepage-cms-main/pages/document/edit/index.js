import React from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from '../../../components/Layout';
import UpdateDocument from '../../../views/document/UpdateDocument';

const Update = () => {
  const router = useRouter();
  const {id} = router.query;

  if(!id) return ;
  
  return (
    <Layout>
      <UpdateDocument documentId={id} />
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
