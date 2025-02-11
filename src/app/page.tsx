'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import { LoginForm } from '@/components/login-form';
import { RegisterForm } from '@/components/register-form';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className='flex justify-center items-center h-screen bg-rose-100'>
      <Card className='w-full max-w-md p-6 shadow-lg'>
        <CardHeader className='flex flex-col items-center gap-1.5'>
          <CardTitle className='text-pink-600 text-3xl font-bold'>
            {isRegister ? 'Create an account' : 'Login to your account'}
          </CardTitle>

          <CardDescription>
            <div className='flex justify-center gap-2 mb-4'>
              <span>Login</span>
              <Switch checked={isRegister} onCheckedChange={setIsRegister} />
              <span>Register</span>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isRegister ? <RegisterForm /> : <LoginForm />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
