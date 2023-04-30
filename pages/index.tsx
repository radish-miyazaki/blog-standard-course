import Image from 'next/image';
import HeroImage from '../public/hero.webp';
import { Logo } from '../components/Logo';
import Link from 'next/link';

const Home = () => {
  return (
    <div className='w-screen h-screen overflow-hidden flex justify-center items-center relative'>
      <Image src={HeroImage} alt='Hero' fill className='absolute' />
      <div className='relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm'>
        <Logo />
        <p className='pb-4'>
          AIがSEO最適化されたブログ記事を生成してくれるサービスです。
          <br />
          時間を無駄にすることなく、高品質のコンテンツを作成しましょう。
        </p>
        <Link href='/post/new' className='btn'>
          はじめる
        </Link>
      </div>
    </div>
  );
};

export default Home;
