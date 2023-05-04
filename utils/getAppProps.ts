import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../lib/mongodb';
import { GetServerSidePropsContext } from 'next/types';

type Post = {
  created: string;
  _id: PostId;
  title: string;
  topic: string;
  postContent: string;
  metaDescription: string;
  keywords: string;
};

type PostId = string;

export type AppProps = {
  availableTokens: number;
  posts: Post[];
  postId: PostId | null;
};

export const getAppProps = async (ctx: GetServerSidePropsContext): Promise<AppProps> => {
  const userSession = await getSession(ctx.req, ctx.res);
  const client = await clientPromise;
  const db = client.db('BlogStandard');
  const user = await db.collection('users').findOne({
    auth0Id: userSession?.user?.sub,
  });

  if (!user) {
    return {
      availableTokens: 0,
      posts: [],
      postId: null,
    };
  }

  const posts = await db
    .collection('posts')
    .find({
      userId: user._id,
    })
    .sort({
      created: -1,
    })
    .toArray();

  return {
    availableTokens: user.availableTokens,
    posts: posts.map(({ created, _id, userId, ...rest }) => {
      return {
        _id: _id.toString(),
        created: created.toString() as string,
        ...(rest as Omit<Post, '_id' | 'created'>),
      };
    }),
    postId: (ctx.params?.postId as string) || null,
  };
};
