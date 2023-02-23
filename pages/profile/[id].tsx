//@ts-nocheck

import React from 'react'
import { doc, getDoc, collection, getDocs, query, orderBy, where, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useCollection } from 'react-firebase-hooks/firestore';
import Link from 'next/link';
import { useState } from 'react';
import { Profanity, ProfanityOptions } from '@2toad/profanity';
import { CensorType } from '@2toad/profanity/dist/models';
import Alert from '../../components/Alert'
import { useAuth } from '../../context/AuthContext';
import SignInPrompt from '../../components/SignInPrompt'


const PostPage = (props) => {

    const { user } = useAuth();

    const [comments, commentsLoading, commentsError] = useCollection(
        query(collection(db, 'Comments'), where('author', '==', props.profile.userUID), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [posts, postsLoading, postsError] = useCollection(
        query(collection(db, 'Posts'), where('author', '==', props.profile.userUID), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );


    console.log(comments)

    return (
        <div id='page'>
            <div>
                <Head>
                    <title>Chord Explorer</title>
                    <meta
                        name="description"
                        content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {user &&
                    <main>
                        <h1 className="p-6 pb-1 text-4xl font-semibold font-HindSiliguri">{props.profile.username}</h1>
                        <span className="p-6 font-IBMPlexSans"><em>{props.profile.email}</em></span>
                        <div>
                            <h2 className="p-6 pb-2 text-2xl font-semibold font-HindSiliguri">Bio</h2>
                            <p className="p-6 pt-0 font-IBMPlexSans">{props.profile.bio}</p>
                        </div>
                        <div className="grid grid-cols-2 p-6 font-IBMPlexSans">
                            <div>
                                <h2 className="text-2xl font-semibold font-HindSiliguri">User Posts</h2>
                                {posts && posts?.docs.map((p: { id: React.Key | null | undefined; data: () => { (): any; new(): any; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; created: { (): any; new(): any; toDate: { (): { (): any; new(): any; toLocaleDateString: { (arg0: string, arg1: { weekday: string; year: string; month: string; day: string; }): string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; new(): any; }; toLocaleTimeString: { (arg0: string, arg1: { hour: string; minute: string; }): string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; new(): any; }; }; new(): any; }; }; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }; }) => {
                                    console.log('p ', p)
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
                                {comments && comments?.docs.map((c: { id: React.Key | null | undefined; data: () => { (): any; new(): any; comment: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; helpfulCount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; unhelpfulCount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; parentPost: any; created: { (): any; new(): any; toDate: { (): { (): any; new(): any; toLocaleDateString: { (arg0: string, arg1: { weekday: string; year: string; month: string; day: string; }): string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; new(): any; }; toLocaleTimeString: { (arg0: string, arg1: { hour: string; minute: string; }): string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; new(): any; }; }; new(): any; }; }; }; }) => {
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

        </div >
    )
}

const getDocumentData = async (id: string) => {
    const docRef = doc(db, 'Users', id);
    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {
        console.log('lets go')
        var returnDoc = {
            acctActive: docSnap.data().acctActive,
            bio: docSnap.data().bio,
            comments: docSnap.data().comments,
            email: docSnap.data().email,
            posts: docSnap.data().posts,
            userUID: docSnap.data().userUID,
            username: docSnap.data().username
        }
        return (returnDoc)
    } else {
        // doc.data() will be undefined in this case
        console.log("Error 4002");
    }
}

const getCollectionData = async () => {
    const querySnapshot = await getDocs(collection(db, "Users"));
    var collect = []
    querySnapshot.forEach((doc) => {
        collect.push({ params: { id: doc.id } })
    });
    return collect
}

export const getStaticProps: GetStaticProps = async (context) => {
    const profileData = await getDocumentData(context.params?.id);
    return {
        props: {
            profile: profileData,
            id: context.params?.id
        },
    };
};

//this creates a new file for each post
export const getStaticPaths: GetStaticPaths = async () => {
    const pathsCollection = await getCollectionData()
    return {
        paths: pathsCollection,
        fallback: false
    }
};

export default PostPage