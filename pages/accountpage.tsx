import React from "react";
import Head from "next/head";
import ProtectedRoute from "../components/ProtectedRoute";

const accountpage = () => {
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
                    <h1 className="col-span-4 p-6 text-4xl font-semibold font-HindSiliguri">My Account</h1>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default accountpage;
