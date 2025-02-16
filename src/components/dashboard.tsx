'use client';

// import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { inviteSchema, TInviteSchema } from '@/lib/zod-schemas';
import { type TInvitation } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { type TApiCall } from '@/types/api-call';

export const Dashboard = () => {
  const authToken = localStorage.getItem('authToken');

  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const [invitations, setInvitations] = useState<TInvitation[]>([]);

  useEffect(() => {
    console.log(authToken);

    const fetchMe = async () => {
      const response = await fetch('/api/auth/me', {
        method: 'POST',
        body: JSON.stringify({ authToken }),
        headers: { 'Content-Type': 'application/json' },
      });

      const apiReturn: TApiCall = await response.json();

      if (apiReturn.success) {
        // toast.success(apiReturn.message);

        const { userId, username } = apiReturn.data as {
          userId: number;
          username: string;
        };

        setUserId(userId);
        setUsername(username);
      } else {
        toast.error(apiReturn.message);
      }
    };
    fetchMe();

    const fetchInvitations = async () => {
      const response = await fetch(`/api/invite?authToken=${authToken}`);

      const apiReturn: TApiCall = await response.json();

      if (apiReturn.success) {
        // toast.success(apiReturn.message);

        const { invitations } = apiReturn.data as {
          invitations: TInvitation[];
        };

        console.log(invitations);
        setInvitations(invitations);
      } else {
        toast.error(apiReturn.message);
      }
    };
    fetchInvitations();
  }, [authToken, userId]);

  const form = useForm<TInviteSchema>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      name: '',
      message: '',
    },
  });

  const onSubmit = async (values: TInviteSchema) => {
    console.log('invite form');
    console.log(values);

    const response = await fetch('/api/invite', {
      method: 'POST',
      body: JSON.stringify({ ...values, authToken }),
      headers: { 'Content-Type': 'application/json' },
    });

    const apiReturn: TApiCall = await response.json();

    if (apiReturn.success) {
      toast.success(apiReturn.message);
      toast.success('Reloading... Please wait.');

      setTimeout(() => location.reload(), 1000);
    } else {
      toast.error(apiReturn.message);
    }
  };

  const deleteInvitation = async (ref: string) => {
    const response = await fetch('/api/invite', {
      method: 'DELETE',
      body: JSON.stringify({ ref }),
      headers: { 'Content-Type': 'application/json' },
    });

    const apiReturn: TApiCall = await response.json();

    if (apiReturn.success) {
      toast.success(apiReturn.message);
      toast.success('Reloading... Please wait.');

      setTimeout(() => location.reload(), 1000);
    } else {
      toast.error(apiReturn.message);
    }
  };

  return (
    <div className='min-h-screen bg-pink-100 p-6'>
      <div className='max-w-2xl mx-auto space-y-6'>
        <div className='text-center text-pink-600 text-4xl font-bold'>
          Welcome, {username && username}!
        </div>
        <div className='text-center mt-4'>
          <Button
            className='bg-pink-500 hover:bg-pink-600 text-white rounded-lg py-2'
            onClick={() => {
              localStorage.removeItem('authToken');

              toast.success('Logout successful!');
              toast.success('Redirecting... Please wait.');

              setTimeout(() => location.reload(), 1000);
            }}>
            Logout
          </Button>
        </div>

        <Card className='bg-white shadow-xl rounded-xl p-6'>
          <CardHeader>
            <CardTitle className='text-pink-600 text-2xl font-bold'>
              Your Invitations
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              {invitations.map((invite) => (
                <div
                  key={invite.uuid}
                  className='p-4 bg-pink-50 border border-pink-200 rounded-lg'>
                  <p className='text-pink-700'>
                    For: <span className='font-semibold'>{invite.name}</span>
                  </p>
                  <p className='text-pink-600'>Message: {invite.message}</p>
                  <p className='text-pink-500'>Ref: {invite.ref}</p>
                  <p className='text-pink-500'>
                    Date: {new Date(invite.createdAt).toLocaleDateString()}
                  </p>
                  {invite.response ? (
                    <p className='text-pink-500'>Response: {invite.response}</p>
                  ) : (
                    <p className='text-pink-500'>Response: No response yet</p>
                  )}
                  <a
                    href={invite.accessLink}
                    target='_blank'
                    className='text-pink-400 underline'>
                    Access Invitation
                  </a>

                  <Button
                    variant={'destructive'}
                    onClick={() => deleteInvitation(invite.ref)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-pink-600 text-xl font-bold mb-4'>
              Create an Invitation
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className='mb-2 border-pink-300 focus:ring-pink-400'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          className='mb-2 border-pink-300 focus:ring-pink-400'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className='w-full bg-pink-500 hover:bg-pink-600 text-white rounded-lg py-2'>
                  Add Invitation
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
