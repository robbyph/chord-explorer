//@ts-nocheck
import React, { useState } from 'react'
import Head from 'next/head'


const submitfeedback = () => {
    const [email, setEmail] = useState('')
    const [vidLink, setVidLink] = useState('')
    const [title, setTitle] = useState('')


    const handleSubmit = (e) => {
        
    }

  return (
    <div>
        <Head>
            <title>Chord Explorer</title>
            <meta name="description" content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='grid grid-cols-3 '>
            <h1 className='col-span-3 p-6 text-4xl text-center'>Submit Feedback</h1>
            <div className='col-span-2 pl-4'>
                <label htmlFor='email' className="block text-base font-medium lg:text-xl font-roboto text-h2purple" >Email</label>
                <input minLength={3} type='email' onChange={(e)=>{setEmail(e.target.value)}}  name='email' value={email} required/>

                <label htmlFor='vidLink' className="block text-base font-medium lg:text-xl font-roboto text-h2purple" >Video Link</label>
                <input minLength={3} type='text' onChange={(e)=>{setVidLink(e.target.value)}} name='vidLink' value={vidLink} required/>

                <label htmlFor='title' className="block text-base font-medium lg:text-xl font-roboto text-h2purple" >Title</label>
                <input minLength={3} type='text' onChange={(e)=>{setVidLink(e.target.value)}} name='title' value={title} required/>

                <br />
                <input value="Send" onClick={(e)=>{handleSubmit(e)}} className="p-2 m-2 border-2 cursor-pointer" type='submit'/>

            </div>
        </main>
    </div>
  )
}

export default submitfeedback