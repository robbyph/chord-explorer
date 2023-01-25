import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../firebase/firestore";
import Link from "next/link";

const Home: NextPage = () => {
  const [value, loading, error] = useCollection(collection(db, "Users"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

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

      <main className="grid grid-cols-3 ">
        <div className="row-start-1">
          <svg
            version="1.1"
            id="svg9"
            width="2500"
            height="2500"
            viewBox="0 200 1632 1056"
            transform="rotate(-15) translate(0,-650)"
            fill="#380B4D"
            fill-opacity="1"
            fill-rule="nonzero"
            xmlns="http://www.w3.org/2000/svg"
            xmlns-svg="http://www.w3.org/2000/svg"
          >
            <defs id="defs13">
              <clipPath clipPathUnits="userSpaceOnUse" id="clipPath25">
                <path d="M 0,792 H 1224 V 0 H 0 Z" id="path23" />
              </clipPath>
            </defs>
            <g id="g17" transform="matrix(1.3333333,0,0,-1.3333333,0,1056)">
              <g id="g19">
                <g id="g21" clip-path="url(#clipPath25)">
                  <g id="g27" transform="translate(464.3965,365.834)">
                    <path
                      d="M 0,0 H 88.256 C 79.317,-15.583 62.896,-26.028 44.128,-26.028 25.36,-26.028 8.938,-15.583 0,0 M 92.692,10.274 C 91.919,7.903 90.988,5.62 89.899,3.425 L -1.935,5.138 h -0.414 c -0.776,1.668 -1.454,3.385 -2.032,5.136 z m -99.317,4.907 c -0.418,1.759 -0.75,3.538 -0.994,5.368 H 95.875 C 95.561,18.213 95.09,15.93 94.48,13.699 Z m -0.908,10.195 c -0.051,0.962 -0.086,1.924 -0.086,2.887 0,0.864 0.018,1.712 0.069,2.56 H 95.123 c 0.051,-0.848 0.068,-1.696 0.068,-2.56 0,-1.451 -0.068,-2.87 -0.188,-4.289 z m 0.786,8.872 c 0.137,1.976 0.326,3.124 0.548,4.254 0.052,0.308 0.12,0.616 0.206,0.883 H 94.129 c 0.052,0.384 0.069,0.247 0.103,0.11 0.428,-1.918 0.754,-3.887 0.959,-5.247 z m 1.918,9.571 c 0.377,1.323 0.805,2.645 1.267,3.931 0.24,0.642 0.479,1.285 0.719,1.909 h 93.924 c 0.005,-0.003 0.009,-0.006 0.014,-0.009 0.893,-2.225 1.648,-4.496 2.264,-6.84 z m 4.196,10.703 c 8.801,16.216 25.548,27.142 44.761,27.142 19.778,0 36.953,-11.576 45.532,-28.58 z m -123.813,-224.571 c 29.179,7.5 49.608,19.915 54.282,22.826 23.7,14.744 30.053,26.32 59.369,41.611 13.391,6.969 20.069,10.463 27.912,11.662 20.685,3.167 29.418,-6.884 70.019,-18.255 30.925,-8.682 41.028,-7.089 45.652,-6.096 17.157,3.665 29.881,14.213 33.494,17.244 8.784,7.449 14.11,15.086 16.747,19.282 4.16,6.677 8.425,15.616 12.175,34.007 1.918,9.401 4.161,23.545 4.555,49.71 0.017,0.788 0.017,1.559 0.034,2.278 L 551.875,12.354 563.04,4.734 672.632,2.199 V 63.588 L 668.061,68.674 561.516,63.588 547.32,51.414 197.824,57.955 c -0.005,0.004 -0.008,0.007 -0.012,0.012 -1.56,38.599 -1.129,39.693 -2.608,47.489 -3.476,18.048 -7.09,36.936 -22.844,53.272 -15.736,16.319 -38.46,24.761 -58.854,23.836 -10.702,-0.479 -19.966,-3.493 -26.37,-5.582 -14.795,-4.812 -17.09,-8.579 -37.039,-15.72 -11.644,-4.161 -18.973,-5.77 -27.398,-5.582 -1.575,0.034 -7.278,0.222 -14.213,2.038 -24.111,6.25 -48.203,27.894 -48.203,27.894 -23.546,21.165 -49.968,30.737 -71.544,38.563 -15.12,5.48 -59.008,20.737 -109.078,6.593 -10.737,-3.031 -31.696,-9.196 -52.262,-26.885 -19.024,-16.387 -27.929,-34.196 -33.991,-46.679 -15.377,-31.628 -17.312,-59.42 -19.795,-94.883 -1.883,-27.107 -0.685,-47.005 0.514,-66.971 1.986,-33.135 3.271,-52.005 11.679,-76.098 4.674,-13.408 10.531,-29.71 24.846,-46.68 15.429,-18.271 32.227,-27.312 40.087,-31.456 21.37,-11.267 39.984,-14.11 51.252,-15.737 7.894,-1.13 37.107,-4.812 73.563,4.572"
                      id="path29"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div className="row-start-1 p-4 ml-16 mt-80 absolute">
          <h2
            class="indexh2"
            className="p-2 text-4xl font-semibold font-HindSiliguri"
          >
            Learn guitar, without <br></br>the boring stuff!
          </h2>
          <div class="indexp">
            <p className="p-2 font-IBMPlexSans">
              Learn to play chords on the guitar while simultaneously learning
              the songs you know and love.
            </p>

            <p className="p-2 font-IBMPlexSans">
              Search for songs to learn based on what chords you are learning,
              then submit your performance for community based feedback.
            </p>

            <div
              class="indexbut"
              className="flex flex-row gap-4 p-4 pl-2 text-xl font-medium font-IBMPlexSans"
            >
              <Link href="/search">
                <a className="px-20 py-6 bg-[#5B21B6] rounded-md col-span-2">
                  Search
                </a>
              </Link>
              <Link href="/submitfeedback">
                <a className="px-20 py-6 bg-[#5B21B6] rounded-md col-span-3">
                  Get Feedback
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
