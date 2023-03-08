import React from 'react';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import UpdateUser from '../../../views/User/UpdateUser';

const Update = () => {
  const router = useRouter();
  const {id} = router.query;

  if(!id) return ;
  
  return (
    <Layout>
      <UpdateUser userId={id} />
    </Layout>
  );
};

export default Update;
