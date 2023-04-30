import '../styles/globals.css';
import type { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { ReactNode } from 'react';
import type { NextComponentType } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';

const dmSans = DM_Sans({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-dm-sans' });

const dmSerifDisplay = DM_Serif_Display({ weight: ['400'], subsets: ['latin'], variable: '--font-dm-serif-display' });

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <UserProvider>
      <main className={`${dmSans.variable} ${dmSerifDisplay.variable} font-body`}>
        {getLayout(<Component {...pageProps} />, pageProps)}
      </main>
    </UserProvider>
  );
};

export default MyApp;
