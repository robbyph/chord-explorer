import React, { useState } from 'react';
import Link from 'next/dist/client/link';

const SignInPrompt = ({ setShow }) => {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <div
      className={`text-black xl:left-1/3 bg-purple-200 mt-4 xl:ml-18 top-0 z-10 fixed animate-slideup font-IBMPlexSans px-2 pb-4 shadow-md shadow-neutral-800`}
      css={{
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <div className='flex items-start justify-between'>
        <div className='flex flex-col justify-center text-center'>
          <span className='px-10 pt-6 text-2xl font-semibold text-center '>
            You need an account to do that.
          </span>{' '}
          <span className='px-10 pt-6 text-base '>
            Wanna join the community?
          </span>{' '}
          <Link href='/signup'>
            <a className='p-4 pt-0 pb-2 text-center underline'>
              <em>Sign Up Here!</em>
            </a>
          </Link>
        </div>
        <button onClick={handleClose} className='px-2 py-1 font-medium'>
          X
        </button>
      </div>
    </div>
  );
};

export default SignInPrompt;
