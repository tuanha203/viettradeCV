import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import UpdateCompany from '../../../views/company/UpdateCompany';

const Update = () => {
  const router = useRouter();
  const {id} = router.query;

  if(!id) return ;
  return (
    <Layout>
      <UpdateCompany companyId={id} />
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
