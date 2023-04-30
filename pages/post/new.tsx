import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import { NextLayoutComponentType } from 'next';

const NewPost: NextLayoutComponentType = () => {
  return (
    <div>
      <h1>this is the new post page</h1>
    </div>
  );
};

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default NewPost;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    return {
      props: {},
    };
  },
});
