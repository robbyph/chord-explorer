import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';

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
  const handleChordChange = (index, value) => {
    onChange(chords.map((chord, i) => (i === index ? value : chord)));
  };

  const handleAddChord = () => {
    onChange([...chords, '']);
  };

  return (
    <div className='flex flex-wrap items-center'>
      {chords.map((chord, index) => (
        <div key={index} className='relative flex-none w-20 h-16 m-2'>
          <div className='absolute inset-0 flex items-center justify-center w-full h-full bg-gray-200 rounded-lg shadow-md'>
            <input
              type='text'
              value={chord}
              onChange={(event) => handleChordChange(index, event.target.value)}
              className='w-full px-3 py-2 text-lg text-center text-gray-900 bg-transparent border-0 focus:outline-none'
            />
          </div>
          <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full text-sm text-gray-400'>
            {chord ? null : 'Chord'}
          </div>
        </div>
      ))}

      <div className='flex-auto'>
        <button
          type='button'
          className='relative w-20 h-16 ml-2 text-gray-400 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none'
          onClick={handleAddChord}
        >
          <span className='absolute inset-0 flex flex-col items-center justify-center'>
            <PlusIcon className='w-6 h-6' />
            <span className='text-xs font-medium text-gray-700'>Add chord</span>
          </span>
        </button>
      </div>

      {chords.length === 0 && (
        <div className='ml-2 text-sm text-gray-400'>No chords</div>
      )}
    </div>
  );
};

export default ChordSelection;
