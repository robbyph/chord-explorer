import React, { useEffect, useState } from "react";
import Head from "next/head";
import { detectChords } from "../akkorder/src/index";

const chordrecognition = () => {

    var sourceBuffer: AudioBuffer;
    var context: AudioContext;
    const [detectedChords, setDetectedChords] = useState([]);

    function loadSound(url: string | URL) {
        context = new AudioContext();
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        // Decode asynchronously
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                sourceBuffer = buffer;
            });
        }
        request.send();

    }

    useEffect(() => {
        loadSound('example2.mp3')
    }, [])

    function chordDetection() {
        console.log(sourceBuffer)
        var channelData = Array.from(sourceBuffer.getChannelData(0));
        let chords = detectChords(channelData, 44100);
        setDetectedChords(chords)
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
            <main className="m-2">
                <h1 className="col-span-4 p-6 text-4xl">Chord Recognition</h1>
                <h2 className="col-span-4 p-6 text-2xl">Powered by AI</h2>
                <button className="col-span-4 p-6 py-3 text-xl border " onClick={() => chordDetection()}>Detect Chords</button>
                <h2 className="col-span-4 p-6 text-2xl">Chords</h2>
                <ul className="list-disc list-inside">
                    {detectedChords.map((chord, i, ogArray) => {
                        return (
                            <li>{chord.rootNote} {toTextQuality(chord.quality)} {chord.interval != 0 ? chord.interval : ''}</li>
                        )
                    })}
                </ul>
            </main>
        </div>
    );
};

export default chordrecognition;
