import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useCollection} from "react-firebase-hooks/firestore"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { useEffect } from 'react'
import { db } from "../firebase/firestore";

const Home: NextPage = () => {

  const [value, loading, error] = useCollection(
    collection(db, 'Users'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  

  return (
    <div>
      <Head>
        <title>Chord Explorer</title>
        <meta name="description" content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='grid grid-cols-3 ml-16 mt-96 '>
        <div className='row-start-3'>
            <h2 className='text-4xl'>
          Learn guitar, without the boring stuff 
        </h2>

        <p className=''>
          Learn to play chords on the guitar while simultaneously learning the songs you know and love.
        </p>

        <p className=''>
          Search for songs to learn based on what chords you are learning, then submit your performance for community based feedback
        </p>

        <div>
          <a href="https://github.com/robbyph/chord-explorer" >
            Search
          </a>

          <a href="" >
            Get Feedback
          </a>
        </div>
        </div>
        
      </main>
    </div>
  )
}

export default Home
