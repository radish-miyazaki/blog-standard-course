import '../styles/globals.css';
import type { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { ReactNode } from 'react';
import type { NextComponentType } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { PostsProvider } from '../context/postsContext';
config.autoAddCss = false;

const dmSans = DM_Sans({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-dm-sans' });

const dmSerifDisplay = DM_Serif_Display({ weight: ['400'], subsets: ['latin'], variable: '--font-dm-serif-display' });

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <UserProvider>
      <PostsProvider>
        <main className={`${dmSans.variable} ${dmSerifDisplay.variable} font-body`}>
          {getLayout(<Component {...pageProps} />, pageProps)}
        </main>
      </PostsProvider>
    </UserProvider>
  );
};

export default MyApp;
