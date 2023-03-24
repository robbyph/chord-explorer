import React from 'react';
import Head from 'next/head';
import { useRef, useEffect, useState } from 'react';
import { Chord, ChordType, Key, Scale } from 'tonal';
import chordData from '../components/data/chordData.json';

const ChordModal = ({ chord, root, onClose }) => {
  const modalRef = useRef();
  const chordName = `${root} ${chord}`;
  const [scalesOpen, setScalesOpen] = useState(false);
  const [extOpen, setExtOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const [emotionOpen, setEmotionOpen] = useState(false);

  const convertIntervalToEnglish = (interval) => {
    switch (interval) {
      case '1P':
        return 'Root';
      case '2m':
        return 'Minor 2nd';
      case '2M':
        return 'Major 2nd';
      case '3m':
        return 'Minor 3rd';
      case '3M':
        return 'Major 3rd';
      case '4P':
        return 'Perfect 4th';
      case '4A':
        return 'Augmented 4th';
      case '5d':
        return 'Diminished 5th';
      case '5P':
        return 'Perfect 5th';
      case '5A':
        return 'Augmented 5th';
      case '6m':
        return 'Minor 6th';
      case '6M':
        return 'Major 6th';
      case '7m':
        return 'Minor 7th';
      case '7M':
        return 'Major 7th';
      case '8P':
        return 'Octave';
      default:
        return interval;
    }
  };

  const convertIntervalToNumber = (interval) => {
    switch (interval) {
      case '1P':
        return '1';
      case '2m':
        return 'b2';
      case '2M':
        return '2';
      case '3m':
        return 'b3';
      case '3M':
        return '3';
      case '4P':
        return '4';
      case '4A':
        return '#4';
      case '5d':
        return 'b5';
      case '5P':
        return '5';
      case '5A':
        return '#5';
      case '6m':
        return 'b6';
      case '6M':
        return '6';
      case '7m':
        return 'b7';
      case '7M':
        return '7';
      case '8P':
        return '8';
      default:
        return interval;
    }
  };

  const scalesWithChord = () => {
    const scales = [];
    Chord.chordScales(chordName).forEach((scale) => {
      var properScale = `${root} ${scale}`;
      var modes = Scale.modeNames(properScale);
      modes.forEach((mode) => {
        var joinedMode = mode.join(' ');
        if (joinedMode === properScale) {
          return;
        } else {
          scales.push(joinedMode);
        }
      });
    });
    return scales;
  };

  const convertedIntervalsEnglish = Chord.get(chordName).intervals.map(
    (interval) => {
      return convertIntervalToEnglish(interval);
    }
  );

  const convertedIntervalsNumber = Chord.get(chordName).intervals.map(
    (interval) => {
      return convertIntervalToNumber(interval);
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
        className='relative w-3/5 pt-4 mb-8 overflow-auto bg-white rounded h-3/4'
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
          <div className='mb-4 text-center'>
            <h3 className='text-3xl font-semibold font-HindSiliguri'>
              {root} {chord.charAt(0).toUpperCase() + chord.slice(1)}
            </h3>
            <p className='font-HindSiliguri'>
              {Chord.get(chordName).notes.join(' - ')}
            </p>
          </div>
          <div className='grid grid-cols-6 font-HindSiliguri'>
            <div className='flex flex-col col-span-1'>
              <img
                className='w-40 mx-auto'
                src='https://placehold.jp/150x150.png'
                alt=''
              />
              <div className='mt-2'>
                <button className='mr-2'>◀</button> Voicing{' '}
                <button className='ml-2'>▶</button>
              </div>
              <div className='mt-4 border border-black rounded hover:bg-black hover:text-white hover:cursor-pointer'>
                Listen
              </div>
            </div>
            <div className='flex flex-col col-span-5 pl-24 text-left'>
              <h3 className='pt-6 text-2xl font-semibold'>Chord Symbols</h3>
              <p className='pl-4 text-lg'>
                {Chord.get(chordName).aliases.map((alias, i) => {
                  if (i >= Chord.get(chordName).aliases.length - 1) {
                    return root + alias;
                  } else {
                    return root + alias + ', ';
                  }
                })}
              </p>
              <h3 className='text-2xl font-semibold'>Interval Construction</h3>
              <p className='pl-4 text-lg'>
                {convertedIntervalsEnglish.join(' - ')} (
                {convertedIntervalsNumber.join(' - ')})
              </p>
            </div>
          </div>
          <div className='grid grid-cols-4 mt-8 text-left'>
            <div>
              <h3
                className='text-xl font-semibold cursor-pointer'
                onClick={() => setScalesOpen(!scalesOpen)}
              >
                <span className='text-lg '>{scalesOpen ? '▼ ' : '▶ '}</span>
                Root Scales
              </h3>
              {scalesOpen && (
                <ul className='pl-4'>
                  {Chord.chordScales(chordName).map((scale) => {
                    return (
                      <li>
                        {root} {scale}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div>
              <h3
                className='text-xl font-semibold cursor-pointer'
                onClick={() => setKeysOpen(!keysOpen)}
              >
                <span className='text-lg '>{keysOpen ? '▼ ' : '▶ '}</span>
                Also Found In
              </h3>
              {keysOpen && (
                <ul className='pl-4'>
                  {scalesWithChord().map((scale) => {
                    return <li>{scale}</li>;
                  })}
                </ul>
              )}
            </div>
            <div>
              <h3
                className='text-xl font-semibold cursor-pointer'
                onClick={() => setEmotionOpen(!emotionOpen)}
              >
                <span className='text-lg '>{emotionOpen ? '▼ ' : '▶ '}</span>
                Emotional Cliches
              </h3>
              {emotionOpen && (
                <ul className='pl-4'>
                  {chordData
                    .find((crd) => crd.quality === chord)
                    .emotional_cliches.map((cliche) => {
                      return (
                        <li key={cliche}>
                          {cliche.charAt(0).toUpperCase() + cliche.slice(1)}
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            <div>
              <h3
                className='text-xl font-semibold cursor-pointer'
                onClick={() => setExtOpen(!extOpen)}
              >
                <span className='text-lg '>{extOpen ? '▼ ' : '▶ '}</span>
                Extensions to Explore
              </h3>
              {extOpen && (
                <ul className='pl-4'>
                  {Chord.extended(chordName).map((chord) => {
                    return <li>{chord}</li>;
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChordModal;
