import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';

const ChordBox = ({ value, onChange }) => {
  return (
    <div className='relative flex-shrink-0 w-16 h-16 m-2 bg-white rounded-lg shadow-md'>
      <input
        type='text'
        value={value}
        onChange={onChange}
        className='absolute inset-0 w-full h-full p-2 text-lg text-center text-gray-900 border-0 rounded-lg focus:outline-none'
      />
      <button
        type='button'
        className='absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-600 hover:text-gray-900 focus:outline-none'
        onClick={() => {}}
      >
        <PlusIcon className='w-6 h-6' />
      </button>
    </div>
  );
};

const ChordSelection = ({ chords, onChange }) => {
  console.log(chords);
  const handleChordChange = (index, value) => {
    onChange(chords.map((chord, i) => (i === index ? value : chord)));
  };

  const handleAddChord = () => {
    onChange([...chords, '']);
  };

  return (
    <div className='flex flex-wrap'>
      {chords.map((chord, index) => (
        <ChordBox
          key={index}
          value={chord}
          onChange={(event) => handleChordChange(index, event.target.value)}
        />
      ))}
      <div className='relative flex-shrink-0 w-16 h-16 m-2 bg-gray-100 rounded-lg shadow-md'>
        <button
          type='button'
          className='absolute inset-0 flex items-center justify-center w-full h-full text-lg text-gray-600 hover:text-gray-900 focus:outline-none'
          onClick={handleAddChord}
        >
          <PlusIcon className='w-6 h-6' />
        </button>
      </div>
    </div>
  );
};

export default ChordSelection;
