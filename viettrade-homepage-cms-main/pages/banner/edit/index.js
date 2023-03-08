import React from "react";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import UpdateBanner from "../../../views/banner/UpdateBanner";

const Update = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return;

  return (
    <Layout>
      <UpdateBanner bannerId={id} />
    </Layout>
  );
};

export default Update;
