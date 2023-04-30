import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const PostNew = () => {
  return (
    <div>
      <h1>this is the new post page</h1>
    </div>
  );
};

export default PostNew;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    return {
      props: {},
    };
  },
});
