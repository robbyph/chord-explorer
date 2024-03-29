import React, { useState } from "react";
import Head from "next/head";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { updateDoc, collection, doc, orderBy, query, where } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase/firestore";
import Link from "next/link";


const AccountPage = () => {
    const { user } = useAuth();
    var UID;
    const [editableElement, setEditableElement] = useState<HTMLElement | null>(null);

    if (user.uid) {
        UID = user.uid
    } else {
        UID = 'Ndbd5FSAl4QOMKyGaEY1866oNQk1'
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

    const updateBio = async () => {
        const docRef = doc(db, "Users", user.uid);
        const incomingText = editableElement?.innerHTML.replace(/(<br>)+/g, '');

        await updateDoc(docRef, {
            bio: incomingText
        });
    }




    return (
        <ProtectedRoute>
            <div className="min-h-screen">
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
                            <p
                                ref={el => setEditableElement(el)}
                                contentEditable="true"
                                onBlur={updateBio}
                                className="p-6 pt-0 pl-0 ml-6 mr-6 lg:mr-0 lg:w-1/2 font-IBMPlexSans"
                            >
                                {account.data()?.bio.length > 0
                                    ? account.data()?.bio
                                    : '✏️ Type here to start your bio! '}
                            </p>                        </div>
                        <div className="flex flex-col p-6 lg:grid lg:grid-cols-2 font-IBMPlexSans">
                            <div>
                                <h2 className="text-2xl font-semibold font-HindSiliguri">User Posts</h2>
                                {posts?.docs.map((p) => {
                                    return (
                                        <li key={p.id} className='flex flex-row p-4 my-4 ml-0 text-black bg-white lg:mr-4'>
                                            <div>
                                                <h2 className="text-2xl font-medium font-HindSiliguri">{p.data().title}</h2>
                                                <div className="text-gray-500 font-IBMPlexSans">
                                                    <h4 className="text-sm"><em>Submitted on {p.data().created.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} {p.data().created.toDate().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em></h4>
                                                </div>
                                                <br />
                                                <p className="lg:w-3/4 font-IBMPlexSans">{p.data().description.substring(0, 150)}{p.data().description.substring(151).length > 0 && '...'}</p>
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
                                        <div id='comment' key={c.id} className='p-4 px-8 mt-4 text-black bg-white font-IBMPlexSans lg:w-10/12'>
                                            <p id='comment-content' className='pb-6'>{c.data().comment}</p>

                                            <div className='flex flex-col lg:items-end lg:space-x-4 lg:flex-row font-HindSiliguri'>
                                                <div className='order-last mt-4 mr-auto space-x-4 lg:mt-0 lg:order-first'>
                                                    <button disabled className='px-2 py-1 font-medium text-black bg-purple-200 border border-purple-400 shadow-md'>{c.data().helpfulCount} | Helpful</button>
                                                    <button disabled className='px-2 py-1 font-medium text-black bg-purple-200 border border-purple-400 shadow-md'>{c.data().unhelpfulCount} | Unhelpful</button>
                                                </div>
                                                <div className="order-first lg:order-last">
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
