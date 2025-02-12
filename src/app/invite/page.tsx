'use client';

import Image from 'next/image';
import { EStatus, type TInvite } from '@/types/invite';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type TApiCall } from '@/types/api-call';
import toast from 'react-hot-toast';

const InvitePage = () => {
  const [invite, setInvite] = useState<TInvite | null>(null);

  const [answer, setAnswer] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');
  const [backgroundClass, setBackgroundClass] = useState<string>('bg-pink-100');
  const [selectedButton, setSelectedButton] = useState<'yes' | 'no' | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const updateInvitationStatus = async (
    ref: string,
    status: keyof typeof EStatus
  ) => {
    try {
      const response = await fetch(`/api/invite/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref, status }),
      });

      if (!response.ok) {
        console.error('Failed to update invitation status');
      }
    } catch (error) {
      console.error('Error updating invitation status:', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');

    if (!refParam) location.href = '/';

    const fetchInvite = async () => {
      const response = await fetch(`/api/invite?ref=${refParam}`);

      const apiReturn: TApiCall = await response.json();

      if (apiReturn.success) {
        // toast.success(apiReturn.message);

        const { invitation } = apiReturn.data as { invitation: TInvite };

        console.log(invitation);
        if (invitation === undefined) location.href = '/';

        setInvite(invitation);
        updateInvitationStatus(invitation.ref, 'OPEN');
      } else {
        toast.error(apiReturn.message);
      }
    };
    fetchInvite();
  }, []);

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

  const handleYesClick = () => {
    setSelectedButton('yes');
    setAnswer(true);
    setMessage(getRandomMessage(yesMessages));
    setBackgroundClass('bg-fuchsia-200 animate-hearts');
    setConfirmationMessage('');
  };
  const handleNoClick = () => {
    setSelectedButton('no');
    setAnswer(false);
    setMessage(getRandomMessage(noMessages));
    setBackgroundClass('bg-gray-800 animate-broken-hearts');
    setConfirmationMessage('');
  };

  const handleSubmitAnswer = async () => {
    if (!invite || !selectedButton) return;

    setIsSubmitting(true);
    setConfirmationMessage(null);

    try {
      const response = await fetch(`/api/invite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: invite.ref,
          response: selectedButton,
        }),
      });

      const apiReturn: TApiCall = await response.json();

      if (apiReturn.success) {
        // toast.success(apiReturn.message);

        setConfirmationMessage('Your response has been successfully sent! 🎉');
        updateInvitationStatus(invite.ref, 'COMPLETED');
      } else {
        // toast.success(apiReturn.message);

        setConfirmationMessage(
          'Oops, something went wrong. Please try again! 😿'
        );
      }
    } catch (error) {
      console.error('Error submitting the response:', error);
      setConfirmationMessage('Connection error. Please try again later! 🔌❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    invite && (
      <main
        className={`relative h-screen flex justify-center items-center transition-all duration-500 ${backgroundClass} bg-gradient-to-br from-pink-500 via-rose-300 to-purple-400`}>
        <Card className='p-8 relative bg-pink-200 rounded-lg border-none'>
          {/* min-w-[500px] min-h-[480px] */}
          <CardHeader>
            <CardTitle className='text-4xl font-bold text-pink-600 mb-3 text-center'>
              {invite.message}
            </CardTitle>
            <CardDescription className='text-pink-600 mb-4 text-lg'>
              Please {invite.name}, say YES!!
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='flex justify-center space-x-4 mb-4 relative'>
              <button
                ref={yesButtonRef}
                type='button'
                onClick={handleYesClick}
                className={`shadow-lg px-6 py-3 rounded-full border border-purple-400 transition-all duration-200 transform ${
                  selectedButton === 'yes'
                    ? 'bg-pink-500 text-white scale-110'
                    : 'bg-pink-300 text-pink-800 hover:bg-pink-400 hover:scale-105'
                }`}>
                YES
              </button>

              <button
                ref={noButtonRef}
                type='button'
                onClick={handleNoClick}
                className={`shadow-lg px-6 py-3 rounded-full border border-purple-400 transition-all duration-200 transform ${
                  selectedButton === 'no'
                    ? 'bg-gray-600 text-white scale-110'
                    : 'bg-pink-300 text-pink-800 hover:bg-pink-400 hover:scale-105'
                }`}>
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
          </CardContent>

          <CardFooter
            className='transition-opacity duration-500 flex flex-col'
            style={{ opacity: selectedButton ? 1 : 0 }}>
            {selectedButton && (
              <Button
                className='w-full bg-pink-500 hover:bg-pink-600 rounded-lg py-2'
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            )}

            {confirmationMessage && (
              <p className='text-center mt-4 font-bold text-fuchsia-400'>
                {confirmationMessage}
              </p>
            )}
          </CardFooter>
        </Card>
      </main>
    )
  );
};

export default InvitePage;
