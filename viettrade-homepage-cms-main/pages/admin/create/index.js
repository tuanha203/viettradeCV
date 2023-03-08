import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from 'react'
import Layout from '~/components/Layout'
import CreateAdmin from '~/views/admin/CreateAdmin'

const AdminCreatePage = () => {
  return (
    <Layout>
      <CreateAdmin />
    </Layout>
  )
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default AdminCreatePage