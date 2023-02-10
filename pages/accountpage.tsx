import React from "react";
import Head from "next/head";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase/firestore";
import Link from "next/link";


const accountpage = () => {
    const { user } = useAuth();
    const [account, loading, error] = useCollection(
        query(collection(db, 'Users'), where('userUID', '==', user.uid)),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [comments, commentsLoading, commentsError] = useCollection(
        query(collection(db, 'Comments'), where('author', '==', user.uid), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [posts, postsLoading, postsError] = useCollection(
        query(collection(db, 'Comments'), where('author', '==', user.uid), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    console.log(user.uid)

    return (
        <ProtectedRoute>
            <div>
                <Head>
                    <title>Chord Explorer</title>
                    <meta
                        name="description"
                        content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {error && <strong className="p-6 text-2xl">Error! <br /> {JSON.stringify(error)} </strong>}
                {loading && <em className="p-6 text-2xl">Loading...</em>}
                {account &&
                    <main>
                        <h1 className="p-6 pb-1 text-4xl font-semibold font-HindSiliguri">{account.docs[0].data().username}</h1>
                        <span className="p-6 font-IBMPlexSans"><em>{account.docs[0].data().email}</em></span>
                        <div>
                            <h2 className="p-6 pb-2 text-2xl font-semibold font-HindSiliguri">Bio</h2>
                            <p className="p-6 pt-0 font-IBMPlexSans">{account.docs[0].data().bio}</p>
                        </div>
                        <div className="grid grid-cols-2 p-6 font-IBMPlexSans">
                            <div>
                                <h2 className="text-2xl font-semibold font-HindSiliguri">Posts</h2>
                                {postsError && <strong>Error! <br /> {JSON.stringify(postsError)}</strong>}
                                {postsLoading && <em>Loading...</em>}
                                {posts && posts.docs.map((p) => {
                                    return (
                                        <li key={p.id} className='flex flex-row p-4 m-4 ml-6 text-black bg-white'>
                                            <div>
                                                <h2 className="text-2xl font-medium font-HindSiliguri">{p.data().title}</h2>
                                                <div className="text-gray-500 font-IBMPlexSans">
                                                    <h4 className="text-sm text-[#808080] underline">Submitted by {p.data().author.charAt(0).toUpperCase()}{p.data().author.slice(1)} </h4> {/* Makes the first letter uppercase */}
                                                    <h4 className="text-sm"><em>Submitted on {p.data().created.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} {p.data().created.toDate().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em></h4>
                                                </div>
                                                <br />
                                                <p className="w-3/4 font-IBMPlexSans">{p.data().description}</p>
                                                <br />
                                                <button className="rounded-lg font-medium font-IBMPlexSans p-2 mt-2 text-lg text-white bg-[#5B21B6]"><Link className='-m-2' href={`/post/${p.id}`}>Give Feedback</Link></button>
                                            </div>
                                            <div className="ml-auto">
                                                <iframe loading="lazy" className="h-full" src={p.data().vidLink + '?autoplay=0&controls=0'}></iframe>
                                            </div>
                                        </li>
                                    )
                                })}
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold font-HindSiliguri">Comments</h2>
                                {commentsError && <strong className="p-6 text-2xl">Error! <br /> {JSON.stringify(commentsError)} </strong>}
                                {commentsLoading && <em className="p-6 text-2xl">Loading...</em>}
                                {comments && comments.docs.map((c) => {
                                    return (
                                        <div id='comment' key={c.id} className='w-10/12 p-4 px-8 mt-4 text-black bg-white font-IBMPlexSans'>
                                            <p id='comment-content' className='pb-6'>{c.data().comment}</p>

                                            <div className='flex flex-row items-end space-x-4 font-HindSiliguri'>
                                                <div className='mr-auto space-x-4'>
                                                    <button className='p-1 font-semibold bg-purple-200 border-2 border-purple-800 rounded-lg text-neutral-900'>{c.data().helpfulCount} | Helpful</button>
                                                    <button className='p-1 font-semibold bg-purple-200 border-2 border-purple-800 rounded-lg text-neutral-900'>{c.data().unhelpfulCount} | Unhelpful</button>
                                                </div>
                                                <div>
                                                    <h4 id='comment-author' className='pt-4 pb-0 text-lg font-medium font-HindSiliguri'>From <span className='underline'>{c.data().author}</span></h4>
                                                    <h4 id='comment-author' className='pb-0 text-sm font-medium font-HindSiliguri'>Posted <em>{c.data().created?.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</em> at <em>{c.data().created?.toDate().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em></h4>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </main>
                }
            </div>
        </ProtectedRoute>
    );
};

export default accountpage;
