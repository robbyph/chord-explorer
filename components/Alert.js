import React, { useState } from 'react';

const Alert = ({ message, setShow }) => {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <div
      className={`text-black font-bold xl:left-1/3 bg-amber-300 mt-4 xl:ml-24 top-0 z-10 fixed animate-slideup font-IBMPlexSans rounded-md`}
      css={{
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <div className='flex items-start justify-between max-w-md'>
        <span className='px-10 py-6 text-xl animate-pulse'>{message}</span>
        <button onClick={handleClose} className='px-2 py-1 font-medium'>
          X
        </button>
      </div>
    </div>
  );
};

export default Alert;
