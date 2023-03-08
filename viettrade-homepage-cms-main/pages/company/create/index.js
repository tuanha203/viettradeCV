import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from '../../../components/Layout';
import CreateCompany from '../../../views/company/CreateCompany';

const Create = () => {
  return (
    <Layout>
      <CreateCompany />
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
