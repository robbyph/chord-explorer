//@ts-nocheck

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { NextPage } from "next";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";


const GiveFeedback = () => {
    const [posts, loading, error] = useCollection(
        query(collection(db, 'Posts'), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const getUsername = async (id) => {
        const docRef = doc(db, "Users", id);
        const docSnap = await getDoc(docRef);
        var username = await docSnap.data().username
        return username
    }

    const [usernames, setUsernames] = useState([]);
    const [loadingUsernames, setLoadingUsernames] = useState(true);

    useEffect(() => {
        if (posts) {
            const authorPromises = posts.docs.map((p) => getUsername(p.data().author));
            Promise.all(authorPromises).then((unames) => {
                setUsernames(unames);
                setLoadingUsernames(false);
            });
        }
    }, [posts]);

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
                    {posts && usernames && posts.docs.map((p, i) => {
                        //var myUsername = String.toString(getUsername(p.data().author))
                        var myUsername = usernames[i]
                        return (
                            <li key={p.id} className='flex flex-row p-4 m-4 ml-6 text-black bg-white'>
                                <div>
                                    <h2 className="text-2xl font-medium font-HindSiliguri">{p.data().title}</h2>
                                    <div className="text-gray-500 font-IBMPlexSans">
                                        <h4 className="text-sm text-[#808080]">Submitted by <Link href={`/profile/${p.data().author}`}><a className="underline">{myUsername}</a></Link></h4>
                                        <h4 className="text-sm"><em>Submitted on {p.data().created.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} {p.data().created.toDate().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em></h4>
                                    </div>
                                    <br />
                                    <p className="w-3/4 font-IBMPlexSans">{p.data().description}</p>
                                    <br />
                                    <button className="font-medium font-IBMPlexSans p-2 mt-2 text-lg text-white bg-[#5B21B6]"><Link className='-m-2' href={`/post/${p.id}`}>Give Feedback</Link></button>
                                </div>
                                <div className="ml-auto">
                                    {p.data().vidLink && (
                                        <iframe
                                            className="h-full"
                                            srcDoc={
                                                '<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href="https://www.youtube.com/embed/' +
                                                p
                                                    .data()
                                                    .vidLink.match(
                                                        /(?:\/embed\/|v=)([\w-]{11})(?:\S+)?/
                                                    )[1] +
                                                '"><img src="https://i.ytimg.com/vi/' +
                                                p
                                                    .data()
                                                    .vidLink.match(
                                                        /(?:\/embed\/|v=)([\w-]{11})(?:\S+)?/
                                                    )[1] +
                                                '/hqdefault.jpg" alt="Video Submission"><span>▶</span></a>'
                                            }
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Video Submission"
                                        />
                                    )}
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
