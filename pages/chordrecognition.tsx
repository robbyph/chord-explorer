import React, { useEffect } from "react";
import Head from "next/head";
import { detectChords } from "../akkorder/src/index";

const chordrecognition = () => {

    var sourceBuffer: AudioBuffer;
    var context: AudioContext;

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
        let chords = detectChords(sourceBuffer.getChannelData(0), 44100);
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
            <main>
                <h1 className="col-span-4 p-6 text-4xl">Chord Recognition</h1>
                <h2 className="col-span-4 p-6 text-4x1">Powered by AI</h2>
                <button onClick={() => chordDetection()}>Detect</button>
            </main>
        </div>
    );
};

export default chordrecognition;
