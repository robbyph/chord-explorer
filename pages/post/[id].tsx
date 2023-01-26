//@ts-nocheck

import React from 'react'
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next';

const PostPage = (props) => {
    return (
        <>
            <div id='header'>
                <h1>{props.post.title}</h1>
                <h2>From {props.post.author}</h2>
                <h2>Post created on {new Date(props.post.created).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })} at {new Date(props.post.created).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })} </h2>
            </div>

            <div id='body'>
                <iframe loading="lazy" className="h-full" src={props.post.vidLink + '?autoplay=0&controls=0'}></iframe>
                <p>{props.post.description}</p>
            </div>
        </>
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