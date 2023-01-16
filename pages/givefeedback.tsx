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
                <h1 className="col-span-4 p-6 text-4xl">Recent Feedback Submissions</h1>
                <ul>
                    {error && <strong>Error! <br /> {JSON.stringify(error)}</strong>}
                    {loading && <em>Loading...</em>}
                    {posts && posts.docs.map((p) => {
                        return (
                            <li key={p.id}>
                                <h2>{p.data().title}</h2>
                                <h4><em>From: {p.data().author}</em></h4>
                                <h4><em>{p.data().created.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} {p.data().created.toDate().toLocaleTimeString('en-US')}</em></h4>
                                <p>{p.data().description}</p>
                            </li>
                        )
                    })}
                </ul>
            </main>
        </div>
    );
};

export default givefeedback;
