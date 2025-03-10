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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { loginSchema, TLoginSchema } from '@/lib/zod-schemas';
import { Button } from './ui/button';
import { Input } from './ui/input';
import toast from 'react-hot-toast';
import { type TApiCall } from '@/types/api-call';

const LoginForm = () => {
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      pin: '',
    },
  });

  const onSubmit = async (values: TLoginSchema) => {
    console.log('login form');
    console.log(values);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...values }),
      headers: { 'Content-Type': 'application/json' },
    });

    const apiReturn: TApiCall = await response.json();

    if (apiReturn.success) {
      toast.success(apiReturn.message);

      const { token } = apiReturn.data as { token: string };

      localStorage.setItem('authToken', token);
      toast.success('Redirecting... Please wait.');

      setTimeout(() => location.reload(), 1000);
    } else {
      toast.error(apiReturn.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='pin'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pin code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='w-full bg-pink-500 hover:bg-pink-600'>Login</Button>
      </form>
    </Form>
  );
};

export { LoginForm };
