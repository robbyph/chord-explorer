import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Menu } from '@headlessui/react';

const Navigation = ({ currentPage }) => {
  const [showAcctDropdown, setShowAcctDropdown] = useState(false);
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const { user, logOut } = useAuth();
  const [username, setUsername] = useState('Account');

  useEffect(() => {
    if (showAcctDropdown) {
      setShowAcctDropdown(false);
    }

    if (showFeedbackDropdown) {
      setShowFeedbackDropdown(false);
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
      <nav className='z-10 flex flex-row gap-6 p-4 text-black 2xl:gap-8 font-IBMPlexSans'>
        <Link href='/search'>
          <a
            onClick={() => setShowAcctDropdown(false)}
            className='hover:animate-bounceslowonce'
          >
            Search
          </a>
        </Link>
        <Link href='/chordlibrary'>
          <a
            onClick={() => setShowAcctDropdown(false)}
            className='hover:animate-bounceslowonce'
          >
            Chord Library
          </a>
        </Link>

        <Link href='/submitsong'>
          <a
            onClick={() => setShowAcctDropdown(false)}
            className='hover:animate-bounceslowonce'
          >
            Submit A Song
          </a>
        </Link>
        <Link href='/chordrecognition'>
          <a
            onClick={() => setShowAcctDropdown(false)}
            className='hover:animate-bounceslowonce'
          >
            Chord Recognition
          </a>
        </Link>
        <Menu as='div' className='hover:animate-bounceslowonce'>
          <Menu.Button>
            Feedback
            <span className='text-xs'> ▼</span>
          </Menu.Button>
          <Menu.Items className='absolute flex flex-col bg-purple-200 border-2 border-purple-500 divide-y divide-white'>
            <Menu.Item className='flex-col'>
              {({ active }) => (
                <div className='px-2 py-1 hover:bg-purple-600 hover:text-white'>
                  <Link href='/givefeedback'>
                    <a
                      onClick={() => setShowAcctDropdown(false)}
                      className='hover:animate-bounceslowonce'
                    >
                      Give Feedback
                    </a>
                  </Link>
                </div>
              )}
            </Menu.Item>
            <Menu.Item className='flex-col'>
              {({ active }) => (
                <div className='px-2 py-1 hover:bg-purple-600 hover:text-white'>
                  <Link href='/submitfeedback'>
                    <a
                      onClick={() => setShowAcctDropdown(false)}
                      className='hover:animate-bounceslowonce'
                    >
                      Request Feedback
                    </a>
                  </Link>
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
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
                      onClick={() => setShowAcctDropdown(false)}
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
      </nav>
    </>
  );
};

export default Navigation;
