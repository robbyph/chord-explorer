import { useEffect, useState } from 'react';
import Link from 'next/link';

const Navigation = ({ currentPage }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      setShow(false);
    }
  }, [currentPage]);

  return (
    <>
      <nav className='z-10 flex flex-row gap-12 p-4 text-black'>
        <Link href='/'>
          <a onClick={() => setShow(false)}>Home</a>
        </Link>
        <Link href='/search'>
          <a onClick={() => setShow(false)}>Search</a>
        </Link>
        <Link href='/chordlibrary'>
          <a onClick={() => setShow(false)}>Chord Library</a>
        </Link>
        <Link href='/givefeedback'>
          <a onClick={() => setShow(false)}>Give Feedback</a>
        </Link>
        <Link href='/submitfeedback'>
          <a onClick={() => setShow(false)}>Submit for Feedback</a>
        </Link>
        <Link href='/accountpage'>
          <a onClick={() => setShow(false)}>Account</a>
        </Link>
        <Link href='/submitsong'>
          <a onClick={() => setShow(false)}>Submit A Song</a>
        </Link>
      </nav>
    </>
  );
};

export default Navigation;
