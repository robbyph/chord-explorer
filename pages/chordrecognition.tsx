//@ts-nocheck

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { detectChords } from "../akkorder/src/index";
import { silenceRemovalAlgorithm } from "../utilities/remove_silence";

const ChordRecognition = () => {

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

    async function chordDetection() {
        var channelData = Array.from(sourceBuffer.getChannelData(0));
        var channelDataSilenceRemoved = await silenceRemovalAlgorithm(channelData);
        let chords = detectChords(channelDataSilenceRemoved, 44100);
        setDetectedChords(chordFiltering(chords))
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
                <button className="col-span-4 px-2 py-2 text-xl border font-IBMPlexSans font-medium bg-white text-[#5B21B6] rounded" onClick={() => chordDetection()}>Detect Chords</button>
                <h2 className="col-span-4 pt-2 text-2xl font-HindSiliguri">Chords Detected</h2>
                <ul className="list-disc list-inside font-IBMPlexSans">
                    {detectedChords.map((chord, i) => {
                        return <li key={i}>{chord.rootNote} {toTextQuality(chord.quality)} {chord.interval != 0 ? chord.interval : ''}</li>
                    })}
                </ul>
            </main>
        </div>
    );
};

export default ChordRecognition;
