import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from 'react';
import Layout from '../../components/Layout';
import ListQuestion from '../../views/question/ListQuestion';

const QuestionPage = () => {
  return (
    <Layout>
      <ListQuestion />
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

export default QuestionPage;
