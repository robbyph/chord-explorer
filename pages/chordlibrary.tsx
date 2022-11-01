import React from "react";
import Head from "next/head";

const chordlibrary = () => {
  return (
    <div>
      <Head>
        <title>Chord Explorer</title>
        <meta
          name="description"
          content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="col-span-4 p-6 text-4xl">Chord Library</h1>
        <div className="flex flex-row">
            <div className="m-6">
                <p className="font-bold text-md">Chord Root</p>
                <select className="mt-2 text-md" id="chordDropdown">
                  <option value='ab'>
                    Ab/G# 
                  </option>
                  <option value='a'>
                    A
                  </option>
                  <option value='bb'>
                    Bb/A#
                  </option>
                  <option value='b'>
                    B
                  </option>
                  <option value='c'>C</option>
                  <option value='db'>
                    Db/C#
                  </option>
                  <option value='d'>D</option>
                  <option value='eb'>Eb/D#</option>
                  <option value='e'>E</option>
                  <option value='f'>F</option>
                  <option value='gb'>F#/Gb</option>
                  <option value='g'>G</option>
                </select>
            </div>
        </div>
        <h2 className="col-span-4 p-6 text-xl">Chords</h2>
      </main>
    </div>
  );
};

export default chordlibrary;
