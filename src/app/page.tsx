'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');
  const [backgroundClass, setBackgroundClass] = useState<string>('bg-pink-100');

  const yesMessages = [
    'YAY! Best decision ever! 🎉❤️🐱',
    'You just made my heart the happiest! 💖🥰',
    "OMG! I knew you couldn't resist! 😏💘",
    'Purr-fect! You’re my forever Valentine! 🐾💝',
    'This is better than a movie! My heart is yours! 🎬💞',
  ];

  const noMessages = [
    'Oh no... My heart is broken 💔😿',
    "I guess I'll wait for you... 💔😢",
    'Wait... Are you sure? Really sure? Last chance! 🙀',
    'Meow... My tiny kitty heart is crushed! 😿',
    'I shall retreat into the shadows... forever... 😔🌑',
  ];

  const getRandomMessage = (messages: string[]) =>
    messages[Math.floor(Math.random() * messages.length)];

  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const handleYesClick = () => {
    setAnswer(true);
    setMessage(getRandomMessage(yesMessages));
    setBackgroundClass('bg-fuchsia-200 animate-hearts');
  };
  const handleNoClick = () => {
    setAnswer(false);
    setMessage(getRandomMessage(noMessages));
    setBackgroundClass('bg-gray-800 animate-broken-hearts');
  };

  return (
    <main
      className={`relative h-screen flex justify-center items-center transition-all duration-500 ${backgroundClass} bg-gradient-to-br from-pink-500 via-rose-300 to-purple-400`}>
      <div className='p-8 relative bg-pink-200 rounded-lg'>
        {/* min-w-[500px] min-h-[480px] */}
        <h1 className='text-4xl font-bold text-pink-600 mb-6 text-center'>
          Will you be my Valentine?
        </h1>

        <div className='flex justify-center space-x-4 mb-4 relative'>
          <button
            ref={yesButtonRef}
            type='button'
            onClick={handleYesClick}
            className='shadow-lg bg-pink-300 text-pink-800 px-6 py-3 rounded-full border border-purple-400 transition-all duration-200 transform hover:bg-pink-400 hover:scale-110'>
            YES
          </button>

          <button
            ref={noButtonRef}
            type='button'
            onClick={handleNoClick}
            className='shadow-lg bg-pink-300 text-pink-800 px-6 py-3 rounded-full border border-purple-400 transition-all duration-200 transform hover:bg-pink-400 hover:scale-110'>
            NO
          </button>
        </div>

        {answer !== null && (
          <p className='text-pink-600 text-center text-lg fade-in-bounce'>
            {message}
          </p>
        )}

        {answer !== null && (
          <div className='flex justify-center mt-4'>
            <Image
              src={answer ? '/happy-cat.jpg' : '/sad-cat.jpg'}
              alt='Meme cat'
              width={250}
              height={250}
              className='rounded-lg shadow-lg'
            />
          </div>
        )}
      </div>
    </main>
  );
}
