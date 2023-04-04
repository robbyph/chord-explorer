import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
const HamburgerMenu = () => (
  <div className='relative p-2'>
    <Menu
      customBurgerIcon={<HamburgerIcon />}
      width={'auto'}
      className='top-0 right-0'
      right
    >
      <Links />
    </Menu>
  </div>
);

const HamburgerIcon = () => (
  <div className='p-1/2'>
    <svg
      className='w-8 h-8 text-gray-500'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path d='M4 6h16M4 12h16M4 18h16'></path>
    </svg>
  </div>
);

export const Links = () => (
  <>
    <Link href='/'>
      <a className='p-4 font-bold'>Home</a>
    </Link>
    <Link href='/search'>
      <a className='p-4 font-bold'>Search</a>
    </Link>
    <Link href='/chordlibrary'>
      <a className='p-4 font-bold'>Chord Library</a>
    </Link>
    <Link href='/givefeedback'>
      <a className='p-4 font-bold'>Give Feedback</a>
    </Link>
    <Link href='/submitfeedback'>
      <a className='p-4 font-bold'>Request Feedback</a>
    </Link>
    <Link href='/accountpage'>
      <a className='p-4 font-bold'>Account</a>
    </Link>
    <Link href='/submitsong'>
      <a className='p-4 font-bold'>Submit A Song</a>
    </Link>
    <Link href='/chordrecognition'>
      <a className='p-4 font-bold'>Chord Recognition</a>
    </Link>
  </>
);

export default HamburgerMenu;