import React from "react";
import Head from "next/head";
import { Chromagram } from "akkorder/src";

const chordrecognition = () => {
    let frameSize = 512;
    let sampleRate = 44100;

    var c = new Chromagram(frameSize, sampleRate);

    let frame = new Array(frameSize);
    // !
    // do something here to fill the frame with audio samples
    // !
    //and then call:

    c.processAudioFrame(frame);

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
            </main>
        </div>
    );
};

export default chordrecognition;
