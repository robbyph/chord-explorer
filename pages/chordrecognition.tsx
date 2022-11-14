import React, { useEffect } from "react";
import Head from "next/head";
import { detectChords } from "akkorder/src";
import { C_Major_48 } from "akkorder/__tests__/testSignals";

const chordrecognition = () => {

    var sourceBuffer: AudioBuffer;
    var context: AudioContext;

    useEffect(() => {
        context = new AudioContext();
    })

    function loadSound(url: string | URL) {
        context.resume().then(() => {
            console.log('resumed')
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            // Decode asynchronously
            request.onload = function () {
                console.log('request')
                console.log(request.response);
                context.decodeAudioData(request.response);
                console.log('audio context')
                console.log(context)
                console.log('buffer')
                console.log(sourceBuffer)
            }
            request.send();

        })
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
                <button onClick={() => { loadSound('example.mp3') }}>Detect</button>
            </main>
        </div>
    );
};

export default chordrecognition;
