import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from '~/components/Layout';
import ListPost from "~/views/Post/ListPost";

const Home = () => {
  return (
    <Layout>
      <ListPost />
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

export default Home;
