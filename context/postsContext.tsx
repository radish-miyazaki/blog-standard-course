import { createContext, ReactNode, useCallback, useState } from 'react';

const PostsContext = createContext({});

export default PostsContext;

type Props = {
  children: ReactNode;
};

export const PostsProvider = ({ children }: Props) => {
  const [posts, setPosts] = useState([]);

  const setPropsFromSSR = useCallback((postsFromSSR = []) => {
    console.log(postsFromSSR);
  }, []);

  return <PostContext.Provider value={{ posts, setPropsFromSSR }}>{children}</PostContext.Provider>;
};
