import React, { useState } from "react";
import Head from "next/head";

const chordlibrary = () => {
    
    const [ChordSel, setOption] = useState("A");
    console.log(ChordSel)
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
                        <select onChange={(e) => {setOption(e.target.value)}} value = {ChordSel} className="p-2 " id="chordDropdown">
                            <option value = "A"> A </option>
                            <option value ="A#"> A# </option>
                            <option value = "B"> B </option>
                            <option value = "C"> C </option>
                            <option value ="C#"> C# </option>
                            <option value = "D"> D </option>
                            <option value ="D#"> D# </option>
                            <option value = "E"> E </option>
                            <option value = "F"> F </option>
                            <option value ="F#"> F# </option>
                            <option value = "G"> G </option>
                            <option value ="G#"> G# </option>
                        </select>
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="col-span-4 text-3xl font-medium font-HindSiliguri">ChordS</h2>
                    <div>
                        <p>{ChordSel}</p>
                    </div>
                </div>
            </main>

            {/* This div will house the css grid and its items */}
            {/* setting the number of coluns and rows, rows are auto set with this config */}
            <div className="grid gap-x-4 gap-y-12 grid-cols-4 grid-flow-row">
                <div>
                    <img className ="test image" src="/favicon.ico"></img>
                </div>
                <div><img className ="test image" src="/favicon.ico"></img></div>
                <div>03</div>
                <div>04</div>
                <div><img className ="test image" src="/favicon.ico"></img></div>
                <div>Text<img className ="test image" src="/favicon.ico"></img></div>
            </div>
        </div>
    );
};

export default chordlibrary;
