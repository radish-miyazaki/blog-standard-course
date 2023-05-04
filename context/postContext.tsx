import { createContext, ReactNode, useCallback, useState } from 'react';

const PostContext = createContext({});

export default PostContext;

type Props = {
  children: ReactNode;
};

export const PostProvider = ({ children }: Props) => {
  const [posts, setPosts] = useState([]);

  const setPropsFromSSR = useCallback((postsFromSSR = []) => {
    console.log(postsFromSSR);
  }, []);

  return <PostContext.Provider value={{ posts, setPropsFromSSR }}>{children}</PostContext.Provider>;
};
