import { useState, useRef, useEffect } from 'react';
import { PlusIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { Popover } from '@headlessui/react';
import Alert from './Alert';
import guitarData from '../components/data/guitar.json';
import ReactChord from '@tombatossals/react-chords/lib/Chord';
import { Chord, ChordType, Key, Scale } from 'tonal';

const chordOptions = [
  'major',
  'minor',
  'dim',
  'aug',
  'sus2',
  'sus4',
  'maj7',
  'm7',
  '7',
];

const ChordBox = ({ value, onChange, isLast, deleteChord }) => {
  const [isHovering, setIsHovering] = useState(false);
  var reduced = value.split(' ');
  if (reduced[0] == 'C#') {
    reduced[0] = 'Csharp';
  } else if (reduced[0] == 'F#') {
    reduced[0] = 'Fsharp';
  }
  const chordBoxData = guitarData.chords[reduced[0]].find(
    (c) => c.suffix === reduced[1].toLowerCase()
  ).positions;

  const instrument = {
    strings: 6,
    fretsOnChord: 4,
    name: 'Guitar',
    keys: [],
    tunings: {
      standard: ['E', 'A', 'D', 'G', 'B', 'E'],
    },
  };

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => deleteChord(value)}
      className={`relative hover:cursor-pointer  ${isLast ? '' : ''}`}
    >
      <div className='relative m-2 h-44 w-28'>
        <div className='absolute inset-0 flex flex-col items-center w-full h-full bg-white rounded-lg shadow-md font-IBMPlexSans justify-top'>
          {isHovering ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='black'
              className='w-20 h-20 px-3 text-lg text-center text-gray-900 bg-transparent border-0 py-auto justify-self-center focus:outline-none '
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
              />
            </svg>
          ) : (
            <div>
              <p className='w-full px-3 py-2 text-lg text-center text-gray-900 bg-transparent border-0 focus:outline-none'>
                {value}
              </p>
              <ReactChord chord={chordBoxData[0]} instrument={instrument} />
            </div>
          )}
        </div>
        <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full text-sm text-gray-400'>
          {value ? null : 'Chord'}
        </div>
      </div>
    </div>
  );
};

const ChordSelection = ({ chords, onChange, deleteChord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    setIsOverflowing(container.scrollWidth > container.clientWidth);
    container.scrollLeft = container.scrollWidth;
  }, [chords]);

  const handleChordChange = (index, value) => {
    console.log(open());
  };

  const handleAddChord = (chord) => {
    if (chords.includes(chord)) {
      setAlertMessage('Only One of Each Chord, Please');
      setShowAlert(true);
      return;
    }
    onChange([...chords, chord]);
  };

  const getChordOptions = () => {
    var chordArray = Object.values(guitarData.chords);
    var filteredChords = [];
    chordArray.forEach((chord) =>
      chord
        .filter((c) => chordOptions.includes(c.suffix))
        .map((c) => filteredChords.push(c.key + ' ' + c.suffix))
    );
    return filteredChords;
  };

  const filteredChords = getChordOptions().filter((chord) =>
    chord.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover className='relative flex max-w-full'>
      <div
        ref={containerRef}
        className='container flex flex-row items-center py-2 overflow-x-auto'
      >
        {showAlert && <Alert setShow={setShowAlert} message={alertMessage} />}
        {chords.map((chord, index) => (
          <ChordBox
            key={index}
            value={chord}
            onChange={(event) => handleChordChange(index, event.target.value)}
            isLast={index === chords.length - 1}
            deleteChord={deleteChord}
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
      </div>
      <Popover.Panel className='absolute z-10 flex flex-wrap items-center p-2 bg-white shadow-2xl left-10 -top-44 font-IBMPlexSans'>
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
        <div className='flex flex-wrap items-center h-40 overflow-auto'>
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
