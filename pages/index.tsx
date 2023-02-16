import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useCollection } from "react-firebase-hooks/firestore"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { useEffect } from 'react'
import { db } from "../firebase/firestore";
import Link from 'next/link'

const Home: NextPage = () => {

    return (
        <div>
            <Head>
                <title>Chord Explorer</title>
                <meta name="description" content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='grid grid-cols-3 '>
                <div className='row-start-3 p-4 bg-[#120724] ml-16 mt-80'>
                    <h2 className='p-2 text-4xl font-semibold font-HindSiliguri'>
                        Learn guitar, without the boring stuff!
                    </h2>

                    <p className='p-2 font-IBMPlexSans'>
                        Learn to play chords on the guitar while simultaneously learning the songs you know and love.
                    </p>

                    <p className='p-2 font-IBMPlexSans'>
                        Search for songs to learn based on what chords you are learning, then submit your performance for community based feedback.
                    </p>

                    <div className='flex flex-row gap-4 p-4 pl-2 text-xl font-medium font-IBMPlexSans '>
                        <Link href="/search">
                            <a className='px-4 py-2 bg-[#5B21B6]  col-span-2'>
                                Search
                            </a>
                        </Link>
                        <Link href="/submitfeedback">
                            <a className='px-4 py-2 bg-[#5B21B6]  col-span-3'>
                                Get Feedback
                            </a>
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Home
