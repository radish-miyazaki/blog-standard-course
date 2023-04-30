import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout';
import { NextLayoutComponentType } from 'next';

const TokenTopup: NextLayoutComponentType = () => {
  return (
    <div>
      <h1>this is the token topup page</h1>
    </div>
  );
};

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default TokenTopup;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    return {
      props: {},
    };
  },
});
