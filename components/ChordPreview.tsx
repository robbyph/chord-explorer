import { useState } from 'react';
import guitarData from '../components/data/guitar.json';
import ReactChord from '@tombatossals/react-chords/lib/Chord';

interface ChordPreviewProps {
    chords: string[];
}

const ChordPreview = ({ chords }: ChordPreviewProps) => {

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
        <div className='p-2'>
            <h4 className='p-2 pb-0 text-xl font-medium text-center font-HindSiliguri'>Chords</h4>
            <div className='flex flex-wrap justify-center'>
                {chords.map((chord, index) => {
                    const reduced = chord.split(' ');
                    const chordBoxData = guitarData.chords[reduced[0]].find(
                        (c) => c.suffix === reduced[1].toLowerCase()
                    ).positions;
                    return (
                        <div className='relative h-32 m-2 w-28' key={index}>
                            <div className='absolute inset-0 flex items-center justify-center w-full h-full bg-gray-200 rounded-lg shadow-md'>
                                <p className='text-lg font-bold text-center text-gray-900'>
                                    {chord}
                                    <ReactChord chord={chordBoxData[0]} instrument={instrument} />
                                </p>
                            </div>
                            <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full text-sm text-gray-400'>
                                {chord ? null : 'Chord'}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default ChordPreview;
