import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import { NextLayoutComponentType } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'bson';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { getAppProps } from '../../utils/getAppProps';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import PostsContext from '../../context/postsContext';

type Props = {
  id: string;
  postContent: string;
  title: string;
  keywords: string;
  metaDescription: string;
};

const Post: NextLayoutComponentType<Props> = ({ id, postContent, title, keywords, metaDescription }) => {
  const router = useRouter();
  const { deletePost } = useContext(PostsContext);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      const resp = await fetch('/api/deletePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id }),
      });

      const json = await resp.json();
      if (json.success) {
        await router.push('/post/new');
        deletePost(id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='overflow-auto h-full'>
      <div className='max-w-screen-sm mx-auto my-6'>
        <div className='text-sm font-bold p-2 bg-stone-200 rounded-sm'>SEOタイトルとメタディスクリプション</div>
        <div className='p-4 my-2 border border-stone-200 rounded-md'>
          <div className='text-blue-600 text-2xl font-bold'>{title}</div>
          <div className='mt-2'>{metaDescription}</div>
        </div>

        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm'>キーワード</div>
        <div className='flex flex-wrap pt-2 gap-1'>
          {keywords.split('、').map((keyword, i) => (
            <div key={i} className='p-2 rounded-full bg-slate-800 text-white'>
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>

        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm'>ブログ投稿</div>
        <div dangerouslySetInnerHTML={{ __html: postContent || '' }} />
        <div className='my-4'>
          {!showDeleteConfirm && (
            <button className='btn bg-red-600 hover:bg-red-700' onClick={() => setShowDeleteConfirm(true)}>
              削除する
            </button>
          )}
          {showDeleteConfirm && (
            <div>
              <p className='p-2 bg-red-300 text-center'>
                本当に投稿を削除しますか？一度削除すると、元に戻すことは出来ません。
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <button onClick={() => setShowDeleteConfirm(false)} className='btn bg-stone-600 hover:bg-stone-700'>
                  キャンセル
                </button>
                <button className='btn bg-red-600 hover:bg-red-700' onClick={handleDeleteConfirm}>
                  削除する
                </button>
              </div>
            </div>
          )}
        </div>
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
        id: ctx.params?.postId,
        postContent: post.postContent,
        title: post.title,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        metaDescription: post.metaDescription,
        ...props,
      },
    };
  },
});
