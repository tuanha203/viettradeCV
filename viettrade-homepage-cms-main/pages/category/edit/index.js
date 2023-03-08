import React from 'react';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import UpdateCategory from '../../../views/category/UpdateCategory';

const Update = () => {
  const router = useRouter();
  const {id} = router.query;

  if(!id) return ;
  
  return (
    <Layout>
      <UpdateCategory categoryId={id} />
    </Layout>
  );
};

export default Update;
