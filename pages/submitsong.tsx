//@ts-nocheck
import React, { useState } from 'react'
import Head from 'next/head'
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import SignInPrompt from '../components/SignInPrompt'
import { useDocument } from 'react-firebase-hooks/firestore';
import Alert from "../components/Alert";
import { Profanity } from "@2toad/profanity";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import ChordSelection from '../components/ChordSelection'
import ChordPreview from '../components/ChordPreview';
import ProtectedRoute from '../components/ProtectedRoute';

interface PostType {
    title: string;
    author: string;
    songLink: string;
    tabLink: string;
}


const SubmitSong: NextPage = () => {

    const [tabLink, setTabLink] = useState('');
    const [songLink, setSongLink] = useState('');
    const [genre, setGenre] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const { user } = useAuth();
    const [showSignInPrompt, setShowSignInPrompt] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const profanity = new Profanity()
    const methods = useForm<PostType>({ mode: "onBlur" });
    const [chords, setChords] = useState<string[]>([]);
    const router = useRouter();

    var UID;
    if (user.uid) {
        UID = user.uid
    } else {
        UID = 'null'
    }


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;


    const [account, accountLoading, accountError] = useDocument(
        doc(db, 'Users', UID),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    function isValidLink(link) {
        const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?$/;
        return pattern.test(link);
    }

    //function that deletes a chord from the chord array using the value of the chord
    const deleteChord = (chord: string) => {
        console.log(chords)
        setChords(chords.filter((item) => item !== chord));
    };

    const onSubmit = async (data: PostType) => {
        if (!user?.uid) {
            setShowSignInPrompt(true);
            return;
        }
        if (data.title !== profanity.censor(data.title)) {
            setAlertMessage("Profanity Warning! Profanity in Title.");
            setShowAlert(true);
            return;
        }
        if (chords.length === 0) {
            setAlertMessage("Please select at least one chord.");
            setShowAlert(true);
            return;
        }
        if (!isValidLink(data.songLink)) {
            setAlertMessage("Please enter a valid song link.");
            setShowAlert(true);
            return;
        }
        const SongsRef = collection(db, "Songs");
        console.log(chords)
        await addDoc(SongsRef, {
            created: serverTimestamp(),
            // fields for the data to be sent to, make sure to separate each with a comma
            title: data.title,
            songLink: data.songLink,
            tabLink: data.tabLink,
            chords: chords,
            author: account.id,
            artist: data.artist,
            upVotes: 0,
            downVotes: 0,
            genre: genre,
            difficulty: difficulty,
        })
            .then((docRef) => {
                //router.push(`/post/${docRef.id}`);
                setAlertMessage("Submitted!");
                setShowAlert(true);
                setArtist('')
                setChords([])
                setTitle('')
                setSongLink('')
                setTabLink('')
                setGenre('')
                setDifficulty('')
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    return (
        <ProtectedRoute>

            <div>
                <Head>
                    <title>Chord Explorer</title>
                    <meta name="description" content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className='flex flex-col md:grid md:grid-cols-4 '>
                    {showAlert && <Alert message={alertMessage} setShow={setShowAlert} />}
                    {showSignInPrompt && <SignInPrompt setShow={setShowSignInPrompt} />}

                    <h1 className='col-span-4 p-6 text-4xl font-semibold text-white font-HindSiliguri'>Submit a Song</h1>
                    <div className='col-span-2 pl-6 pr-6 space-y-2'>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='grid grid-cols-2 gap-2'>
                                    <div className='font-IBMPlexSans'>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                                Song Title
                                            </label>
                                        </div>

                                        <input
                                            type="text"
                                            {...register("title", { required: "Title is required" })}
                                            className={`w-full p-2 text-lg font-IBMPlexSans`}
                                            minLength={1}
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                        />
                                        {errors.title && <p className="pt-1 pl-2 text-red-400">{errors.title.message}</p>}
                                    </div>

                                    <div className='font-IBMPlexSans'>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                                Artist
                                            </label>
                                        </div>

                                        <input
                                            type="text"
                                            {...register("artist", { required: "Artist is required" })}
                                            className={`w-full p-2 text-lg font-IBMPlexSans`}
                                            minLength={1}
                                            value={artist}
                                            onChange={e => setArtist(e.target.value)}
                                        />
                                        {errors.artist && <p className="pt-1 pl-2 text-red-400">{errors.artist.message}</p>}
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-2'>
                                    <div className="mt-4 font-IBMPlexSans" >
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="genre" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                                Genre
                                            </label>
                                        </div>

                                        <select
                                            id="genre"
                                            {...register("genre", { required: "Genre is required" })}
                                            className={`w-full p-2 text-lg font-IBMPlexSans`}
                                            value={genre}
                                            onChange={e => setGenre(e.target.value)}
                                        >
                                            {genre.length === 0 ? <option value=""></option> : ''}
                                            <option className='font-IBMPlexSans' value="rock">Rock</option>
                                            <option value="jazz">Jazz</option>
                                            <option value="pop">Pop</option>
                                            <option value="folk">Folk</option>
                                            <option value="indie">Indie</option>
                                        </select>
                                        {errors.genre && <p className="pt-1 pl-2 text-red-400">{errors.genre.message}</p>}
                                    </div>

                                    <div className="mt-4 font-IBMPlexSans" >
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="genre" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                                Difficulty
                                            </label>
                                        </div>

                                        <select
                                            id="difficulty"
                                            {...register("difficulty", { required: "Difficulty is required" })}
                                            className={`w-full p-2 text-lg font-IBMPlexSans`}
                                            value={difficulty}
                                            onChange={e => setDifficulty(e.target.value)}
                                        >
                                            {difficulty.length === 0 ? <option value=""></option> : ''}
                                            <option value="easy">Easy</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                        {errors.difficulty && <p className="pt-1 pl-2 text-red-400">{errors.difficulty.message}</p>}
                                    </div>
                                </div>



                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                            Song Link
                                        </label>

                                    </div>

                                    <input
                                        type="string"
                                        {...register("songLink", { required: "Song Link is required" })}
                                        className={`w-full p-2 text-lg font-IBMPlexSans`}
                                        value={songLink}
                                        onChange={e => setSongLink(e.target.value)}
                                    />
                                    {errors.songLink && <p className="pt-1 pl-2 text-red-400">{errors.songLink.message}</p>}
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                            Tab Link (Optional)
                                        </label>

                                    </div>

                                    <input
                                        type="string"
                                        {...register("tabLink")}
                                        className={`w-full p-2 text-lg font-IBMPlexSans`}
                                        value={tabLink}
                                        onChange={e => setTabLink(e.target.value)}
                                    />
                                    {errors.tabLink && <p className="pt-1 pl-2 text-red-400">{errors.tabLink.message}</p>}
                                </div>

                                <div className="flex flex-col-reverse justify-center pt-4">
                                    <ChordSelection
                                        className="mt-4"
                                        chords={chords}
                                        onChange={(chords: string[]) => setChords(chords)}
                                        deleteChord={deleteChord}
                                    />
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                            Chords
                                        </label>
                                    </div>
                                </div>

                                <div className="flex pt-8 justify-left">
                                    <button
                                        type="submit"
                                        className={`p-2 px-8 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium`}
                                    >
                                        <p className="">Submit</p>
                                    </button>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                    <div className='col-span-2 px-4 mt-8 mb-8 sm:px-20 md:mt-0'>
                        <h2 className='block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl'>Submission Preview</h2>
                        <div className='flex flex-col text-black bg-white'>
                            <div className='flex flex-col items-center text-base'>
                                <h3 className='p-2 pb-0 text-2xl font-medium font-HindSiliguri'>{title.length > 0 ? title : 'Title Placeholder'}</h3>
                                <h3 className='p-2 pb-0 text-lg font-medium font-HindSiliguri'>{artist.length > 0 ? artist : 'Artist Placeholder'}</h3>
                                {songLink && (
                                    <a
                                        className='text-blue-600 underline'
                                        target='_blank'
                                        rel='noreferrer'
                                        href={songLink}
                                    >
                                        Listen Here!
                                    </a>
                                )}
                                {tabLink && (
                                    <a
                                        className='text-blue-600 underline'
                                        target='_blank'
                                        rel='noreferrer'
                                        href={tabLink}
                                    >
                                        See Tabs Here!
                                    </a>
                                )}
                                <ChordPreview chords={chords} />
                                {/* <embed className='p-2' width="560" height="315" src={songLink.length > 0 ? vidLink : 'https://www.youtube.com/embed/ScMzIvxBSi4'} title="Video Submission" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></embed> */}
                                <p className='mt-8 mb-4 text-sm text-gray-600 font-HindSiliguri'>Submitted by <span className='underline'>{account?.data()?.username}</span></p>

                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>

    )
}

export default SubmitSong
