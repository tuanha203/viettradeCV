import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '~/components/Layout';
import CreateUser from '../../../views/User/CreateUser';

const CreateUserPage = () => {
  return (
    <Layout>
      <CreateUser />
    </Layout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default CreateUserPage;
