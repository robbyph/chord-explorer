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


interface PostType {
    title: string;
    songLink: string;
    tabLink: string;
}

const SubmitSong: NextPage = () => {

    const [tabLink, setTabLink] = useState('');
    const [songLink, setSongLink] = useState('');
    const [title, setTitle] = useState('');
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
        const PostsRef = collection(db, "Posts");
        await addDoc(PostsRef, {
            created: serverTimestamp(),
            // fields for the data to be sent to, make sure to separate each with a comma
            title: data.title,
            songLink: data.songLink,
            tabLink: data.tabLink,
            chords: data.chords,
            author: account.id,
        })
            .then((docRef) => {
                router.push(`/post/${docRef.id}`);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    return (
        <div>
            <Head>
                <title>Chord Explorer</title>
                <meta name="description" content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='grid grid-cols-4 '>
                {showAlert && <Alert message={alertMessage} setShow={setShowAlert} />}
                {showSignInPrompt && <SignInPrompt setShow={setShowSignInPrompt} />}

                <h1 className='col-span-4 p-6 text-4xl font-semibold text-white font-HindSiliguri'>Submit a Song</h1>
                <div className='col-span-2 pl-6 pr-6 space-y-2'>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='font-IBMPlexSans'>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                        Song Title
                                    </label>
                                </div>

                                <input
                                    type="text"
                                    {...register("title", { required: "Title is required" })}
                                    className={`w-full p-1 text-lg font-IBMPlexSans`}
                                    minLength={6}
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                                {errors.title && <p className="pt-1 pl-2 text-red-400">{errors.title.message}</p>}
                            </div>

                            <div className="mt-8">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                        Song Link
                                    </label>

                                </div>

                                <input
                                    type="string"
                                    {...register("songLink", { required: "Song Link is required" })}
                                    className={`w-full p-1 text-lg font-IBMPlexSans`}
                                    value={songLink}
                                    onChange={e => setSongLink(e.target.value)}
                                />
                                {errors.songLink && <p className="pt-1 pl-2 text-red-400">{errors.songLink.message}</p>}
                            </div>

                            <div className="mt-8">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                        Tab Link (Optional)
                                    </label>

                                </div>

                                <input
                                    type="string"
                                    {...register("tabLink")}
                                    className={`w-full p-1 text-lg font-IBMPlexSans`}
                                    value={tabLink}
                                    onChange={e => setTabLink(e.target.value)}
                                />
                                {errors.tabLink && <p className="pt-1 pl-2 text-red-400">{errors.tabLink.message}</p>}
                            </div>

                            <div className="flex flex-col-reverse justify-center pt-8">
                                <ChordSelection
                                    className="mt-4"
                                    chords={chords}
                                    onChange={(chords: string[]) => setChords(chords)}
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
                <div className='col-span-2 px-20'>
                    <h2 className='block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl'>Submission Preview</h2>
                    <div className='flex flex-col text-black bg-white'>
                        <div className='flex flex-col items-center'>
                            <h3 className='p-2 pb-0 text-2xl font-medium font-HindSiliguri'>{title.length > 0 ? title : 'Title Placeholder'}</h3>
                            <p className='p-2 pt-1 text-sm font-IBMPlexSans text-[#808080]'>Submitted by <span className='underline'>{account?.data().username}</span></p>
                            <ChordPreview chords={chords} />
                            {/* <embed className='p-2' width="560" height="315" src={songLink.length > 0 ? vidLink : 'https://www.youtube.com/embed/ScMzIvxBSi4'} title="Video Submission" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></embed> */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SubmitSong
