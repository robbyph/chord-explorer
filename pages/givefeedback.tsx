//@ts-nocheck

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { NextPage } from 'next';
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";


const GiveFeedback = () => {

    const [posts, loading, error] = useCollection(
        query(collection(db, 'Posts'), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const getUsername = (userUID) => {
        const q = query(collection(db, 'Users'), where('userUID', '==', userUID))
        console.log(q)
        const docSnap = getDocs(q);
        console.log(docSnap)
        //return docSnap[0].data().username
    }

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
                <h1 className="col-span-4 p-6 text-4xl font-semibold font-HindSiliguri">Recent Feedback Submissions</h1>
                <ul>
                    {error && <strong>Error! <br /> {JSON.stringify(error)}</strong>}
                    {loading && <em>Loading...</em>}
                    {posts && posts.docs.map((p) => {
                        return (
                            <li key={p.id} className='flex flex-row p-4 m-4 ml-6 text-black bg-white'>
                                <div>
                                    <h2 className="text-2xl font-medium font-HindSiliguri">{p.data().title}</h2>
                                    <div className="text-gray-500 font-IBMPlexSans">
                                        <h4 className="text-sm text-[#808080] underline">Submitted by {p.data().author} </h4>
                                        <h4 className="text-sm"><em>Submitted on {p.data().created.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} {p.data().created.toDate().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em></h4>
                                    </div>
                                    <br />
                                    <p className="w-3/4 font-IBMPlexSans">{p.data().description}</p>
                                    <br />
                                    <button className="font-medium font-IBMPlexSans p-2 mt-2 text-lg text-white bg-[#5B21B6]"><Link className='-m-2' href={`/post/${p.id}`}>Give Feedback</Link></button>
                                </div>
                                <div className="ml-auto">
                                    <iframe loading="lazy" className="h-full" src={p.data().vidLink + '?autoplay=0&controls=0'}></iframe>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </main>
        </div>
    );
};

export default GiveFeedback;
