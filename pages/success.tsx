import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout';
import { NextLayoutComponentType } from 'next';
import { getAppProps } from '../utils/getAppProps';

const Success: NextLayoutComponentType = () => {
  const handleClick = async () => {
    await fetch('/api/addTokens', {
      method: 'POST',
    });
  };

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
    </div>
  );
};

Success.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default Success;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const props = await getAppProps(ctx);

    return { props };
  },
});
