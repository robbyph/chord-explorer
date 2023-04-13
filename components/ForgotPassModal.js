import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ForgotPassModal = (props) => {
  const handleClose = () => {
    props.setShow(false);
  };

  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClick = async () => {
    await resetPassword(email)
      .catch((error) => {
        console.log('errro', error.message);
        setErr(error.message);
      })
      .finally(() => {
        setSubmitted(true);
      });
  };

  useEffect(() => {
    console.log('submitted', submitted);
    console.log('err', err);
    if (submitted) {
      if (err.length > 0) {
        props.onClose(err);
      } else {
        props.onClose('Password reset email sent!');
      }
    }
  }, [submitted, err]);

  return (
    <div
      className={`text-black mx-4 font-bold  xl:left-1/3 bg-amber-300 mt-4 xl:ml-24 top-0 z-10 fixed animate-slideup font-IBMPlexSans shadow-2xl`}
      css={{
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <div className='flex items-start justify-between mx-auto md:max-w-sm xl:max-w-md'>
        <div className='flex flex-col px-10 py-6'>
          <span className='mb-4 text-xl animate-pulse'>
            Enter your email to reset your password.
          </span>
          <input
            className='px-2 py-1 mb-4 bg-white'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='text'
          />
          <button
            onClick={handleClick}
            className='px-2 py-1 font-medium border border-white rounded-lg hover:bg-white hover:text-amber-600'
          >
            Reset Password
          </button>
        </div>
        <button onClick={handleClose} className='px-2 py-1 font-medium'>
          X
        </button>
      </div>
    </div>
  );
};

export default ForgotPassModal;
