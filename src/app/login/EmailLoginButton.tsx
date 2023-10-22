"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const EmailLoginButton = () => {
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const emailSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDisabled(true);
    signIn("email", { email });
  };

  return (
    <form className='flex w-full flex-col gap-2' onSubmit={emailSignIn}>
      <label htmlFor='email' className='text-lg font-semibold'>
        Email
      </label>
      <input
        type='email'
        name='email'
        id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='fiornote@fiorek.codes'
        className='rounded-lg border-2 p-2 text-slate-800 focus-visible:border-sky-600 focus-visible:outline-none'
      />
      <button
        type='submit'
        disabled={isDisabled}
        className='flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 fill-slate-200 px-4 py-2 text-xl font-semibold text-slate-200 shadow-xl transition-colors duration-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-20 dark:bg-slate-300 dark:fill-slate-800 dark:text-slate-800 dark:hover:bg-slate-100'
      >
        <p>Send Magic Link</p>
        {isDisabled ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 animate-spin'
            viewBox='0 0 24 24'
            stroke='currentColor'
            fill='currentColor'
          >
            <path d='M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z' />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='h-6 w-6'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
            />
          </svg>
        )}
      </button>
    </form>
  );
};

export default EmailLoginButton;
