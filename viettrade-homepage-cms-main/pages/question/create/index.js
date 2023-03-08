import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from 'react';
import Layout from '../../../components/Layout';
import CreateQuestion from '../../../views/question/CreateQuestion';

const CreateQuestionPage = () => {
  return (
    <Layout>
      <CreateQuestion />
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

export default CreateQuestionPage;
