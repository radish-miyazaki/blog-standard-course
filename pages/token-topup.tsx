import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout';
import { NextLayoutComponentType } from 'next';
import { getAppProps } from '../utils/getAppProps';

const TokenTopup: NextLayoutComponentType = () => {
  const handleClick = async () => {
    await fetch('/api/addTokens', {
      method: 'POST',
    });
  };

  return (
    <div>
      <h1>this is the token topup page</h1>
      <button className='btn' onClick={handleClick}>
        トークンを追加する
      </button>
    </div>
  );
};

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default TokenTopup;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const props = await getAppProps(ctx);

    return { props };
  },
});
