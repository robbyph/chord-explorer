//@ts-nocheck
import React, { useState } from 'react'
import Head from 'next/head'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { NextPage } from 'next';


const SubmitFeedback: NextPage = () => {

    const [description, setDescription] = useState('');
    const [vidLink, setVidLink] = useState('');
    const [title, setTitle] = useState('');
    const [check, setCheck] = useState(false);


    const handleSubmit = (e) => {
        const PostsRef = collection(db, 'Posts')
        return addDoc(PostsRef, {
            created: serverTimestamp(),
            //fields for the data to be sent to, make sure to separate each with a comma
            title: title,
            vidLink: vidLink,
            description: description,
            author: 'placeholder'
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
                        <input className='w-full p-1 text-lg font-IBMPlexSans' minLength={20} type='text' onChange={(e) => { setDescription(e.target.value) }} name='description' value={description} required />
                    </div>

                    <div>
                        <input type="checkbox" name='check' onChange={(e) => { setCheck(e.target.value) }} value={check} required />
                        <label htmlFor='check' className="pl-2 text-base text-white font-IBMPlexSans">This video does not contain lewd, inappropriate or adult-only content</label>
                    </div>

                    <input value="Submit" onClick={(e) => { check ? handleSubmit(e) : 'AHHH' }} className="p-2 m-2 ml-0 bg-white border-2 text-lg rounded cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium" type='submit' />
                </div>
                <div className='col-span-2 px-20'>
                    <h2 className='pb-3 pl-2 text-xl font-medium text-center text-white font-IBMPlexSans'>Submission Preview</h2>
                    <div className='flex flex-col items-center text-black bg-white'>
                        <h3 className='p-2 pb-0 text-2xl font-medium font-HindSiliguri'>{title.length > 0 ? title : 'Title Placeholder'}</h3>
                        <p className='p-2 pt-1 text-sm font-IBMPlexSans text-[#808080]'>Submitted by <span className='underline'>Current User</span></p>
                        <embed className='p-2' width="560" height="315" src={vidLink.length > 0 ? vidLink : 'https://www.youtube.com/embed/ScMzIvxBSi4'} title="Video Submission" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></embed>
                        <p className='p-2 pb-6 font-IBMPlexSans'>{description.length > 0 ? description : 'Type a description for your post, and it will appear here!'}</p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SubmitFeedback