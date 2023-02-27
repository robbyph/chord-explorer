import React from "react";
import Head from "next/head";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { collection, doc, orderBy, query, where } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase/firestore";
import Link from "next/link";


const AccountPage = () => {
    const { user } = useAuth();
    var UID;

    if (user.uid) {
        UID = user.uid
    } else {
        UID = 'nUOyi6OFOFgXNTUKs8twjIhmVmy2'
    }

    
    const [account, accountLoading, accountError] = useDocument(
        doc(db, 'Users', UID),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [comments, commentsLoading, commentsError] = useCollection(
        query(collection(db, 'Comments'), where('author', '==', UID), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [posts, postsLoading, postsError] = useCollection(
        query(collection(db, 'Posts'), where('author', '==', UID), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    

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
                {user && account && account.data &&
                    <main>
                        <h1 className="p-6 pb-1 text-4xl font-semibold font-HindSiliguri">{account.data()?.username}</h1>
                        <span className="p-6 font-IBMPlexSans"><em>{user.email}</em></span>
                        <div>
                            <h2 className="p-6 pb-2 text-2xl font-semibold font-HindSiliguri">Bio</h2>
                            <p contenteditable="true" className="w-1/2 p-6 pt-0 pl-0 ml-6 font-IBMPlexSans">{account.data()?.bio.length > 0 ? account.data()?.bio : '✏️ Click here to create your bio...'}</p>
                        </div>
                        <div className="grid grid-cols-2 p-6 font-IBMPlexSans">
                            <div>
                                <h2 className="text-2xl font-semibold font-HindSiliguri">User Posts</h2>
                                {posts?.docs.map((p) => {
                                    return (
                                        <li key={p.id} className='flex flex-row p-4 m-4 ml-0 text-black bg-white'>
                                            <div>
                                                <h2 className="text-2xl font-medium font-HindSiliguri">{p.data().title}</h2>
                                                <div className="text-gray-500 font-IBMPlexSans">
                                                    <h4 className="text-sm"><em>Submitted on {p.data().created.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} {p.data().created.toDate().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em></h4>
                                                </div>
                                                <br />
                                                <p className="w-3/4 font-IBMPlexSans">{p.data().description}</p>
                                                <br />
                                                <button className="px-4 font-medium font-IBMPlexSans p-2 mt-2 text-lg text-white bg-[#5B21B6]"><Link className='-m-2' href={`/post/${p.id}`}>View</Link></button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold font-HindSiliguri">User Comments</h2>
                                {comments?.docs.map((c) => {
                                    return (
                                        <div id='comment' key={c.id} className='w-10/12 p-4 px-8 mt-4 text-black bg-white font-IBMPlexSans'>
                                            <p id='comment-content' className='pb-6'>{c.data().comment}</p>

                                            <div className='flex flex-row items-end space-x-4 font-HindSiliguri'>
                                                <div className='mr-auto space-x-4'>
                                                    <button disabled className='px-2 py-1 font-medium text-black bg-purple-200 border border-purple-400 shadow-md'>{c.data().helpfulCount} | Helpful</button>
                                                    <button disabled className='px-2 py-1 font-medium text-black bg-purple-200 border border-purple-400 shadow-md'>{c.data().unhelpfulCount} | Unhelpful</button>
                                                </div>
                                                <div>
                                                    <button className="underline"><Link href={`/post/${c.data().parentPost}`}>View Parent Post</Link></button>
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

export default AccountPage;
