import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import Layout from '~/components/Layout';
import ListAdmin from '~/views/admin/ListAdmin';

const AdminPage = () => {
  return (
    <Layout>
      <ListAdmin />
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

export default AdminPage;
