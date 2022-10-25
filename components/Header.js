import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <Link href='/'>
      <a href='/' className='z-10 pr-8 font-semibold text-black pl-28'>
        <span className='text-4xl leading-5'>Chord Explorer</span>
      </a>
    </Link>
  );
};

export default Header;
