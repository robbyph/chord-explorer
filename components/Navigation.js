import { useEffect, useState } from "react";
import Link from "next/link";

const Navigation = ({ currentPage }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      setShow(false);
    }
  }, [currentPage]);

  return (
    <>
      <nav className="z-10 flex flex-row gap-8 p-4 text-black font-IBMPlexSans">
        <Link href="/">
          {currentPage === "/" ? (
            <a
              className="w-full px-3 py-3 font-bold no-underline transition-shad text-navPurple lg:w-auto lg:p-0 lg:border-none"
              onClick={() => setShow(false)} // would like to set as active class but it throws an error, for now hovering works. going to change stuff soon...
            >
              Home
            </a>
          ) : (
            <a
              className="w-full px-3 py-3 no-underline transition-shad lg:w-auto lg:p-0 text-navGreen hover:font-semibold lg:border-none"
              onClick={() => setShow(false)}
            >
              Home
            </a>
          )}
        </Link>
        <Link href="/search">
          {currentPage === "/search" ? (
            <a
              className="w-full px-3 py-3 font-bold no-underline transition-shad text-navPurple lg:w-auto lg:p-0 lg:border-none"
              onClick={() => setShow(false)}
            >
              Search
            </a>
          ) : (
            <a
              className="w-full px-3 py-3 no-underline transition-shad lg:w-auto lg:p-0 text-navGreen hover:font-semibold lg:border-none"
              onClick={() => setShow(false)}
            >
              Search
            </a>
          )}
        </Link>
        <Link href="/chordlibrary">
          {currentPage === "/chordlibrary" ? (
            <a
              className="w-full px-3 py-3 font-bold no-underline transition-shad text-navPurple lg:w-auto lg:p-0 lg:border-none"
              onClick={() => setShow(false)}
            >
              Chord Library
            </a>
          ) : (
            <a
              className="w-full px-3 py-3 no-underline transition-shad lg:w-auto lg:p-0 text-navGreen hover:font-semibold lg:border-none"
              onClick={() => setShow(false)}
            >
              Chord Library
            </a>
          )}
        </Link>
        <Link href="/givefeedback">
          {currentPage === "/givefeedback" ? (
            <a
              className="w-full px-3 py-3 font-bold no-underline transition-shad text-navPurple lg:w-auto lg:p-0 lg:border-none"
              onClick={() => setShow(false)}
            >
              Give Feedback
            </a>
          ) : (
            <a
              className="w-full px-3 py-3 no-underline transition-shad lg:w-auto lg:p-0 text-navGreen hover:font-semibold lg:border-none"
              onClick={() => setShow(false)}
            >
              Give Feedback
            </a>
          )}
        </Link>
        <Link href="/submitfeedback">
          {currentPage === "/submitfeedback" ? (
            <a
              className="w-full px-3 py-3 font-bold no-underline transition-shad text-navPurple lg:w-auto lg:p-0 lg:border-none"
              onClick={() => setShow(false)}
            >
              Submit Feedback
            </a>
          ) : (
            <a
              className="w-full px-3 py-3 no-underline transition-shad lg:w-auto lg:p-0 text-navGreen hover:font-semibold lg:border-none"
              onClick={() => setShow(false)}
            >
              Submit Feedback
            </a>
          )}
        </Link>
        <Link href="/accountpage">
          {currentPage === "/accountpage" ? (
            <a
              className="w-full px-3 py-3 font-bold no-underline transition-shad text-navPurple lg:w-auto lg:p-0 lg:border-none"
              onClick={() => setShow(false)}
            >
              Account
            </a>
          ) : (
            <a
              className="w-full px-3 py-3 no-underline transition-shad lg:w-auto lg:p-0 text-navGreen hover:font-semibold lg:border-none"
              onClick={() => setShow(false)}
            >
              Account
            </a>
          )}
        </Link>
        <Link href="/submitsong">
          {currentPage === "/submitsong" ? (
            <a
              className="w-full px-3 py-3 font-bold no-underline transition-shad text-navPurple lg:w-auto lg:p-0 lg:border-none"
              onClick={() => setShow(false)}
            >
              Submit A Song
            </a>
          ) : (
            <a
              className="w-full px-3 py-3 no-underline transition-shad lg:w-auto lg:p-0 text-navGreen hover:font-semibold lg:border-none"
              onClick={() => setShow(false)}
            >
              Submit A Song
            </a>
          )}
        </Link>
        <Link href="/chordrecognition">
          {currentPage === "/chordrecognition" ? (
            <a
              className="w-full px-3 py-3 font-bold no-underline transition-shad text-navPurple lg:w-auto lg:p-0 lg:border-none"
              onClick={() => setShow(false)}
            >
              Chord Recognition
            </a>
          ) : (
            <a
              className="w-full px-3 py-3 no-underline transition-shad lg:w-auto lg:p-0 text-navGreen hover:font-semibold lg:border-none"
              onClick={() => setShow(false)}
            >
              Chord Recognition
            </a>
          )}
        </Link>
      </nav>
    </>
  );
};

export default Navigation;
