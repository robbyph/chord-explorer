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
                <h1 className="col-span-4 p-6 text-4xl font-semibold font-HindSiliguri">Chord Library</h1>
                <div className="flex flex-row">
                    <div className="p-6">
                        <p className="mb-2 text-base font-IBMPlexSans">Chord Root</p>
                        <select className="p-2 " id="chordDropdown">
                            <option disabled selected>
                                {" "}
                                E, A, C#, etc.
                            </option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                        </select>
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="col-span-4 text-3xl font-medium font-HindSiliguri">Songs Containing </h2>
                </div>
            </main>
        </div>
    );
};

export default chordlibrary;
