import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Menu } from '@headlessui/react';

const Navigation = ({ currentPage }) => {
  const [show, setShow] = useState(false);
  const { user, logOut } = useAuth();
  const [username, setUsername] = useState('Account');

  useEffect(() => {
    if (show) {
      setShow(false);
    }
  }, [currentPage]);

  useEffect(() => {
    if (user.username != undefined && user.username != null) {
      if (user.username.length > 14) {
        setUsername(user.username.substring(0, 14) + '...');
      } else {
        setUsername(user.username);
      }
    }
  }, [user, currentPage]);

  const handleLogout = async () => {
    try {
      setUsername('Account');
      await logOut();
      router.push('/login');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <nav className='z-10 flex flex-row gap-8 p-4 text-black font-IBMPlexSans'>
        <Link href='/'>
          <a
            onClick={() => setShow(false)}
            className='hover:animate-bounceslowonce'
          >
            Home
          </a>
        </Link>
        <Link href='/search'>
          <a
            onClick={() => setShow(false)}
            className='hover:animate-bounceslowonce'
          >
            Search
          </a>
        </Link>
        <Link href='/chordlibrary'>
          <a
            onClick={() => setShow(false)}
            className='hover:animate-bounceslowonce'
          >
            Chord Library
          </a>
        </Link>
        <Link href='/givefeedback'>
          <a
            onClick={() => setShow(false)}
            className='hover:animate-bounceslowonce'
          >
            Give Feedback
          </a>
        </Link>
        <Link href='/submitfeedback'>
          <a
            onClick={() => setShow(false)}
            className='hover:animate-bounceslowonce'
          >
            Submit for Feedback
          </a>
        </Link>
        <Menu as='div' className='hover:animate-bounceslowonce'>
          <Menu.Button>
            {username}
            <span className='text-xs'> ▼</span>
          </Menu.Button>
          <Menu.Items className='absolute flex flex-col bg-purple-200 border-2 border-purple-500 divide-y divide-white'>
            <Menu.Item className='flex-col'>
              {({ active }) => (
                <div className='px-2 py-1 hover:bg-purple-600 hover:text-white'>
                  <Link href='/accountpage'>
                    <a
                      className={`${active && 'font-HindSiliguri'}`}
                      onClick={() => setShow(false)}
                    >
                      View Account
                    </a>
                  </Link>
                </div>
              )}
            </Menu.Item>
            <Menu.Item className='flex-col'>
              {({ active }) => (
                <div className='px-2 py-1 hover:bg-purple-600 hover:text-white'>
                  <Link href='/'>
                    <a
                      onClick={handleLogout}
                      className={`${active && 'font-HindSiliguri'}`}
                    >
                      Log Out
                    </a>
                  </Link>
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
        <Link href='/submitsong'>
          <a
            onClick={() => setShow(false)}
            className='hover:animate-bounceslowonce'
          >
            Submit A Song
          </a>
        </Link>
        <Link href='/chordrecognition'>
          <a
            onClick={() => setShow(false)}
            className='hover:animate-bounceslowonce'
          >
            Chord Recognition
          </a>
        </Link>
      </nav>
    </>
  );
};

export default Navigation;
