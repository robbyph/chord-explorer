import React from 'react';

export const Footer = () => {
  //returns a simple footer with a text field and a logo
  return (
    <footer className='bottom-0 flex flex-col items-center justify-center w-full mb-auto bg-white h-14'>
      <div className='text-black'>
        <p>© 2023 Chord Explorer Team. All rights reserved.</p>
      </div>
    </footer>
  );
};
