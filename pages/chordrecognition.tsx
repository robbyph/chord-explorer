import React from "react";
import Head from "next/head";
import { detectChords } from "akkorder/src";
import { C_Major_48 } from "akkorder/__tests__/testSignals";

const chordrecognition = () => {

    let chords = detectChords(C_Major_48, 44100);
    console.log(chords)

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
