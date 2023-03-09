//@ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { detectChords } from "../akkorder/src/index";
import { silenceRemovalAlgorithm } from "../utilities/remove_silence";
import { Tab } from '@headlessui/react'
import { Fragment } from 'react'

const ChordRecognition = () => {

    var sourceBuffer: AudioBuffer;
    var context: AudioContext;
    const [detectedChords, setDetectedChords] = useState([]);
    const [file, setFile] = useState(null)
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [recognitionWarning, setRecognitionWarning] = useState(false)
    const [submitWarning, setSubmitWarning] = useState(false)
    const [submittedIndicator, setSubmittedIndicator] = useState(false)

    //live chord detection 
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef(null);
    const audioStreamRef = useRef(null);
    const scriptNodeRef = useRef(null);
    const analyserNodeRef = useRef(null);

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

                const bufferSize = 8192;
                const mediaStreamSource = audioContextRef.current.createMediaStreamSource(stream);
                const analyserNode = audioContextRef.current.createAnalyser();
                const scriptNode = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);

                mediaStreamSource.connect(analyserNode);
                analyserNode.connect(scriptNode);
                scriptNode.connect(audioContextRef.current.destination);

                const sourceSampleRate = audioContextRef.current.sampleRate;
                const targetSampleRate = 44100;

                const bufferLength = bufferSize;
                const dataArray = new Float32Array(bufferLength);

                scriptNode.onaudioprocess = () => {
                    analyserNode.getFloatTimeDomainData(dataArray);
                    const resampledData = resampleLinear(dataArray, sourceSampleRate, targetSampleRate);
                    console.log(Array.from(resampledData))
                    const chords = detectChords(Array.from(resampledData), targetSampleRate);
                    setDetectedChords(chordFiltering(chords));
                };

                scriptNodeRef.current = scriptNode;
                analyserNodeRef.current = analyserNode;

                setIsPlaying(true);
            } catch (err) {
                console.error(err);
            }
        }
    };

    function resampleLinear(input, inputRate, outputRate) {
        const outputLength = Math.round(input.length * outputRate / inputRate);
        const output = new Float32Array(outputLength);

        for (let i = 0; i < outputLength; i++) {
            const index = i * inputRate / outputRate;
            const intIndex = Math.floor(index);
            const frac = index - intIndex;

            const a = input[intIndex];
            const b = input[intIndex + 1] || input[intIndex];

            output[i] = a * (1 - frac) + b * frac;
        }

        return output;
    }



    async function loadSound(url: string | URL) {
        context = new AudioContext();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        await context.decodeAudioData(arrayBuffer, function (buffer) {
            sourceBuffer = buffer;
        });
    }

    async function chordDetection() {
        console.log(sourceBuffer)
        if (sourceBuffer === undefined) {
            setRecognitionWarning(true)
            setSubmitWarning(false)
        } else {

            var channelData = Array.from(sourceBuffer.getChannelData(0));
            console.log(channelData)
            var channelDataSilenceRemoved = await silenceRemovalAlgorithm(channelData);
            let chords = detectChords(channelDataSilenceRemoved, 44100);
            setDetectedChords(chordFiltering(chords))
        }
    }

    function chordFiltering(chords: any[]) {
        var tempChords: any[] = []
        var uniqueChords: any[] = []

        //cull uniques
        const hash = ({ rootNote, quality, interval }) =>
            `${rootNote}:${quality}:${interval}`;

        const counts = chords.reduce((map, item) => {
            const key = hash(item);
            return ({
                ...map,
                [key]: (map[key] ?? 0) + 1,
            });
        }, {});

        uniqueChords = chords.filter((item) => counts[hash(item)] > 1);

        //cull duplicates
        tempChords = uniqueChords.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.rootNote == value.rootNote && t.quality == value.quality && t.interval == value.interval
            ))
        )

        if (tempChords.length < 1) {
            return chords
        } else {
            return tempChords;

        }
    }

    function toTextQuality(quality) {
        switch (quality) {
            case 0: return 'Minor'
                break;
            case 1: return 'Major'
                break;
            case 2: return 'Suspended'
                break;
            case 3: return 'Dominant'
                break;
            case 4: return 'Diminished'
                break;
            case 5: return 'Augmented'
                break;
            default: return '';
                break;
        }
    }

    const uploadToServer = async () => {
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

    console.log('isPlaying on click', isPlaying); // check if handlePlayClick is being called and if isPlaying state is being properly updated

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

                <Tab.Group>
                    <Tab.List>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                /* Use the `selected` state to conditionally style the selected tab. */
                                <button
                                    className={
                                        `p-2 border font-HindSiliguri font-medium xl:mr-2 ${selected ? 'bg-white text-purple-700' : 'bg-opacity-0 text-white'}`
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
                                <ul className="list-disc list-inside font-IBMPlexSans">
                                    {detectedChords.map((chord, i) => {
                                        return <li key={i}>{chord.rootNote} {toTextQuality(chord.quality)} {chord.interval != 0 ? chord.interval : ''}</li>
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
                            <h3 className="col-span-4 pt-2 text-xl underline font-HindSiliguri">Chords Detected</h3>
                            <ul className="list-disc list-inside font-IBMPlexSans">
                                {detectedChords.map((chord, i) => {
                                    return <li key={i}>{chord.rootNote} {toTextQuality(chord.quality)} {chord.interval != 0 ? chord.interval : ''}</li>
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
