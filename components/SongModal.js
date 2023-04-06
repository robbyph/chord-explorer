import React from 'react';
import Head from 'next/head';
import { useRef, useEffect } from 'react';
import guitarData from '../components/data/guitar.json';
import ReactChord from '@tombatossals/react-chords/lib/Chord';
import { Chord, ChordType, Key, Scale } from 'tonal';
import { useDocument } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/firestore';
import { doc } from 'firebase/firestore';

const SongModal = ({ song, onClose }) => {
  const modalRef = useRef();

  console.log(song);

  const instrument = {
    strings: 6,
    fretsOnChord: 4,
    name: 'Guitar',
    keys: [],
    tunings: {
      standard: ['E', 'A', 'D', 'G', 'B', 'E'],
    },
  };

  const [author, accountLoading, accountError] = useDocument(
    doc(db, 'Users', song.data.author),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 font-HindSiliguri'>
      <div
        ref={modalRef}
        className='relative w-3/5 pt-4 overflow-y-auto bg-white rounded h-3/4'
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
              {song.data.title}
            </h3>
            <p className='text-lg font-HindSiliguri'>{song.data.artist}</p>
            <a
              className='text-blue-600 underline'
              target='_blank'
              rel='noreferrer'
              href={song.data.songLink}
            >
              Listen Here!
            </a>
            <br />
            {song.data.tabLink && (
              <a
                className='text-blue-600 underline'
                target='_blank'
                rel='noreferrer'
                href={song.data.tabLink}
              >
                See Tabs Here!
              </a>
            )}
          </div>
          <div className='mt-8'>
            <h3 className='text-2xl font-semibold font-HindSiliguri'>Chords</h3>
            <div className='flex flex-wrap justify-center mt-2'>
              {song.data.chords.map((chord) => {
                var reduced = chord.split(' ');
                if (reduced[0] == 'C#') {
                  reduced[0] = 'Csharp';
                } else if (reduced[0] == 'F#') {
                  reduced[0] = 'Fsharp';
                }
                const chordBoxData = guitarData.chords[reduced[0]].find(
                  (c) => c.suffix === reduced[1].toLowerCase()
                ).positions;
                return (
                  <div
                    key={chord}
                    className='p-2 m-2 text-gray-900 border border-t-2 rounded-lg shadow-lg w-44'
                  >
                    <p className='pt-2 pb-1 text-lg font-semibold font-HindSiliguri'>
                      {chord}
                    </p>
                    <ReactChord
                      chord={chordBoxData[0]}
                      instrument={instrument}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {author && (
            <p className='mt-8 text-sm text-gray-600 font-HindSiliguri'>
              Submitted by {author?.data().username}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongModal;
