//@ts-nocheck

import React from 'react'
import { doc, getDoc, collection, getDocs, query, orderBy, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

const PostPage = (props) => {
    const [newComment, setNewComment] = useState('');
    const [comments, loading, error] = useCollection(
        query(collection(db, 'Comments'), where('parentPost', '==', props.id)),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const handleSubmit = (e) => {
        const CommentsRef = collection(db, 'Comments')

        return addDoc(CommentsRef, {
            created: serverTimestamp(),
            //fields for the data to be sent to, make sure to separate each with a comma
            comment: newComment,
            author: 'Current User',
            helpfulCount: 0,
            unhelpfulCount: 0,
            parentPost: props.id
        });
    };


    return (
        <div id='page'>
            <div className='flex flex-col items-center w-1/2 mx-auto mt-10 space-y-6' >
                <div id='header' className='flex flex-col items-center pb-6 text-center'>
                    <h1 className='pb-1 text-4xl font-medium font-HindSiliguri'>{props.post.title}</h1>
                    <h3 className='font-IBMPlexSans'>From <span className='underline'>{props.post.author}</span></h3>
                    <h3 className='font-IBMPlexSans'>Submitted on <em>{new Date(props.post.created).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</em> at <em>{new Date(props.post.created).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em> </h3>
                </div>
                <div id='body' className='flex flex-col justify-center pb-16 space-x-16 space-y-2 lg:space-y-0 lg:flex-row'>
                    <p className=''>{props.post.description}</p>
                    <iframe loading="lazy" className="h-60" src={props.post.vidLink + '?autoplay=0&controls=0'}></iframe>

                </div>
            </div>
            <div id='comments' className='grid justify-center grid-cols-12 px-4 pb-8'>
                <div id='leftCol' className='justify-center col-span-5 text-center'>
                    <h2 className='text-3xl pb-[.37rem] font-semibold text-center font-HindSiliguri'>Leave Feedback</h2>
                    <hr className="border-[1.5px] justify-center rounded-full mx-auto w-[30rem]"></hr>
                    <div className='flex flex-col pl-6 pr-6 space-y-2 '>
                        <textarea type="text" onChange={(e) => { setNewComment(e.target.value) }} rows={14} className='justify-center w-10/12 mx-auto mt-4 mb-4' />
                        <input value="Submit" onClick={(e) => { handleSubmit(e); setNewComment('') }} className="p-2 m-2 ml-auto mr-14 w-1/4 bg-white border-2 text-lg rounded cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium" type='submit' />
                    </div>

                </div>
                <div id='rightCol' className='justify-center col-span-7'>
                    <h2 className='text-3xl pb-[.37rem] font-semibold text-center font-HindSiliguri'>Read Feedback</h2>
                    <hr className="border-[1.5px] justify-center rounded-full mx-auto w-[30rem]"></hr>
                    <ul>
                        {error && <strong>Error! <br /> {JSON.stringify(error)} {console.log(comments)} </strong>}
                        {loading && <em>Loading...</em>}
                        {comments && comments.docs.map((c) => {
                            console.log(c)
                            return (
                                <div id='comment' key={c.id} className='w-10/12 p-4 px-8 mt-4 text-black bg-white font-IBMPlexSans'>
                                    <p id='comment-content' className='pb-6'>{c.data().comment}</p>

                                    <div className='flex flex-row items-end space-x-4 font-HindSiliguri'>
                                        <div className='mr-auto space-x-4'>
                                            <button className='p-2 font-semibold bg-purple-200 border-2 border-purple-800 rounded-lg text-neutral-900'>Helpful</button>
                                            <button className='p-2 font-semibold bg-purple-200 border-2 border-purple-800 rounded-lg text-neutral-900'>Unhelpful</button>
                                        </div>
                                        <div>
                                            <h4 id='comment-author' className='pt-4 pb-0 text-lg font-medium font-HindSiliguri'>From <span className='underline'>{c.data().author}</span></h4>
                                            <h4 id='comment-author' className='pb-0 text-sm font-medium font-HindSiliguri'>Posted <em>{new Date(props.post.created).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</em> at <em>{new Date(props.post.created).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em></h4>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                    <div id='comments section' className='flex flex-col items-center'>

                    </div>
                </div>
            </div>
        </div >

    )
}

const getDocumentData = async (id: string) => {
    const docRef = doc(db, 'Posts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        var returnDoc = {
            title: docSnap.data().title,
            author: docSnap.data().author,
            description: docSnap.data().description,
            vidLink: docSnap.data().vidLink,
            created: JSON.parse(JSON.stringify(docSnap.data().created.toDate()))
        }
        return (returnDoc)
    } else {
        // doc.data() will be undefined in this case
        console.log("Error 4001");
    }
}

const getCollectionData = async () => {
    const querySnapshot = await getDocs(collection(db, "Posts"));
    var collect = []
    querySnapshot.forEach((doc) => {
        collect.push({ params: { id: doc.id } })
    });
    return collect
}

export const getStaticProps: GetStaticProps = async (context) => {
    const postData = await getDocumentData(context.params?.id);
    return {
        props: {
            post: postData,
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