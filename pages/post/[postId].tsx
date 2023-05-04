import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import { NextLayoutComponentType } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'bson';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { AppProps, getAppProps } from '../../utils/getAppProps';

type Props = {
  postContent: string;
  title: string;
  keywords: string;
  metaDescription: string;
};

const Post: NextLayoutComponentType<Props> = (props) => {
  return (
    <div className='overflow-auto h-full'>
      <div className='max-w-screen-sm mx-auto my-6'>
        <div className='text-sm font-bold p-2 bg-stone-200 rounded-sm'>SEO title and meta description</div>
        <div className='p-4 my-2 border border-stone-200 rounded-md'>
          <div className='text-blue-600 text-2xl font-bold'>{props.title}</div>
          <div className='mt-2'>{props.metaDescription}</div>
        </div>

        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm'>Keywords</div>
        <div className='flex flex-wrap pt-2 gap-1'>
          {props.keywords.split('、').map((keyword, i) => (
            <div key={i} className='p-2 rounded-full bg-slate-800 text-white'>
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>

        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm'>Blog post</div>
        <div dangerouslySetInnerHTML={{ __html: props.postContent || '' }} />
      </div>
    </div>
  );
};

export default Post;

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const session = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db('BlogStandard');
    const user = await db.collection('users').findOne({
      auth0Id: session?.user!.sub,
    });
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params?.postId as string),
      userId: user?._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false,
        },
      };
    }

    const props = await getAppProps(ctx);

    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        keywords: post.keywords,
        metaDescription: post.metaDescription,
        ...props,
      },
    };
  },
});
