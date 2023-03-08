import React from "react";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import UpdateDigital from "../../../views/digital/UpdateDigital";

const Update = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return;

  return (
    <Layout>
      <UpdateDigital digitalId={id} />
    </Layout>
  );
};

export default Update;
