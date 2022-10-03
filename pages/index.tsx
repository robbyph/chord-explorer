import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useCollection} from "react-firebase-hooks/firestore"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const Home: NextPage = () => {
    

  return (
    <div className={styles.container}>
      <Head>
        <title>Chord Explorer</title>
        <meta name="description" content="A music education website where you can search for songs based on the chords you're learning/teaching, as well as getting community based feedback on your playing!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className='text-orange-600'>Chord Explorer</span>
        </h1>

        <p className={styles.description}>
          Under construction. Please check back at a later time.
        </p>

        <div className={styles.grid}>
          <a href="https://github.com/robbyph/chord-explorer" className={styles.card}>
            <h2>Repository</h2>
            <p>View the repository on GitHub.</p>
          </a>

          <a href="" className={styles.card}>
            <h2>Current Users</h2>
            <p>View the repository on GitHub.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Thank you for your patience.</p>
      </footer>
    </div>
  )
}

export default Home
