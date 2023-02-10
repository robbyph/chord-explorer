import React from "react";
import Head from "next/head";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { collection, query, where } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase/firestore";


const accountpage = () => {
    const { user } = useAuth();
    const [account, loading, error] = useCollection(
        query(collection(db, 'Users'), where('userUID', '==', user.uid)),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    console.log(user.uid)

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
                <main>
                    <h1 className="col-span-4 p-6 text-4xl font-semibold font-HindSiliguri">{ }'s Account</h1>
                    <div className="col-span-4 p-6 font-IBMPlexSans">
                        <h2 className="text-2xl font-semibold font-HindSiliguri">Account Info</h2>
                        {error && <strong>Error! <br /> {JSON.stringify(error)} </strong>}
                        {loading && <em>Loading...</em>}
                        {account &&
                            <span>Email: {account.docs[0].data().email}</span>}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default accountpage;
