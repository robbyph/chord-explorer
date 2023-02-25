//@ts-nocheck
import React, { useState } from "react";
import Head from "next/head";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { NextPage } from "next";
import GiveFeedback from "./givefeedback";

const SubmitFeedback: NextPage = () => {
  const [description, setDescription] = useState("");
  const [vidLink, setVidLink] = useState("");
  const [vidId, setVidId] = useState("");
  const [title, setTitle] = useState("");
  const [check, setCheck] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const PostsRef = collection(db, "Posts");
    if (vidLink.includes("/watch?v=")) {
      setVidId(vidLink.split("/watch?v=").pop());
    } else if (vidLink.includes("/embed/")) {
      setVidId(vidLink.split("/embed").pop());
    } else {
      setVidLink("");
    }
    addDoc(PostsRef, {
      title,
      vidLink,
      vidId,
      description,
      created: serverTimestamp(),
      author: "placeholder",
    })
      .then(() => {
        console.log("Document successfully written!");
        setTitle("");
        setVidLink("");
        setVidId("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

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

      <main className="grid grid-cols-4 ">
        <h1 className="col-span-4 p-6 text-4xl font-semibold text-white font-HindSiliguri">
          Submit for Feedback
        </h1>
        <div className="col-span-2 pl-6 pr-6 space-y-2">
          <div>
            <label
              htmlFor="title"
              className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl"
            >
              Title
            </label>
            <input
              className="w-full p-1 text-lg font-IBMPlexSans"
              minLength={3}
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              name="title"
              value={title}
              required
            />
          </div>

          <div>
            <label
              htmlFor="vidLink"
              className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl"
            >
              Video Link
            </label>
            <input
              className="w-full p-1 text-lg font-IBMPlexSans"
              minLength={3}
              type="text"
              onChange={(e) => {
                const vidLink = e.target.value;
                let vidId = "";

                if (vidLink.includes("/embed/")) {
                  vidId = vidLink.split("/embed/")[1];
                } else {
                  vidId = vidLink.split("/watch?v=").pop();
                }

                setVidLink(vidLink);
                setVidId(vidId);
              }}
              name="vidLink"
              value={vidLink}
              required
            />

            <p className="pt-1 pl-2 text-sm text-white font-IBMPlexSans">
              Testing Link: https://www.youtube.com/embed/8tPnX7OPo0Q
            </p>
            <input type="text" name="vidId" value={vidId} readOnly />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl"
            >
              Description
            </label>
            <textarea
              className="w-full p-1 min-h-[23rem] font-IBMPlexSans"
              minLength={3}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              name="description"
              value={description}
              required
            />
          </div>

          <div>
            <input
              type="checkbox"
              name="check"
              onChange={(e) => {
                setCheck(e.target.value);
              }}
              value={check}
              required
            />
            <label
              htmlFor="check"
              className="pl-2 text-base text-white font-IBMPlexSans"
            >
              This video does not contain lewd, inappropriate or adult-only
              content
            </label>
          </div>

          <input
            value="Submit"
            onClick={(e) => {
              check ? handleSubmit(e) : "AHHH";
            }}
            className="p-2 m-2 ml-0 bg-white border-2 text-lg rounded cursor-pointer text-[#5B21B6] font-IBMPlexSans font-medium"
            type="submit"
          />
        </div>

        <div className="col-span-2 px-20">
          <h2 className="block pl-2 text-base font-medium text-white font-IBMPlexSans lg:text-xl">
            Submission Preview
          </h2>
          <div className="flex flex-col items-center text-black bg-white">
            <h3 className="p-2 pb-0 text-2xl font-medium font-HindSiliguri">
              {title.length > 0 ? title : "Title Placeholder"}
            </h3>
            <p className="p-2 pt-1 text-sm font-IBMPlexSans text-[#808080]">
              Submitted by <span className="underline">Current User</span>
            </p>
            <iframe
              className="mx-auto"
              width="560"
              height="315"
              srcDoc={
                '<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href="https://www.youtube.com/embed/' +
                vidId +
                '"><img src="https://i.ytimg.com/vi/' +
                vidId +
                '/hqdefault.jpg" alt="Video Submission"><span>▶</span></a>'
              }
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video Submission"
            ></iframe>
            <p className="p-2 pb-6 font-IBMPlexSans">
              {description.length > 0
                ? description
                : "Type a description for your post, and it will appear here!"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitFeedback;
