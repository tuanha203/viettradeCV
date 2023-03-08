import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  if(router.pathname === '/') {
  }
  return <div className='row'></div>;
};

export default HomePage;
