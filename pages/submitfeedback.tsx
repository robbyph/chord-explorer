//@ts-nocheck
import React, { useState } from 'react'
import Head from 'next/head'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";


const submitfeedback = () => {
    const [description, setDescription] = useState('')
    const [vidLink, setVidLink] = useState('')
    const [title, setTitle] = useState('')

    
    const handleSubmit = (e) => {
         const PostsRef = collection(db, 'Posts')
            return addDoc(PostsRef, {
                    created: serverTimestamp(),
                    //fields for the data to be sent to, make sure to separate each with a comma
                    title: title,
                    vidLink: vidLink,
                    description: description
                });
     };

  return (
    <div>
        <Head>
            <title>Chord Explorer</title>
            <meta name="description" content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='grid grid-cols-4'>
            <h1 className='col-span-4 p-6 text-4xl'>Submit Feedback</h1>
            <div className='col-span-2 pl-6'>
                <label htmlFor='title' className="block text-base font-medium lg:text-xl" >Title</label>
                <input minLength={3} type='text' onChange={(e)=>{setTitle(e.target.value)}} name='title' value={title} required/>

                <label htmlFor='vidLink' className="block text-base font-medium lg:text-xl" >Video Link</label>
                <input minLength={3} type='text' onChange={(e)=>{setVidLink(e.target.value)}} name='vidLink' value={vidLink} required/>
                <p className='text-sm'>Testing Link: https://www.youtube.com/embed/8tPnX7OPo0Q</p>


                <label htmlFor='description' className="block text-base font-medium lg:text-xl">Description</label>
                <input minLength={3} type='text' onChange={(e)=>{setDescription(e.target.value)}} name='description' value={description} required/>


                <br />
                <input value="Submit" onClick={(e)=>{handleSubmit(e)}} className="p-2 m-2 ml-0 border-2 cursor-pointer" type='submit'/>
            </div>
            <div className='col-span-2 pr-6'>
                <h2>Submission Preview</h2>
                <div className='text-black bg-white border-2'>
                    <h3 className='p-2 text-2xl'>{title.length > 0 ? title : 'Title Placeholder'}</h3>
                    <p className='p-2'>Submitted by <span className='underline'>Current User</span></p>
                    <embed className='p-2' width="560" height="315" src={vidLink.length > 0 ? vidLink : 'https://www.youtube.com/embed/ScMzIvxBSi4'} title="Video Submission" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></embed>
                    <p className='p-2'>{description.length > 0 ? description : 'Type a description for your post, and it will appear here!'}</p>
                </div>
            </div>
        </main>
    </div>
  )
}

export default submitfeedback