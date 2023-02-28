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


    var UID;
    if (user.uid) {
        UID = user.uid
    } else {
        UID = 'null'
    }


    const [account, accountLoading, accountError] = useDocument(
        doc(db, 'Users', UID),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const handleSubmit = (e) => {
        if (user.uid === null) {
            setShowSignInPrompt(true)
        } else if (title != profanity.censor(title)) {
            setAlertMessage('Profanity Warning! Profanity in Title.')
            setShowAlert(true)
        } else if (description != profanity.censor(description)) {
            setAlertMessage('Profanity Warning! Profanity in Description.')
            setShowAlert(true)
        } else {
            setShowSignInPrompt(false)
            const PostsRef = collection(db, 'Posts')
            return addDoc(PostsRef, {
                created: serverTimestamp(),
                //fields for the data to be sent to, make sure to separate each with a comma
                title: title,
                vidLink: vidLink,
                description: description,
                author: account.data()?.username
            });

        }
    };

    console.log(description)

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

                <h1 className='col-span-4 p-6 text-4xl font-semibold text-white font-HindSiliguri'>Submit for Feedback</h1>
                <div className='col-span-2 pl-6 pr-6 space-y-2'>
                    <div>
                        <label htmlFor='title' className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl" >Title</label>
                        <input className='w-full p-1 text-lg font-IBMPlexSans' minLength={3} type='text' onChange={(e) => { setTitle(e.target.value) }} name='title' value={title} required />
                    </div>

                    <div>
                        <label htmlFor='vidLink' className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl" >Video Link</label>
                        <input className='w-full p-1 text-lg font-IBMPlexSans' minLength={3} type='text' onChange={(e) => { setVidLink(e.target.value) }} name='vidLink' value={vidLink} required />
                        <p className='pt-1 pl-2 text-sm text-white font-IBMPlexSans'>Testing Link: https://www.youtube.com/embed/8tPnX7OPo0Q</p>
                    </div>

                    <div>
                        <label htmlFor='description' className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">Description</label>
                        <textarea className='w-full p-1 min-h-[23rem] font-IBMPlexSans' minLength={25} onChange={(e) => { setDescription(e.target.value) }} name='description' value={description} required />
                    </div>

                    <div>
                        <input type="checkbox" name='check' onChange={(e) => { setCheck(e.target.value) }} value={check} required />
                        <label htmlFor='check' className="pl-2 text-base text-white font-IBMPlexSans">This video does not contain lewd, inappropriate or adult-only content</label>
                    </div>

                    <input value="Submit" onClick={(e) => { check ? handleSubmit(e) : 'AHHH' }} className="p-2 m-2 ml-0 bg-white border-2 text-lg  cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium" type='submit' />
                </div>
                <div className='col-span-2 px-20'>
                    <h2 className='block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl'>Submission Preview</h2>
                    <div className='flex flex-col text-black bg-white'>
                        <div className='flex flex-col items-center'>
                            <h3 className='p-2 pb-0 text-2xl font-medium font-HindSiliguri'>{title.length > 0 ? title : 'Title Placeholder'}</h3>
                            <p className='p-2 pt-1 text-sm font-IBMPlexSans text-[#808080]'>Submitted by <span className='underline'>{account?.data().username}</span></p>
                            <embed className='p-2' width="560" height="315" src={vidLink.length > 0 ? vidLink : 'https://www.youtube.com/embed/ScMzIvxBSi4'} title="Video Submission" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></embed>
                        </div>
                        <pre className='p-2 pb-6 pl-0 ml-14 font-IBMPlexSans'>{description.length > 0 ? description : 'Type a description for your post, and it will appear here!'}</pre>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SubmitFeedback