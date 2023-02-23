import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
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
                bio: "This user hasn't created their bio yet...",
                comments: [],
                posts: []
            });
        }).catch((error) => {
            console.log(error.code)
            if (error.code == "auth/email-already-in-use") { console.log("User already exists. Try to log in") }
            else if (error.code == "auth/weak-password") { console.log("Password too weak. Strengthen it by increasing its length or complexity.") }

        })
        //then, we create a database object, with the same uid, for their other data
    };

    const logIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password).catch((error) => {
            console.log(error.code)
            if (error.code == "auth/wrong-password") { console.log("Invalid Login Attempt") }
        });
    };

    const logOut = async () => {
        setUser({ email: null, uid: null });
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user: user, signUp, logIn, logOut }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};