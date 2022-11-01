import React from "react";
import Head from "next/head";

const chord_id = () => {
  return (
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
        <h1 className="col-span-4 p-6 text-4xl">Find the Chords in Any Song, or get feedback on yourself playing a chord!</h1>
      </main>
    </div>
  );
};

export default chord_id;
