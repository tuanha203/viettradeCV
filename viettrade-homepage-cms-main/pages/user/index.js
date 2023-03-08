import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout";
import User from "../../views/User/User";

const UserPage = () => {
  return (
    <Layout>
      <User />
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

export default UserPage;
