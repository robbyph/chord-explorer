//@ts-nocheck

import React from 'react'
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next';

const PostPage = (props) => {
    return (
        <div className='flex flex-col items-center w-1/2 mx-auto mt-10 space-y-6' id='page'>
            <div id='header' className='flex flex-col items-center pb-6 text-center'>
                <h1 className='pb-1 text-4xl font-medium font-HindSiliguri'>{props.post.title}</h1>
                <h3 className='font-IBMPlexSans'>From <span className='underline'>{props.post.author}</span></h3>
                <h3 className='font-IBMPlexSans'>Submitted on <em>{new Date(props.post.created).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</em> at <em>{new Date(props.post.created).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em> </h3>
            </div>
            <div id='body' className='flex flex-col justify-center pb-16 space-x-4 space-y-2 lg:space-y-0 lg:flex-row'>
                <p className=''>{props.post.description}</p>
                <iframe loading="lazy" className="h-full" src={props.post.vidLink + '?autoplay=0&controls=0'}></iframe>
            </div>
            <div id='comments'>
                <h2 className='text-3xl pb-[.37rem] font-semibold text-center font-HindSiliguri'>Feedback</h2>
                <hr className="border-[1.5px] rounded-full xl w-96"></hr>
            </div>
        </div>
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
        console.log(returnDoc)
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
            post: postData
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