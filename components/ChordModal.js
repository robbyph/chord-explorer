import React from 'react';
import Head from 'next/head';
import { useRef, useEffect, useState } from 'react';
import chordData from '../components/data/chordData.json';
import guitarData from '../components/data/guitar.json';
import ReactChord from '@tombatossals/react-chords/lib/Chord';
import { Chord, ChordType, Key, Note, Scale } from 'tonal';
import * as Tone from 'tone';
import Link from 'next/link';

const ChordModal = ({ chord, root, onClose }) => {
  const initializeChordName = (chord, root) => {
    if (chord === 'mmaj7') {
      return `${root} m/maj7`;
    } else {
      return `${root} ${chord}`;
    }
  };

  const modalRef = useRef();
  const chordName = initializeChordName(chord, root);
  const [scalesOpen, setScalesOpen] = useState(false);
  const [extOpen, setExtOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const [emotionOpen, setEmotionOpen] = useState(false);
  const [voicingPosition, setVoicingPosition] = useState(0);
  const [sampler, setSampler] = useState(null);
  const [samplerLoaded, setSamplerLoaded] = useState(false);

  const getTrueName = () => {
    let newChordName = chordName;
    if (chordName.includes('sharp')) {
      newChordName = chordName.replace('sharp', '#');
    } else if (chordName.includes('flat')) {
      newChordName = chordName.replace('flat', 'b');
    } else {
      newChordName = chordName;
    }

    return newChordName;
  };

  console.log(ChordType.symbols());

  const handleVoicingPositionUp = () => {
    if (
      voicingPosition <
      guitarData.chords[root].find((c) => c.suffix === chord).positions.length -
        1
    ) {
      setVoicingPosition(voicingPosition + 1);
    } else {
      setVoicingPosition(0);
    }
  };

  const handleVoicingPositionDown = () => {
    if (voicingPosition > 0) {
      setVoicingPosition(voicingPosition - 1);
    } else {
      setVoicingPosition(
        guitarData.chords[root].find((c) => c.suffix === chord).positions
          .length - 1
      );
    }
  };

  const getTrueRoot = () => {
    if (root.includes('sharp')) {
      return root.replace('sharp', '#');
    } else if (root.includes('flat')) {
      return root.replace('flat', 'b');
    } else {
      return root;
    }
  };

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
      case '7d':
        return 'Diminished 7th';
      case '8P':
        return 'Octave';
      default:
        return interval;
    }
  };

  const getProperChordSuffix = (chord) => {
    switch (chord) {
      case 'm7':
        return 'm7';
      case 'maj7':
        return 'maj7';
      case 'sus2':
        return 'sus2';
      case 'sus4':
        return 'sus4';
      case 'dim':
        return 'Diminished';
      case 'aug':
        return 'Augmented';
      case 'mmaj7':
        return 'minor/major 7th';
      case 'm7b5':
        return 'half-diminished 7th';
      case 'aug7':
        return 'augmented 7th';
      case 'maj7#5':
        return 'augmented major 7th';
      default:
        return chord.charAt(0).toUpperCase() + chord.slice(1);
    }
  };

  const getProperChordRoot = (root) => {
    switch (root) {
      case 'Csharp':
        return 'C#/Db';
      case 'Fsharp':
        return 'F#/Gb';
      case 'Eb':
        return 'D#/Eb';
      case 'Ab':
        return 'G#/Ab';
      case 'Bb':
        return 'A#/Bb';
      default:
        return root;
    }
  };

  const getProperChordName = () => {
    if (
      chord === 'm7' ||
      chord === 'maj7' ||
      chord === 'sus2' ||
      chord === 'sus4' ||
      chord == '7' ||
      chord === '7sus4'
    ) {
      return getProperChordRoot(root) + getProperChordSuffix(chord);
    } else {
      return getProperChordRoot(root) + ' ' + getProperChordSuffix(chord);
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
      case '7d':
        return 'bb7';
      case '8P':
        return '8';
      default:
        return interval;
    }
  };

  const instrument = {
    strings: 6,
    fretsOnChord: 4,
    name: 'Guitar',
    keys: [],
    tunings: {
      standard: ['E', 'A', 'D', 'G', 'B', 'E'],
    },
  };

  const scalesWithChord = () => {
    const scales = [];
    Chord.chordScales(getTrueName()).forEach((scale) => {
      var properScale = `${getTrueRoot()} ${scale}`;
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        sampler.releaseAll();
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        sampler.releaseAll();
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

  const chordBoxData = guitarData.chords[root].find(
    (c) => c.suffix === chord
  ).positions;

  const convertedIntervalsEnglish = Chord.get(getTrueName()).intervals.map(
    (interval) => {
      return convertIntervalToEnglish(interval);
    }
  );

  const convertedIntervalsNumber = Chord.get(getTrueName()).intervals.map(
    (interval) => {
      return convertIntervalToNumber(interval);
    }
  );

  const chordNotes = chordBoxData[voicingPosition].midi.map((note) => {
    return Note.fromMidi(note);
  });

  useState(() => {
    const newSampler = new Tone.Sampler({
      urls: {
        E2: '/guitarAudioFiles/lowE.wav',
        A3: '/guitarAudioFiles/A.wav',
        D3: '/guitarAudioFiles/D.wav',
        G3: '/guitarAudioFiles/G.wav',
        B3: '/guitarAudioFiles/B.wav',
        E4: '/guitarAudioFiles/highE.wav',
      },
      onload: () => {
        setSamplerLoaded(true);
        console.log('Sampler is loaded and ready to play');
      },
    }).toDestination();

    setSampler(newSampler);

    return () => {
      // dispose of the sampler when the component unmounts
      newSampler.dispose();
    };
  }, []);

  const handleButtonClick = () => {
    if (Tone.loaded() && samplerLoaded) {
      sampler.triggerAttack(chordNotes);
    }
  };

  const getChordSymbols = () => {
    let dataAliases = Chord.get(getTrueName()).aliases;
    let aliases = [...dataAliases];
    if (chord == 'major') {
      //If it's a major chord, it's incorrectly missing Δ, so this is a workaround
      aliases = [...aliases, 'Δ'];
    } else if (chord === 'maj7') {
      //If it's a major 7 chord, it's incorrectly returning Δ, so this is a workaround
      aliases = aliases.filter((alias) => alias !== 'Δ');
    }
    console.log('aliases after: ', aliases);
    console.log('aliases length: ', aliases.length);

    let formattedAliases = '';

    aliases.map((alias, i) => {
      console.log('alias length: ', aliases.length - 1);
      console.log('i: ', i);
      // if last item in array
      if (i >= aliases.length - 1) {
        formattedAliases += getTrueRoot() + alias;
      } else {
        // if not last item in array
        formattedAliases += getTrueRoot() + alias + ', ';
      }
    });

    return formattedAliases;
  };

  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 font-HindSiliguri'>
      <div
        ref={modalRef}
        className='relative pt-4 mx-4 mb-8 overflow-auto bg-white rounded md:mx-0 md:w-3/5'
        style={{
          maxHeight: 'calc(100vh - 200px)',
        }}
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
              {getProperChordName()}
            </h3>
            <p className='font-HindSiliguri'>
              {Chord.get(getTrueName()).notes.join(' - ')}
            </p>
          </div>
          <div className='flex flex-col lg:grid lg:grid-cols-6 font-HindSiliguri'>
            <div className='flex flex-col col-span-1'>
              <div className='w-64 mx-auto'>
                <ReactChord
                  chord={chordBoxData[voicingPosition]}
                  instrument={instrument}
                />
              </div>
              <div className='mt-2'>
                <button onClick={handleVoicingPositionDown} className='mr-2'>
                  ◀
                </button>{' '}
                Voicing{' '}
                <button onClick={handleVoicingPositionUp} className='ml-2'>
                  ▶
                </button>
              </div>
              <button
                onClick={handleButtonClick}
                className='mt-4 border border-black rounded hover:bg-black hover:text-white hover:cursor-pointer'
              >
                Listen
              </button>
            </div>
            <div className='flex flex-col col-span-5 text-left lg:pl-32 xl:pl-24'>
              <h3 className='pt-6 text-2xl font-semibold'>Chord Symbols</h3>
              <p className='pl-4 text-lg'>{getChordSymbols()}</p>
              <h3 className='text-2xl font-semibold'>Interval Construction</h3>
              <p className='pl-4 text-lg'>
                {convertedIntervalsEnglish.join(' - ')} (
                {convertedIntervalsNumber.join(' - ')})
              </p>
            </div>
          </div>
          <div className='flex flex-col mt-8 text-left lg:grid lg:grid-cols-4'>
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
                  {Chord.chordScales(getTrueName()).map((scale) => {
                    return (
                      <li key={scale}>
                        {getTrueRoot()} {scale}
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
                    return <li key={scale}>{scale}</li>;
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
                  {Chord.extended(getTrueName()).map((chord) => {
                    return <li key={chord}>{chord}</li>;
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
