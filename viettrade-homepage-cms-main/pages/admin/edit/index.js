import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '~/components/Layout';
import UpdateAdmin from '~/views/admin/UpdateAdmin';

const AdminPageEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return;
  return (
    <Layout>
      <UpdateAdmin adminId={id} />
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

export default AdminPageEdit;
