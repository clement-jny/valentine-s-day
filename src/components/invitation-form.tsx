'use client';

import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { inviteSchema, TInviteSchema } from '@/lib/zod-schemas';
import { type TUpdateInvitationDTO, type TApiCall } from '@/types';
import toast from 'react-hot-toast';

type TInvitationFormProps = {
  action: 'create' | 'edit';
  invitationData?: TUpdateInvitationDTO;
};

const InvitationForm = ({ action, invitationData }: TInvitationFormProps) => {
  const authToken = localStorage.getItem('authToken');

  const [messageLength, setMessageLength] = useState<number>(0);

  const methods = useForm<TInviteSchema>({
    resolver: zodResolver(inviteSchema),
    mode: 'onChange',
  });

  const onSubmit = async (values: TInviteSchema) => {
    console.log('invite form tsx');
    console.log(values);
    console.log(action);
    console.log(invitationData);

    const response = await fetch('/api/invite', {
      method: action === 'create' ? 'POST' : 'PATCH',
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

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={methods.control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Name</FormLabel>

              <FormControl>
                <Input
                  className='border-pink-300 focus:ring-pink-400'
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name='message'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  className='mb-2 border-pink-300 focus:ring-pink-400'
                  {...field}
                  onChange={(e) => {
                    if (
                      e.target.value.length <=
                      inviteSchema.shape.message.maxLength!
                    ) {
                      field.onChange(e);
                      setMessageLength(e.target.value.length);
                    }
                  }}
                />
              </FormControl>

              <FormDescription>
                {`${messageLength}/${inviteSchema.shape.message.maxLength!}`}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='w-full bg-pink-500 hover:bg-pink-600 text-white rounded-lg py-2'>
          {action === 'edit' ? 'Updating invitation' : 'Creating invitation'}
        </Button>
      </form>
    </Form>
  );
};

export { InvitationForm };
