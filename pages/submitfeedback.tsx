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
import ProtectedRoute from '../components/ProtectedRoute';
import YoutubeLazyLoad from '../components/YoutubeLazyLoad';

interface PostType {
    title: string;
    vidLink: string;
    description: string;
    check: boolean;
}



const SubmitFeedback: NextPage = () => {

    const [description, setDescription] = useState('');
    const [vidLink, setVidLink] = useState('');
    const [title, setTitle] = useState('');
    const [check, setCheck] = useState(false);
    const { user } = useAuth();
    const [showSignInPrompt, setShowSignInPrompt] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const profanity = new Profanity()
    const methods = useForm<PostType>({ mode: "onBlur" });

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

    const onSubmit = async (data: SignupType) => {
        if (user.uid === null) {
            setShowSignInPrompt(true)
        } else if (data.title != profanity.censor(data.title)) {
            console.log(profanity.censor(title))
            setAlertMessage('Profanity Warning! Profanity in Title.')
            setShowAlert(true)
        } else if (data.description != profanity.censor(data.description)) {
            setAlertMessage('Profanity Warning! Profanity in Description.')
            setShowAlert(true)
        } else {
            setShowSignInPrompt(false)
            const PostsRef = collection(db, 'Posts')
            await addDoc(PostsRef, {
                created: serverTimestamp(),
                //fields for the data to be sent to, make sure to separate each with a comma
                title: data.title,
                vidLink: data.vidLink,
                description: data.description,
                author: account.id
            }).then(function (docRef) { router.push(`/post/${docRef.id}`) })

        }
    };

    return (
        <ProtectedRoute>
            <div className='min-h-screen'>
                <Head>
                    <title>Chord Explorer</title>
                    <meta name="description" content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className='flex flex-col lg:grid lg:grid-cols-4 '>
                    {showAlert && <Alert message={alertMessage} setShow={setShowAlert} />}
                    {showSignInPrompt && <SignInPrompt setShow={setShowSignInPrompt} />}

                    <h1 className='col-span-4 p-6 text-4xl font-semibold text-white font-HindSiliguri'>Request Feedback</h1>
                    <div className='col-span-2 pl-6 pr-6 space-y-2'>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='font-IBMPlexSans'>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                            Title
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
                                            Video Link
                                        </label>

                                    </div>

                                    <input
                                        type="string"
                                        {...register("vidLink", { required: "Video Link is required" })}
                                        className={`w-full p-1 text-lg font-IBMPlexSans`}
                                        value={vidLink}
                                        onChange={e => setVidLink(e.target.value)}
                                    />
                                    {errors.vidLink && <p className="pt-1 pl-2 text-red-400">{errors.vidLink.message}</p>}
                                </div>

                                <div className="mt-8">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="" className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
                                            Description
                                        </label>

                                    </div>

                                    <textarea
                                        {...register("description", { required: "Description is required" })}
                                        className={`w-full min-h-[12rem] p-1 text-lg font-IBMPlexSans`}
                                        minLength={25}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                    {errors.description && <p className="pt-1 pl-2 text-red-400">{errors.description.message}</p>}
                                </div>

                                <div className="mt-8">

                                    <input
                                        type="checkbox"
                                        {...register("check", { required: "Confirmation is required" })}
                                        className={`p-1 text-lg font-IBMPlexSans`}
                                        value={check}
                                        onChange={e => setCheck(e.target.value)}
                                    /> This video does not contain lewd, inappropriate or adult-only content
                                    {errors.check && <p className="pt-1 pl-2 text-red-400">{errors.check.message}</p>}
                                </div>

                                <div className="flex justify-center pt-8">
                                    <button
                                        type="submit"
                                        className={`p-2 m-2 ml-0 bg-white border-2 text-lg cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium`}
                                    >
                                        <p className="">Submit</p>
                                    </button>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                    <div className='col-span-2 px-4 my-8 lg:my-0 lg:px-20'>
                        <h2 className='block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl'>Submission Preview</h2>
                        <div className='flex flex-col text-black bg-white'>
                            <div className='flex flex-col items-center'>
                                <h3 className='p-2 pb-0 text-2xl font-medium font-HindSiliguri'>{title.length > 0 ? title : 'Title Placeholder'}</h3>
                                <p className='p-2 pt-1 text-sm font-IBMPlexSans text-[#808080]'>Submitted by <span className='underline'>{account?.data()?.username}</span></p>
                                {<YoutubeLazyLoad video={vidLink} height={'14rem'} playable={false} />}
                            </div>
                            <p className='p-4 pb-6 lg:p-2 lg:pl-0 lg:mr-14 lg:ml-14 font-IBMPlexSans'>{description.length > 0 ? description : 'Type a description for your post, and it will appear here!'}</p>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}

export default SubmitFeedback