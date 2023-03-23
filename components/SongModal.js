import React from 'react';
import Head from 'next/head';
import { useRef, useEffect } from 'react';

const SongModal = ({ song, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 font-HindSiliguri'>
      <div
        ref={modalRef}
        className='relative w-3/5 pt-4 bg-white rounded h-3/4'
      >
        <button
          className='absolute text-gray-400 top-2 right-2 hover:text-gray-600'
          onClick={onClose}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
        <div className='flex flex-col justify-center p-4 text-center text-black bg-white rounded'>
          <div className='text-center'>
            <h3 className='text-3xl font-semibold font-HindSiliguri'>
              {song.data().title}
            </h3>
            <p className='text-lg font-HindSiliguri'>{song.data().artist}</p>
            <a
              className='text-blue-600 underline'
              target='_blank'
              href={song.data().songLink}
            >
              Listen Here!
            </a>
            <br />
            {song.data().tabLink && (
              <a
                className='text-blue-600 underline'
                target='_blank'
                href={song.data().tabLink}
              >
                See Tabs Here!
              </a>
            )}
          </div>
          <div className='mt-8'>
            <h3 className='text-2xl font-semibold font-HindSiliguri'>Chords</h3>
            <div className='flex flex-wrap justify-center mt-2'>
              {song.data().chords.map((chord) => (
                <div
                  key={chord}
                  className='p-2 m-2 text-gray-900 border border-t-2 rounded-lg shadow-lg w-28'
                >
                  <p className='pt-2 pb-1 text-lg font-semibold font-HindSiliguri'>
                    {chord}
                  </p>
                  <img src='https://placehold.jp/150x150.png' alt='' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongModal;
