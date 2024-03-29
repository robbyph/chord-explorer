import React from 'react'
import Head from 'next/head'
import { useState } from "react";
import ChordModal from '../components/ChordModal';
import guitarData from '../components/data/guitar.json'
import Chord from "@tombatossals/react-chords/lib/Chord";

const chords = ['major', 'minor', 'dim', 'aug', 'sus2', 'sus4', 'maj7', 'm7', '7']
const advancedChords = ['mmaj7', 'dim7', 'm7b5', 'aug7', 'maj7#5', '7sus4']

const ChordLibrary = () => {
    const [selectedChord, setSelectedChord] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [chordRoot, setChordRoot] = useState('C');
    const [advancedHarmonyEnabled, setAdvancedHarmonyEnabled] = useState(false);

    console.log(guitarData.chords[chordRoot])

    const handleChange = (event) => {
        setChordRoot(event.target.value);
    };

    const getChordBox = (chordSuffix: string) => {
        var data = guitarData.chords[chordRoot].find((chord) => chord.suffix === chordSuffix).positions[0]
        return data
    }

    const instrument = {
        strings: 6,
        fretsOnChord: 4,
        name: 'Guitar',
        keys: [],
        tunings: {
            standard: ['E', 'A', 'D', 'G', 'B', 'E']
        }
    }

    const getProperChordSuffix = (chord) => {
        switch (chord) {
            case 'm7':
                return 'm7'
            case 'maj7':
                return 'maj7'
            case 'sus2':
                return 'sus2'
            case 'sus4':
                return 'sus4'
            case 'dim':
                return 'Diminished'
            case 'aug':
                return 'Augmented'
            case 'mmaj7':
                return 'm/maj7'
            case 'dim7':
                return 'diminished 7th'
            case 'm7b5':
                return 'half-diminished 7th';
            case 'aug7':
                return 'augmented 7th'
            case 'maj7#5':
                return 'augmented major 7th'
            default: return chord.charAt(0).toUpperCase() + chord.slice(1)
        }
    }

    const getProperChordRoot = (root) => {
        switch (root) {
            case 'Csharp':
                return 'C#/Db'
            case 'Fsharp':
                return 'F#/Gb'
            case 'Eb':
                return 'D#/Eb'
            case 'Ab':
                return 'G#/Ab'
            case 'Bb':
                return 'A#/Bb'
            default: return root
        }
    }

    const getChordName = (chord) => {
        console.log(chord)
        if (chord === 'm7' || chord === 'maj7' || chord === 'sus2' || chord === 'sus4' || chord == '7' ||
            chord === 'mmaj7' || chord === '7sus4') {
            return getProperChordRoot(chordRoot) + getProperChordSuffix(chord)
        }
        else {
            return getProperChordRoot(chordRoot) + ' ' + getProperChordSuffix(chord)
        }
    }

    return (
        <div className="min-h-screen">
            <Head>
                <title>Chord Explorer</title>
                <meta
                    name="description"
                    content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {modalOpen &&
                    <ChordModal
                        chord={selectedChord}
                        onClose={() => setModalOpen(false)}
                        root={chordRoot}
                    />}
                <h1 className="col-span-12 p-6 text-4xl font-semibold font-HindSiliguri">Chord Library</h1>
                <div className="flex flex-col px-4 mb-4 lg:w-1/6" id="parameters">
                    <label className="mb-1 ml-1 font-semibold" htmlFor="chordRoot">Chord Root</label>
                    <select value={chordRoot} name="chordRoot" id="chordRootSelect" className="h-10 px-3 mb-2 border-gray-300 rounded" onChange={handleChange}>
                        <option value="C">C</option>
                        <option value="Csharp">C#/Db</option>
                        <option value="D">D</option>
                        <option value="Eb">D#/Eb</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="Fsharp">F#/Gb</option>
                        <option value="G">G</option>
                        <option value="Ab">G#/Ab</option>
                        <option value="A">A</option>
                        <option value="Bb">A#/Bb</option>
                        <option value="B">B</option>
                    </select>
                    <div>
                        <input type="checkbox" name="advancedHarmony" id="advancedHarmony" onChange={() => {
                            setAdvancedHarmonyEnabled(!advancedHarmonyEnabled)
                        }} style={{ display: 'inline' }} />
                        <label className="mb-1 ml-1 font-semibold" htmlFor="advancedHarmony" style={{ display: 'inline' }}>Enable Advanced Harmony?</label>
                    </div>
                </div>
                <h2 className="col-span-4 p-6 text-3xl font-semibold font-HindSiliguri">
                    Chords
                </h2>
                <div className="flex flex-col gap-4 px-4 mb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 justify-items-stretch">
                    {chords.map((chord) => {
                        var chordBoxData = getChordBox(chord)
                        return (
                            <div key={chord} className="flex flex-col p-4 text-center text-black bg-white rounded">
                                <h3 className="pb-2 text-3xl font-semibold font-HindSiliguri">{getChordName(chord)}</h3>
                                <div className='w-64 mx-auto'><Chord chord={chordBoxData} instrument={instrument} /></div>
                                <button onClick={() => {
                                    setSelectedChord(chord);
                                    setModalOpen(true);
                                }} className={`p-2 mt-4 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium hover:text-white hover:bg-[#5B21B6]`}>Read More & Listen</button>
                            </div>
                        )
                    })}
                    {advancedHarmonyEnabled && advancedChords.map((chord) => {
                        var chordBoxData = getChordBox(chord)
                        return (
                            <div key={chord} className="flex flex-col p-4 text-center text-black bg-white rounded">
                                <h3 className="pb-2 text-3xl font-semibold font-HindSiliguri">{getChordName(chord)}</h3>
                                <div className='w-64 mx-auto'><Chord chord={chordBoxData} instrument={instrument} /></div>
                                <button onClick={() => {
                                    setSelectedChord(chord);
                                    setModalOpen(true);
                                }} className={`p-2 mt-4 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium hover:text-white hover:bg-[#5B21B6]`}>Read More & Listen</button>
                            </div>
                        )
                    })
                    }
                </div>
            </main>
        </div>
    )
}

export default ChordLibrary