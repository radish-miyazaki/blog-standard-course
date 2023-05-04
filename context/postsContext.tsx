import { createContext, ReactNode, useCallback, useReducer, useState } from 'react';
import { Post } from '../utils/getAppProps';

type GetPostsArgs = {
  lastPostDate: string;
  getNewerPosts?: boolean;
};

type Context = {
  posts: Post[];
  setPostsFromSSR: (postsFromSSR: Post[]) => void;
  getPosts: ({ lastPostDate, getNewerPosts }: GetPostsArgs) => Promise<void>;
  noMorePosts: boolean;
  deletePost: (postId: string) => void;
};

const PostsContext = createContext<Context>({
  posts: [],
  setPostsFromSSR: () => {},
  getPosts: () => Promise.resolve(),
  noMorePosts: false,
  deletePost: () => {},
});

export default PostsContext;

type State = Post[];
type Action = { type: 'addPosts'; posts: Post[] } | { type: 'deletePost'; postId: string };

function postsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'addPosts': {
      const newPosts = [...state];
      action.posts.forEach((post: Post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    case 'deletePost': {
      const newPosts: Post[] = [];
      state.forEach((post) => {
        if (post._id !== action.postId) {
          newPosts.push(post);
        }
      });

      return newPosts;
    }
    default:
      return state;
  }
}

type Props = {
  children: ReactNode;
};

export const PostsProvider = ({ children }: Props) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);

  const deletePost = useCallback((postId: string) => {
    dispatch({
      type: 'deletePost',
      postId,
    });
  }, []);

  const setPostsFromSSR = useCallback((postsFromSSR: Post[] = []) => {
    dispatch({
      type: 'addPosts',
      posts: postsFromSSR,
    });

    if (postsFromSSR.length < 5) {
      console.log('postsResult.length < 5');
      // 5件未満の場合はこれ以上読み込む投稿がないと判断する
      setNoMorePosts(true);
    }
  }, []);

  const getPosts = useCallback(async ({ lastPostDate, getNewerPosts = false }: GetPostsArgs) => {
    const result = await fetch('/api/getPosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lastPostDate, getNewerPosts }),
    });
    const json = await result.json();
    const postsResult = json.posts || [];

    if (postsResult.length < 5) {
      console.log('postsResult.length < 5');
      // 5件未満の場合はこれ以上読み込む投稿がないと判断する
      setNoMorePosts(true);
    }

    dispatch({
      type: 'addPosts',
      posts: postsResult,
    });
  }, []);

  return (
    <PostsContext.Provider value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
};
