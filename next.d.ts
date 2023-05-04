// ref: https://dev.to/ofilipowicz/next-js-per-page-layouts-and-typescript-lh5
// official docs: https://nextjs.org/docs/basic-features/layouts#with-typescript
import type { NextComponentType, NextPageContext, NextLayoutComponentType } from 'next';
import type { AppProps } from '../utils/getAppProps';

declare module 'next' {
  type NextLayoutComponentType<P = {}> = NextComponentType<NextPageContext, any, P> & {
    getLayout?: (page: ReactNode, props: AppProps) => ReactNode;
  };
}

declare module 'next/app' {
  type AppLayoutProps<P = {}> = AppProps & {
    Component: NextLayoutComponentType;
  };
}
