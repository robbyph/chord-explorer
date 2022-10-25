import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <Link href='/'>
      <a href='/'>
        <span className='text-4xl'>Chord Explorer</span>
      </a>
    </Link>
  );
};

export default Header;
