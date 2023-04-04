import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, DocumentData, getDocs, orderBy, query, QueryDocumentSnapshot, setDoc, where } from "firebase/firestore";


interface UserType {
    email: string | null;
    uid: string | null;
}

const AuthContext = createContext({});

export const useAuth = () => useContext<any>(AuthContext);


export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType>({ email: null, uid: null });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    email: user.email,
                    uid: user.uid
                });
            } else {
                setUser({ email: null, uid: null });
            }
            setLoading(false);
        });


        return () => unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, username: string) => {
        //first we let firebase create their auth account
        await createUserWithEmailAndPassword(auth, email, password).then((credentials) => {
            setDoc(doc(db, "Users", credentials.user.uid), {
                acctActive: true,
                email: email,
                username: username,
                bio: "",
                comments: [],
                posts: []
            });
        }).catch((error) => {
            throw error;
        })
        //then, we create a database object, with the same uid, for their other data
    };

    const logIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password).catch((error) => {
            throw error;
        });
    };

    const logOut = async () => {
        setUser({ email: null, uid: null });
        await signOut(auth);
    };

    const resetPassword = (email: string) => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Password reset email sent!")
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <AuthContext.Provider value={{ user: user, signUp, logIn, logOut, resetPassword }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};