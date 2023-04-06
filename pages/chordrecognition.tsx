//@ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { detectChords, detectChordsLive } from "../akkorder/src/index";
import { silenceRemovalAlgorithm } from "../utilities/remove_silence";
import { Tab } from '@headlessui/react'
import { Fragment } from 'react'
import Alert from '../components/Alert'
import { Chromagram } from "../akkorder/src/index";
import guitarData from '../components/data/guitar.json'
import ReactChord from "@tombatossals/react-chords/lib/Chord";


const ChordRecognition = () => {
    var sourceBuffer: AudioBuffer;
    var context: AudioContext;
    const [detectedChords, setDetectedChords] = useState([]);
    const [file, setFile] = useState(null)
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [recognitionWarning, setRecognitionWarning] = useState(false)
    const [submitWarning, setSubmitWarning] = useState(false)
    const [submittedIndicator, setSubmittedIndicator] = useState(false)
    const [loading, setLoading] = useState(false)

    const [debugCounter, setDebugCounter] = useState(0)
    const [debugCorrectCounter, setDebugCorrectCounter] = useState(0)

    //live chord detection 
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef(null);
    const audioStreamRef = useRef(null);
    const scriptNodeRef = useRef(null);
    const analyserNodeRef = useRef(null);
    const gainNodeRef = useRef(null);
    const lowEQNodeRef = useRef(null);

    const handlePlayClick = async () => {
        if (isPlaying) {
            setIsPlaying(false);
            if (scriptNodeRef.current && analyserNodeRef.current) {
                scriptNodeRef.current.disconnect(); // remove the onaudioprocess event listener
                analyserNodeRef.current.disconnect();
            }
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioStreamRef.current = stream;
                audioContextRef.current = new AudioContext();

                const bufferSize = 16384;
                const mediaStreamSource = audioContextRef.current.createMediaStreamSource(stream);
                const analyserNode = audioContextRef.current.createAnalyser();
                const scriptNode = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);

                mediaStreamSource.connect(analyserNode);
                analyserNode.connect(scriptNode);
                scriptNode.connect(audioContextRef.current.destination);

                const dataArray = new Float32Array(bufferSize);
                const threshold = 0.001; // set threshold value here

                console.log(audioContextRef.current.sampleRate)

                scriptNode.onaudioprocess = () => {
                    analyserNode.getFloatTimeDomainData(dataArray);
                    const amplitude = dataArray.reduce((acc, val) => acc + Math.abs(val)) / bufferSize; // calculate the amplitude
                    if (amplitude > threshold) { // execute the logic only if amplitude is above threshold
                        setDebugCounter(prevCounter => prevCounter + 1)
                        const chords = detectChordsLive(Array.from(dataArray), 44100, bufferSize);
                        if (chords[0].rootNote === "G" && chords[0].quality === 1) {
                            setDebugCorrectCounter(prevCounter => prevCounter + 1)
                        }

                        setDetectedChords(chordFiltering(chords));
                    }
                };

                scriptNodeRef.current = scriptNode;
                analyserNodeRef.current = analyserNode;

                setIsPlaying(true);
            } catch (err) {
                console.error(err);
            }
        }
    };

    console.log('chords logged: ', debugCounter)
    console.log('correct chords logged: ', debugCorrectCounter)
    console.log('accuracy: ', debugCorrectCounter / debugCounter * 100 + '%')
    console.log('outputted chords: ', detectedChords)


    async function loadSound(url: string | URL) {
        context = new AudioContext();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        await context.decodeAudioData(arrayBuffer, function (buffer) {
            sourceBuffer = buffer;
        });
    }

    async function chordDetection() {
        if (sourceBuffer === undefined) {
            setRecognitionWarning(true)
            setSubmitWarning(false)
        } else {
            var channelData = Array.from(sourceBuffer.getChannelData(0));
            var channelDataSilenceRemoved = await silenceRemovalAlgorithm(channelData);
            let chords = detectChords(channelDataSilenceRemoved, 44100);
            setDetectedChords(chordFiltering(chords))
            setLoading(false)
        }
    }

    function chordFiltering(chords: any[]) {
        var tempChords: any[] = [];
        var uniqueChords: any[] = [];

        //cull uniques
        const hash = ({ rootNote, quality, interval }) =>
            `${rootNote}:${quality}:${interval}`;

        const counts = chords.reduce((map, item) => {
            const key = hash(item);
            return {
                ...map,
                [key]: (map[key] ?? 0) + 1,
            };
        }, {});

        uniqueChords = chords.filter((item) => counts[hash(item)] > 1);

        //cull duplicates
        tempChords = uniqueChords.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    (t) =>
                        t.rootNote == value.rootNote &&
                        t.quality == value.quality &&
                        t.interval == value.interval
                )
        );

        if (tempChords.length < 1) {
            return chords;
        } else {
            return tempChords;
        }
    }

    function toTextQuality(quality) {
        switch (quality) {
            case 0:
                return "minor";
                break;
            case 1:
                return "major";
                break;
            case 2:
                return "sus";
                break;
            case 3:
                return "7";
                break;
            case 4:
                return "dim";
                break;
            case 5:
                return "aug";
                break;
            default:
                return "";
                break;
        }
    }

    const uploadToServer = async () => {
        setLoading(true)
        setRecognitionWarning(false)
        if (file === null) {
            setSubmitWarning(true)
        } else {
            const body = new FormData()
            body.append("file", file)
            await fetch("/api/file", {
                method: "POST",
                body
            })
            await loadSound(createObjectURL).then(() => {
                chordDetection();
            });
            setSubmittedIndicator(false)
        }
    }

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setFile(i);
            setCreateObjectURL(URL.createObjectURL(i));
            setSubmitWarning(false)
            setSubmittedIndicator(true)
        }
    };



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
            default: return chord.charAt(0).toUpperCase() + chord.slice(1)
        }
    }



    const getChordName = (chord) => {
        if (chord.interval == 7 || chord.interval == 2 || chord.interval == 4) {
            return chord.rootNote + ' ' + getProperChordSuffix(toTextQuality(chord.quality)) + chord.interval
        }
        else {
            return chord.rootNote + ' ' + getProperChordSuffix(toTextQuality(chord.quality))
        }
    }



    return (
        <div>
            <Head>
                <title>Chord Recognition</title>
                <meta
                    name="description"
                    content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="p-6 m-2">
                <h1 className="col-span-4 text-4xl font-semibold font-HindSiliguri">Chord Recognition</h1>
                <h2 className="col-span-4 pb-4 text-2xl font-HindSiliguri">Powered by AI</h2>
                {loading && <Alert message='Loading, Please Wait...' setShow={setLoading} />}

                <Tab.Group>
                    <Tab.List>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                /* Use the `selected` state to conditionally style the selected tab. */
                                <button
                                    className={
                                        `p-2 border font-HindSiliguri font-medium xl:mr-2 ${selected ? 'bg-white text-purple-700' : 'bg-opacity-0 text-white'}`
                                    }
                                    onClick={() => {
                                        setDetectedChords([]);
                                        setIsPlaying(false);
                                    }
                                    }
                                >
                                    Live Chord Recognition
                                </button>
                            )}</Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                /* Use the `selected` state to conditionally style the selected tab. */
                                <button
                                    className={
                                        `p-2 border font-HindSiliguri font-medium xl:mr-2 ${selected ? 'bg-white text-purple-700' : 'bg-opacity-0 text-white'}`
                                    }
                                    onClick={() => {
                                        setDetectedChords([]);
                                        setIsPlaying(false);
                                    }}
                                >
                                    Chord Recognition from a File
                                </button>
                            )}</Tab>
                    </Tab.List>
                    <Tab.Panels className='pt-0 mt-2'>
                        <Tab.Panel>
                            <div>
                                <div className="col-span-4 p-2 pl-0 m-2 mb-2 ml-0 ">
                                    <h2 className="col-span-4 pt-2 mb-2 text-2xl font-HindSiliguri">Click Start to begin detecting chords</h2>
                                    <h3 className="col-span-4 mb-2 text-base font-HindSiliguri"><em>Please allow microphone access</em></h3>
                                    {/* {submitWarning ? <p className="font-bold text-red-500"> Please upload an audio file before generating chord data...</p> : ''}
                                    {recognitionWarning ? <p className="font-bold text-red-500">Please upload an audio file before generating chord data...</p> : ''}
                                    {submittedIndicator ? <p className="font-bold text-white">Uploaded!</p> : ''}
                                    <input type="file" name="myImage" className="my-2" onChange={uploadToClient} /> <br /> */}
                                </div>
                                <button className={
                                    `py-2 px-4 border mb-2 font-HindSiliguri font-medium xl:mr-2 ${isPlaying ? 'bg-white text-purple-600' : 'bg-opacity-0 text-white'}`
                                } onClick={handlePlayClick}>{isPlaying ? 'Stop' : 'Start'}</button>
                                <h3 className="col-span-4 pt-2 text-xl underline font-HindSiliguri">Chord Detected</h3>
                                <ul className="flex flex-col mt-4 lg:grid lg:grid-cols-6 lg:gap-4 font-IBMPlexSans">
                                    {detectedChords.map((chord, i) => {
                                        let textQuality = toTextQuality(chord.quality);
                                        let chordQuality = textQuality + (chord.interval != 0 ? chord.interval : '')
                                        var reduced = [chord.rootNote, chordQuality]
                                        // console.log(reduced)
                                        // console.log(guitarData.chords)
                                        if (reduced[0] == 'C#/Db') {
                                            reduced[0] = 'Csharp';
                                        } else if (reduced[0] == 'F#/Gb') {
                                            reduced[0] = 'Fsharp';
                                        } else if (reduced[0] == 'G#/Ab') {
                                            reduced[0] = 'Ab';
                                        } else if (reduced[0] == 'A#/Bb') {
                                            reduced[0] = 'Bb';
                                        } else if (reduced[0] == 'D#/Eb') {
                                            reduced[0] = 'Eb';
                                        }

                                        if (reduced[1] == 'major7') {
                                            reduced[1] = 'maj7';
                                        } else if (reduced[1] == 'minor7') {
                                            reduced[1] = 'm7';
                                        } else if (reduced[1] == 'dominant7') {
                                            reduced[1] = '7';
                                        }
                                        const chordBoxData = guitarData.chords[reduced[0]].find(
                                            (c) => c.suffix === reduced[1].toLowerCase()
                                        ).positions;
                                        return (
                                            <div key={chord} className="flex flex-col p-4 text-center text-black bg-white rounded">
                                                <h3 className="pb-2 text-2xl font-medium font-HindSiliguri">{getChordName(chord)}</h3>
                                                <div className='w-56 mx-auto'>
                                                    <ReactChord
                                                        chord={chordBoxData[0]}
                                                        instrument={instrument}
                                                    /></div>
                                            </div>
                                        )
                                    })}
                                </ul>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="col-span-4 p-2 pl-0 m-2 mb-8 ml-0 ">
                                <h2 className="col-span-4 pt-2 mb-2 text-2xl font-HindSiliguri">First, Upload an MP3 or WAV Audio File</h2>
                                {submitWarning ? <p className="font-bold text-red-500"> Please upload an audio file before generating chord data...</p> : ''}
                                {recognitionWarning ? <p className="font-bold text-red-500">Please upload an audio file before generating chord data...</p> : ''}
                                {submittedIndicator ? <p className="font-bold text-white">Uploaded!</p> : ''}
                                <input type="file" name="myImage" className="my-2" onChange={uploadToClient} /> <br />
                            </div>
                            <h2 className="col-span-4 pt-2 mb-2 text-2xl font-HindSiliguri">Then, let the AI do the rest</h2>
                            <button className="col-span-4 px-2 py-2 text-xl border font-IBMPlexSans font-medium bg-white text-[#5B21B6]" onClick={() => uploadToServer()}>Detect Chords</button>
                            <h3 className="col-span-4 pt-2 mt-6 text-2xl underline font-HindSiliguri">Chords Detected</h3>
                            <ul className="flex flex-col mt-4 lg:grid lg:grid-cols-6 lg:gap-4 font-IBMPlexSans">
                                {detectedChords.map((chord, i) => {
                                    let textQuality = toTextQuality(chord.quality);
                                    let chordQuality = textQuality + (chord.interval != 0 ? chord.interval : '')
                                    var reduced = [chord.rootNote, chordQuality]
                                    // console.log(reduced)
                                    // console.log(guitarData.chords)
                                    if (reduced[0] == 'C#/Db') {
                                        reduced[0] = 'Csharp';
                                    } else if (reduced[0] == 'F#/Gb') {
                                        reduced[0] = 'Fsharp';
                                    } else if (reduced[0] == 'G#/Ab') {
                                        reduced[0] = 'Ab';
                                    } else if (reduced[0] == 'A#/Bb') {
                                        reduced[0] = 'Bb';
                                    } else if (reduced[0] == 'D#/Eb') {
                                        reduced[0] = 'Eb';
                                    }

                                    if (reduced[1] == 'major7') {
                                        reduced[1] = 'maj7';
                                    } else if (reduced[1] == 'minor7') {
                                        reduced[1] = 'm7';
                                    } else if (reduced[1] == 'dominant7') {
                                        reduced[1] = '7';
                                    }

                                    const chordBoxData = guitarData.chords[reduced[0]].find(
                                        (c) => c.suffix === reduced[1].toLowerCase()
                                    ).positions;
                                    return (
                                        <div key={chord} className="flex flex-col p-4 text-center text-black bg-white rounded">
                                            <h3 className="pb-2 text-2xl font-medium font-HindSiliguri">{getChordName(chord)}</h3>
                                            <div className='w-56 mx-auto'>
                                                <ReactChord
                                                    chord={chordBoxData[0]}
                                                    instrument={instrument}
                                                /></div>
                                        </div>
                                    )
                                })}
                            </ul>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

            </main>
        </div>
    );
};

export default ChordRecognition;
