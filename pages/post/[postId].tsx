import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Post = () => {
  return (
    <div>
      <h1>this is the post page</h1>
    </div>
  );
};

export default Post;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    return {
      props: {},
    };
  },
});
