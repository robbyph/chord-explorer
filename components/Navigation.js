import { useEffect, useState } from "react";
import Link from "next/link";
import { NavLink } from "react-router-dom";

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
        <NavLink
          href="/"
          className="main-nav"
          activeClassName="main-nav-active"
        >
          <a onClick={() => setShow(false)}>Home</a>
        </NavLink>
        <NavLink href="/search">
          <a onClick={() => setShow(false)}>Search</a>
        </NavLink>
        <NavLink href="/chordlibrary">
          <a onClick={() => setShow(false)}>Chord Library</a>
        </NavLink>
        <NavLink href="/givefeedback">
          <a onClick={() => setShow(false)}>Give Feedback</a>
        </NavLink>
        <NavLink href="/submitfeedback">
          <a onClick={() => setShow(false)}>Submit for Feedback</a>
        </NavLink>
        <NavLink href="/accountpage">
          <a onClick={() => setShow(false)}>Account</a>
        </NavLink>
        <NavLink href="/submitsong">
          <a onClick={() => setShow(false)}>Submit A Song</a>
        </NavLink>
        <NavLink href="/chordrecognition">
          <a onClick={() => setShow(false)}>Chord Recognition</a>
        </NavLink>
      </nav>
    </>
  );
};

export default Navigation;
