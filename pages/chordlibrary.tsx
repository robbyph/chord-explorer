import React from 'react'
import Head from 'next/head'

const ChordLibrary = () => {
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
            <main >
                <h1 className="col-span-12 p-6 text-4xl font-semibold font-HindSiliguri">Chord Library</h1>
                <div className="flex flex-col w-1/6 px-4 mb-4" id="parameters">
                    <label className="mb-1 ml-1 font-semibold" htmlFor="chordRoot">Chord Root</label>
                    <select name="chordRoot" id="chordRootSelect" className="h-10 px-3 border-gray-300 rounded">
                        <option value="any">Any</option>
                        <option value="C">C</option>
                        <option value="C#">C#/Db</option>
                        <option value="D">D</option>
                        <option value="D#">D#/Eb</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="F#">F#/Gb</option>
                        <option value="G">G</option>
                        <option value="G#">G#/Ab</option>
                        <option value="A">A</option>
                        <option value="A#">A#/Bb</option>
                        <option value="B">B</option>
                    </select>
                </div>
                <h2 className="col-span-4 p-6 text-3xl font-semibold font-HindSiliguri">
                    Chords
                </h2>
                <div className="grid grid-cols-4 gap-4 px-4 justify-items-stretch">
                    <div className="flex flex-col p-4 text-center text-black bg-white rounded">
                        <h3 className="pb-2 text-3xl font-semibold font-HindSiliguri">A Major</h3>
                        <img className='w-40 mx-auto' src='https://placehold.jp/150x150.png' alt='' />
                        <button className={`p-2 mt-4 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium hover:text-white hover:bg-[#5B21B6]`}>Read More & Listen</button>
                    </div>
                    <div className="flex flex-col p-4 text-center text-black bg-white rounded">
                        <h3 className="pb-2 text-3xl font-semibold font-HindSiliguri">A Major</h3>
                        <img className='w-40 mx-auto' src='https://placehold.jp/150x150.png' alt='' />
                        <button className={`p-2 mt-4 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium hover:text-white hover:bg-[#5B21B6]`}>Read More & Listen</button>
                    </div>
                    <div className="flex flex-col p-4 text-center text-black bg-white rounded">
                        <h3 className="pb-2 text-3xl font-semibold font-HindSiliguri">A Major</h3>
                        <img className='w-40 mx-auto' src='https://placehold.jp/150x150.png' alt='' />
                        <button className={`p-2 mt-4 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium hover:text-white hover:bg-[#5B21B6]`}>Read More & Listen</button>
                    </div>
                    <div className="flex flex-col p-4 text-center text-black bg-white rounded">
                        <h3 className="pb-2 text-3xl font-semibold font-HindSiliguri">A Major</h3>
                        <img className='w-40 mx-auto' src='https://placehold.jp/150x150.png' alt='' />
                        <button className={`p-2 mt-4 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium hover:text-white hover:bg-[#5B21B6]`}>Read More & Listen</button>
                    </div>
                    <div className="flex flex-col p-4 text-center text-black bg-white rounded">
                        <h3 className="pb-2 text-3xl font-semibold font-HindSiliguri">A Major</h3>
                        <img className='w-40 mx-auto' src='https://placehold.jp/150x150.png' alt='' />
                        <button className={`p-2 mt-4 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium hover:text-white hover:bg-[#5B21B6]`}>Read More & Listen</button>
                    </div>

                </div>

            </main>
        </div>
    )
}

export default ChordLibrary