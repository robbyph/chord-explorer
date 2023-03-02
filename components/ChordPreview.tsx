import { useState } from 'react';

interface ChordPreviewProps {
    chords: string[];
}

const ChordPreview = ({ chords }: ChordPreviewProps) => {
    return (
        <div className='p-2'>
            <h4 className='p-2 pb-0 text-xl font-medium text-center font-HindSiliguri'>Chords</h4>
            <div className='flex flex-wrap justify-center'>
                {chords.map((chord, index) => (
                    <div className='relative w-20 h-16 m-2' key={index}>
                        <div className='absolute inset-0 flex items-center justify-center w-full h-full bg-gray-200 rounded-lg shadow-md'>
                            <p className='text-lg font-bold text-center text-gray-900'>
                                {chord}
                            </p>
                        </div>
                        <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full text-sm text-gray-400'>
                            {chord ? null : 'Chord'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChordPreview;
