import React from "react";
import Head from "next/head";
import SongModal from "../components/SongModal";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useState } from "react";

const Search = () => {
    const [selectedSong, setSelectedSong] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [chordRoot, setChordRoot] = useState("any");
    const [chordQuality, setChordQuality] = useState("any");
    const [genre, setGenre] = useState("any");
    const [difficulty, setDifficulty] = useState("any");

    const [songs, loading, error] = useCollection(
        query(collection(db, 'Songs')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    console.log(chordRoot)
    console.log(chordQuality)
    console.log(genre)
    console.log(difficulty)

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
            {loading && <h1>Loading...</h1>}
            {error && <strong>Error! <br /> {JSON.stringify(error)}</strong>}
            {
                songs?.docs && <main>
                    {modalOpen && <SongModal song={selectedSong}
                        onClose={() => setModalOpen(false)}
                    />}
                    <h1 className="col-span-4 p-6 text-4xl font-semibold font-HindSiliguri">
                        Search
                    </h1>
                    <div className="grid grid-cols-4 gap-4 px-4">
                        <div className="flex flex-col mb-4">
                            <label className="mb-1 ml-1 font-semibold" htmlFor="chordRoot">Chord Root</label>
                            <select value={chordRoot} onChange={
                                (e) => {
                                    setChordRoot(e.target.value);
                                }
                            } name="chordRoot" id="chordRootSelect" className="h-10 px-3 border-gray-300 rounded">
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
                        <div className="flex flex-col mb-4">
                            <label className="mb-1 ml-1 font-semibold" htmlFor="chordQuality">Chord Quality</label>
                            <select name="chordQuality" value={chordQuality} onChange={
                                (e) => {
                                    setChordQuality(e.target.value);
                                }
                            } id="chordQualitySelect" className="h-10 px-3 border-gray-300 rounded">
                                <option value="any">Any</option>
                                <option value="major">Major</option>
                                <option value="minor">Minor</option>
                                <option value="dim">Diminished</option>
                                <option value="aug">Augmented</option>
                                <option value="sus4">Sus2</option>
                                <option value="sus4">Sus4</option>
                                <option value="maj7">Major 7</option>
                                <option value="m7">Minor 7</option>
                                <option value="7">Dominant 7</option>
                            </select>
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="mb-1 ml-1 font-semibold" htmlFor="genre">Genre</label>
                            <select name="genre" value={genre} onChange={
                                (e) => {
                                    setGenre(e.target.value);
                                }
                            } id="genre" className="h-10 px-3 border-gray-300 rounded">
                                <option value="any">Any</option>
                                <option value="rock">Rock</option>
                                <option value="jazz">Jazz</option>
                            </select>
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="mb-1 ml-1 font-semibold" htmlFor="difficulty">Difficulty</label>
                            <select value={difficulty} onChange={
                                (e) => {
                                    setDifficulty(e.target.value);
                                }
                            } name="difficulty" id="chordQualitySelect" className="h-10 px-3 border-gray-300 rounded">
                                <option value="any">Any</option>
                                <option value="easy">Easy</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <h2 className="col-span-4 p-6 text-3xl font-semibold font-HindSiliguri">
                        Songs Containing G Major (G)
                    </h2>
                    <div className="grid grid-cols-4 gap-4 px-4 justify-items-stretch">
                        {songs.docs.map((song) => {
                            return (
                                <div key={song.id} className="flex flex-col justify-center p-4 text-black bg-white rounded">
                                    <h3 className="text-2xl font-semibold font-HindSiliguri">{song.data().title}</h3>
                                    <p className="text-lg font-HindSiliguri">By {song.data().artist}</p>
                                    <button
                                        onClick={() => {
                                            setSelectedSong(song);
                                            setModalOpen(true);
                                        }}
                                        className={`p-2 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium hover:text-white hover:bg-[#5B21B6]`}>View Chord Charts</button>
                                </div>
                            )
                        })}
                    </div>
                </main >
            }
        </div >
    );
};




export default Search;
