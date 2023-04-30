import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const TokenTopup = () => {
  return (
    <div>
      <h1>this is the token topup page</h1>
    </div>
  );
};

export default TokenTopup;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    return {
      props: {},
    };
  },
});
