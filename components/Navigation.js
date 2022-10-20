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
      <nav className='flex flex-row gap-12 p-4'>
        <Link href='/'>
          <a onClick={() => setActive(false)}>Home</a>
        </Link>
        <Link href='/search'>
          <a onClick={() => setActive(false)}>Search</a>
        </Link>
        <Link href='/chordlibrary'>
          <a onClick={() => setActive(false)}>Chord Library</a>
        </Link>
        <Link href='/givefeedback'>
          <a onClick={() => setActive(false)}>Give Feedback</a>
        </Link>
        <Link href='/submitfeedback'>
          <a onClick={() => setActive(false)}>Submit Feedback</a>
        </Link>
        <Link href='/accountpage'>
          <a onClick={() => setActive(false)}>Account</a>
        </Link>
        <Link href='/submitsong'>
          <a onClick={() => setActive(false)}>Submit A Song</a>
        </Link>
      </nav>
    </>
  );
};

export default Navigation;
