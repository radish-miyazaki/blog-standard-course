import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Logo } from '../Logo';
import { AppProps } from '../../utils/getAppProps';

type Props = {
  children: ReactNode;
} & AppProps;

export const AppLayout = ({ children, availableTokens, posts, postId }: Props) => {
  const { user } = useUser();

  const handleClick = async () => {
    const result = await fetch('/api/addTokens', {
      method: 'POST',
    });

    const json = await result.json();
    window.location.href = json.session.url;
  };

  return (
    <div className='grid grid-cols-[300px_1fr] h-screen'>
      <div className='flex flex-col text-white overflow-hidden'>
        <div className='bg-slate-800 px-2'>
          <Logo />
          <Link href='/post/new' className='btn'>
            新しい投稿
          </Link>
          <div className='block mt-2 text-center'>
            <FontAwesomeIcon icon={faCoins} className='text-yellow-500' />
            <span className='px-1'>{availableTokens} トークン</span>
            <FontAwesomeIcon icon={faPlus} className='cursor-pointer w-3 h-3' onClick={handleClick} />
          </div>
        </div>
        <div className='px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800'>
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 py-1 px-2 bg-white/10 cursor-pointer rounded ${
                postId === post._id ? 'bg-white/20 border-white' : ''
              }`}
            >
              {post.topic}
            </Link>
          ))}
        </div>
        <div className='bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2'>
          {!!user ? (
            <>
              <div className='min-w-[50px]'>
                <Image src={user.picture || ''} alt={user.name || ''} height={50} width={50} className='rounded-full' />
              </div>
              <div className='flex-1'>
                <div className='font-bold'>{user.name}</div>
                <Link className='text-sm' href='/api/auth/logout'>
                  ログアウト
                </Link>
              </div>
            </>
          ) : (
            <Link href='/api/auth/login'>ログイン</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
