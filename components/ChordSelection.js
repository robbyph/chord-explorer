import { useState, useRef, useEffect } from 'react';
import { PlusIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { Popover } from '@headlessui/react';

const ChordBox = ({ value, onChange, isLast }) => {
  return (
    <div className={`relative ${isLast ? '' : ''}`}>
      <div className='relative m-2 h-44 w-28'>
        <div className='absolute inset-0 flex flex-col items-center w-full h-full bg-white rounded-lg shadow-md font-IBMPlexSans justify-top'>
          <input
            type='text'
            value={value}
            onChange={onChange}
            className='w-full px-3 py-2 text-lg text-center text-gray-900 bg-transparent border-0 focus:outline-none'
          />
          <img src='https://placehold.jp/150x150.png' alt='' />
        </div>
        <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full text-sm text-gray-400'>
          {value ? null : 'Chord'}
        </div>
      </div>
    </div>
  );
};

const ChordSelection = ({ chords, onChange }) => {
  const CHORD_OPTIONS = ['G Major', 'B Minor', 'C Major', 'D Minor', 'E Minor'];
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    setIsOverflowing(container.scrollWidth > container.clientWidth);
    container.scrollLeft = container.scrollWidth;
  }, [chords]);

  const handleChordChange = (index, value) => {
    console.log(open());
  };

  const handleAddChord = (chord) => {
    onChange([...chords, chord]);
  };

  const filteredChords = CHORD_OPTIONS.filter((chord) =>
    chord.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover className='relative flex max-w-full'>
      <div
        ref={containerRef}
        className='container flex flex-row items-center py-2 overflow-x-auto'
      >
        {chords.map((chord, index) => (
          <ChordBox
            key={index}
            value={chord}
            onChange={(event) => handleChordChange(index, event.target.value)}
            isLast={index === chords.length - 1}
          />
        ))}

        <Popover.Button className='relative flex-shrink-0 ml-2 text-gray-400 bg-gray-200 rounded-lg shadow-md w-28 h-44 hover:bg-gray-300 focus:outline-none'>
          {({ open }) => (
            <span className='absolute inset-0 flex flex-col items-center justify-center'>
              {open ? (
                <ChevronUpIcon className='w-6 h-6' />
              ) : (
                <PlusIcon className='w-6 h-6' />
              )}
              <span className='text-xs font-medium text-gray-700'>
                Add chords
              </span>
            </span>
          )}
        </Popover.Button>

        {chords.length === 0 && (
          <div className='ml-2 text-sm text-gray-400'>No chords</div>
        )}
      </div>
      <Popover.Panel className='absolute z-10 flex flex-wrap items-center bg-white shadow-2xl left-10 -top-40 font-IBMPlexSans'>
        <div className='relative w-full h-16 m-2 shadow-lg'>
          <div className='absolute inset-0 flex items-center justify-center w-full h-full bg-gray-200 rounded-lg shadow-md'>
            <input
              type='text'
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className='w-full px-3 py-2 text-lg text-center text-gray-900 bg-transparent border-0 focus:outline-none'
              placeholder='Search chords...'
            />
          </div>
        </div>
        <div className='flex flex-wrap items-center'>
          {filteredChords.map((chord) => (
            <button
              key={chord}
              type='button'
              className='h-16 m-2 text-gray-900 rounded-lg shadow-md w-28 hover:bg-gray-200 focus:outline-none'
              onClick={() => handleAddChord(chord)}
            >
              {chord}
            </button>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default ChordSelection;
