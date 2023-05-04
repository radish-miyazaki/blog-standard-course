import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href='/' className='block text-3xl text-center py-4 font-heading hover:no-underline'>
      BlogStandard <FontAwesomeIcon icon={faBrain} className='text-2xl text-slate-400' />
    </Link>
  );
};
