//@ts-nocheck

import React from 'react'
import { doc, getDoc, collection, getDocs, query, orderBy, where, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useState } from 'react';
import { Profanity, ProfanityOptions } from '@2toad/profanity';
import { CensorType } from '@2toad/profanity/dist/models';
import Alert from '../../components/Alert'
import { useAuth } from '../../context/AuthContext';
import SignInPrompt from '../../components/SignInPrompt'
import Link from 'next/link';
import YoutubeLazyLoad from '../../components/YoutubeLazyLoad';

const PostPage = (props) => {
    const { user } = useAuth();
    var UID;

    if (user.uid) {
        UID = user.uid
    } else {
        UID = 'Ndbd5FSAl4QOMKyGaEY1866oNQk1'
    }

    const [newComment, setNewComment] = useState('');
    const [showAlert, setShowAlert] = useState(false)
    const [showVotingAlert, setShowVotingAlert] = useState(false)
    const [showSignInPrompt, setShowSignInPrompt] = useState(false)
    const [comments, loading, error] = useCollection(
        query(collection(db, 'Comments'), where('parentPost', '==', props.id), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [author, accountLoading, accountError] = useDocument(
        doc(db, 'Users', props.post.author),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [loggedInUserData, loggedInUserDataLoading, loggedInUserDataError] = useDocument(
        doc(db, 'Users', UID),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        var tempComment = profanity.censor(newComment);
        //console.log(loggedInUserData?.data().username)

        if (user.uid === null) {
            setShowSignInPrompt(true)
        } else if (newComment != tempComment) {
            setShowAlert(true)
        } else {
            setShowAlert(false)
            const CommentsRef = collection(db, 'Comments')
            var commentToSend = newComment
            setNewComment('')

            return addDoc(CommentsRef, {
                created: serverTimestamp(),
                comment: commentToSend,
                author: loggedInUserData?.id,
                authorUserName: loggedInUserData?.data().username,
                helpfulCount: 0,
                unhelpfulCount: 0,
                parentPost: props.id,
                upvoteUsers: [],
                downvoteUsers: [],
            });
        };


    }

    const handleUpvote = (c) => {
        const upvoteRef = doc(db, 'Comments', c.id)
        const upvoteCount = c.data().helpfulCount + 1;

        //determine if the user is the comment author
        if (c.data().author === loggedInUserData?.id) {
            setShowVotingAlert(true)
            console.log('cannot vote own comment')
            return;
        }

        //determine if user has already upvoted
        if (c.data().upvoteUsers.includes(loggedInUserData?.id)) {
            console.log('already upvoted')
            //remove the user from the list of upvoters
            const upvoteUsers = c.data().upvoteUsers.filter((user) => user !== loggedInUserData?.id)
            return updateDoc(upvoteRef, {
                updated: serverTimestamp(),
                helpfulCount: upvoteCount - 2,
                upvoteUsers: upvoteUsers
            });
        }

        //determine if user has already downvoted
        if (c.data().downvoteUsers.includes(loggedInUserData?.id)) {
            console.log('already downvoted')
            //remove the user from the list of downvoters
            const downvoteUsers = c.data().downvoteUsers.filter((user) => user !== loggedInUserData?.id)
            return updateDoc(upvoteRef, {
                updated: serverTimestamp(),
                helpfulCount: upvoteCount,
                unhelpfulCount: c.data().unhelpfulCount - 1,
                upvoteUsers: [...c.data().upvoteUsers, loggedInUserData?.id],
                downvoteUsers: downvoteUsers
            });
        }

        return updateDoc(upvoteRef, {
            updated: serverTimestamp(),
            helpfulCount: upvoteCount,
            upvoteUsers: [...c.data().upvoteUsers, loggedInUserData?.id]
        });
    };

    const handleDownvote = (c) => {
        const downvoteRef = doc(db, 'Comments', c.id)
        const downvoteCount = c.data().unhelpfulCount + 1;

        //determine if the user is the comment author
        if (c.data().author === loggedInUserData?.id) {
            console.log('cannot vote own comment')
            setShowVotingAlert(true)
            return;
        }

        //determine if user has already downvoted
        if (c.data().downvoteUsers.includes(loggedInUserData?.id)) {
            console.log('already downvoted')
            //remove the user from the list of upvoters
            const downvoteUsers = c.data().downvoteUsers.filter((user) => user !== loggedInUserData?.id)
            return updateDoc(downvoteRef, {
                updated: serverTimestamp(),
                unhelpfulCount: downvoteCount - 2,
                downvoteUsers: downvoteUsers
            });
        }

        //determine if the user has already upvoted
        if (c.data().upvoteUsers.includes(loggedInUserData?.id)) {
            console.log('already upvoted')
            //remove the user from the list of upvoters
            const upvoteUsers = c.data().upvoteUsers.filter((user) => user !== loggedInUserData?.id)
            return updateDoc(downvoteRef, {
                updated: serverTimestamp(),
                helpfulCount: c.data().helpfulCount - 1,
                unhelpfulCount: downvoteCount,
                upvoteUsers: upvoteUsers,
                downvoteUsers: [...c.data().downvoteUsers, loggedInUserData?.id]
            });
        }

        return updateDoc(downvoteRef, {
            updated: serverTimestamp(),
            unhelpfulCount: downvoteCount,
            downvoteUsers: [...c.data().downvoteUsers, loggedInUserData?.id]
        });
    };

    const options = new ProfanityOptions();
    options.wholeWord = false;
    //options.grawlix = 'waluigi';
    options.grawlix = '*****';
    options.grawlixChar = '*';

    const profanity = new Profanity(options);


    return (
        <div id='page'>
            {showAlert && <Alert message="⚠️ Profanity Warning! ⚠️" setShow={setShowAlert} />}
            {showVotingAlert && <Alert message='You cannot vote on your own comment!' setShow={setShowVotingAlert} />}
            {showSignInPrompt && <SignInPrompt setShow={setShowSignInPrompt} />}
            <div className='flex flex-col items-center w-2/3 mx-auto mt-10 space-y-6' >
                <div id='header' className='flex flex-col items-center pb-6 text-center'>
                    <h1 className='pb-1 text-4xl font-medium font-HindSiliguri'>{props.post.title}</h1>
                    <h3 className='font-IBMPlexSans'>From <Link href={`/profile/${props.post.author}`}><a className="underline">{author?.data().username}</a></Link></h3>
                    <h3 className='font-IBMPlexSans'>Submitted on <em>{new Date(props.post.created).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</em> at <em>{new Date(props.post.created).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em> </h3>
                </div>
                <div id='body' className='flex flex-col justify-center pb-16 space-y-2 space-x-18 lg:space-y-0 lg:grid lg:grid-cols-3'>
                    <p className='lg:col-span-2 lg:mr-4'>{props.post.description}</p>
                    <div>{<YoutubeLazyLoad video={props.post.vidLink} />}</div>
                </div>
            </div>
            <div id='comments' className='grid justify-center grid-cols-12 px-4 pb-8'>
                <div id='leftCol' className='justify-center col-span-5 text-center'>
                    <h2 className='text-3xl pb-[.37rem] font-semibold text-center font-HindSiliguri'>Leave Feedback</h2>
                    <hr className="border-[1.5px] justify-center rounded-full mx-auto w-[30rem]"></hr>
                    <div className='flex flex-col pl-6 pr-12 space-y-2 '>
                        <textarea type="text" value={newComment} onChange={(e) => { setNewComment(e.target.value) }} rows={14} className='justify-center p-2 mt-4 mb-4 text-lg' placeholder="Leave some feedback!" />
                        <input value="Submit" onClick={(e) => { handleSubmit(e); }} className="p-2 m-2 ml-auto mr-14 w-1/4 bg-white border-2 text-lg  cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium" type='submit' />
                    </div>

                </div>
                <div id='rightCol' className='justify-center col-span-7 pr-16 mr-0'>
                    <h2 className='text-3xl pb-[.37rem] font-semibold text-center font-HindSiliguri'>Read Feedback</h2>
                    <hr className="border-[1.5px] justify-center rounded-full mx-auto w-[30rem]"></hr>
                    <ul>
                        {error && <strong>Error! <br /> {JSON.stringify(error)} </strong>}
                        {loading && <em>Loading...</em>}
                        {comments && comments.docs.map((c) => {
                            return (
                                <div id='comment' key={c.id} className='p-4 px-8 mt-4 text-black bg-white font-IBMPlexSans'>
                                    <p id='comment-content' className='pb-6'>{c.data().comment}</p>

                                    <div className='flex flex-row items-end space-x-4 font-HindSiliguri'>
                                        <div className='mr-auto space-x-4'>
                                            <button onClick={() => handleUpvote(c)} className='px-2 py-1 font-medium text-black transition bg-purple-200 border border-purple-400 shadow-md active:-translate-y-1'>{c.data().helpfulCount} | Helpful</button>
                                            <button onClick={() => handleDownvote(c)} className='px-2 py-1 font-medium text-black transition bg-purple-200 border border-purple-400 shadow-md active:-translate-y-1'>{c.data().unhelpfulCount} | Unhelpful</button>
                                        </div>
                                        <div>
                                            <h4 id='comment-author' className='pt-4 pb-0 text-lg font-medium font-HindSiliguri'>From <Link href={`/profile/${c.data().author}`}><a className="underline">{c.data().authorUserName}</a></Link></h4>
                                            <h4 id='comment-author' className='pb-0 text-sm font-medium font-HindSiliguri'>Posted <em>{c.data().created?.toDate().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</em> at <em>{c.data().created?.toDate().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</em></h4>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
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