//@ts-nocheck

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { NextPage } from 'next';
import { useCollection } from "react-firebase-hooks/firestore";


const givefeedback = () => {

    const [posts, loading, error] = useCollection(
        collection(db, 'Posts'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

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
                            <li key={p.id} className='flex flex-row p-4 m-4 ml-6 text-black bg-white border-4 border-gray-600 rounded-lg'>
                                <div>
                                    <h2 className="text-2xl">{p.data().title}</h2>
                                    <div className="flex flex-row space-x-8">
                                        <h4 className="text-sm"><em>Submitted By: {p.data().author}</em></h4>
                                        <h4 className="text-sm"><em>{p.data().created.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} {p.data().created.toDate().toLocaleTimeString('en-US')}</em></h4>
                                    </div>
                                    <br />
                                    <p>{p.data().description}</p>
                                    <br />
                                    <button className="rounded-lg font-bold p-2 mt-2 text-white bg-[#5B21B6]">Give Feedback</button>
                                </div>
                                <div className="ml-auto">
                                    <iframe src={p.data().vidLink + '?autoplay=0&controls=0'} frameborder="0"></iframe>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </main>
        </div>
    );
};

export default givefeedback;
