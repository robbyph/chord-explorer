import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth, db } from "../firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, DocumentData, getDocs, orderBy, query, QueryDocumentSnapshot, where } from "firebase/firestore";

interface UserType {
    email: string | null;
    uid: string | null;
    username: string | null;
    bio: string | null;
    comments: Array<Object> | null;
    posts: Array<Object> | null;
}

const AuthContext = createContext({});

export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType>({ email: null, uid: null, username: null, bio: null, comments: null, posts: null });
    const [loading, setLoading] = useState<boolean>(true);
    const [account, accountLoading, accountError] = useCollection(
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
        query(collection(db, 'Posts'), where('author', '==', user.uid), orderBy('created', 'desc')),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect(() => {
        var acctData: DocumentData;
        var commentData: QueryDocumentSnapshot<DocumentData>[]
        var postsData: QueryDocumentSnapshot<DocumentData>[]

        if (account) {
            acctData = account.docs[0].data()
        } else {
            acctData = { username: 'Account', bio: 'null' }
        }

        if (comments) {
            commentData = comments.docs
        } else {
            commentData = []
        }

        if (posts) {
            postsData = posts.docs
        } else {
            postsData = []
        }


        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    email: user.email,
                    uid: user.uid,
                    username: acctData.username,
                    bio: acctData.bio,
                    comments: commentData,
                    posts: postsData
                });
            } else {
                setUser({ email: null, uid: null, username: null, bio: null, comments: null, posts: null });
            }
        });
        setLoading(false);

        return () => unsubscribe();
    }, [account, comments, posts]);

    const signUp = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const logIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = async () => {
        setUser({ email: null, uid: null, username: null, bio: null, comments: null, posts: null });
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};