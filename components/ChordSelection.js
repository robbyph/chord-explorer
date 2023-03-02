import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import { Popover } from '@headlessui/react';

const ChordBox = ({ value, onChange, isLast }) => {
  return (
    <div className={`relative ${isLast ? '' : ''}`}>
      <div className='relative w-20 h-16 m-2'>
        <div className='absolute inset-0 flex items-center justify-center w-full h-full bg-gray-200 rounded-lg shadow-md'>
          <input
            type='text'
            value={value}
            onChange={onChange}
            className='w-full px-3 py-2 text-lg text-center text-gray-900 bg-transparent border-0 focus:outline-none'
          />
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChordChange = (index, value) => {
    onChange(chords.map((chord, i) => (i === index ? value : chord)));
  };

  const handleAddChord = (chord) => {
    onChange([...chords, chord]);
    setIsOpen(false);
  };

  const filteredChords = CHORD_OPTIONS.filter((chord) =>
    chord.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover className='relative flex flex-wrap items-center'>
      {chords.map((chord, index) => (
        <ChordBox
          key={index}
          value={chord}
          onChange={(event) => handleChordChange(index, event.target.value)}
          isLast={index === chords.length - 1}
        />
      ))}
      <Popover.Button className='relative w-20 h-16 ml-2 text-gray-400 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none'>
        <span className='absolute inset-0 flex flex-col items-center justify-center'>
          <PlusIcon className='w-6 h-6' />
          <span className='text-xs font-medium text-gray-700'>Add chord</span>
        </span>
      </Popover.Button>
      {chords.length === 0 && (
        <div className='ml-2 text-sm text-gray-400'>No chords</div>
      )}
      <Popover.Panel className='absolute z-10 flex flex-wrap items-center bg-white font-IBMPlexSans'>
        <div className='relative w-full h-16 m-2'>
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
              className='w-20 h-16 m-2 text-gray-900 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none'
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
