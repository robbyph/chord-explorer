import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <Link href='/'>
      <a className='z-10 pl-24 pr-8 font-semibold text-black font-HindSiliguri'>
        <span className='text-4xl leading-5'>Chord Explorer</span>
      </a>
    </Link>
  );
};

export default Header;
