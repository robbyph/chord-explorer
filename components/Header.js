import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <div className='z-10 mt-1'>
      <Link href='/'>
        <a className='pl-4 font-semibold text-black 2xl:pl-20 2xl:pr-8 font-HindSiliguri'>
          <span className='text-4xl xl:leading-4 whitespace-nowrap'>
            Chord Explorer
          </span>
        </a>
      </Link>
    </div>
  );
};

export default Header;
