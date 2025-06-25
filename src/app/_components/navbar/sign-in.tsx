'use client';

import { signIn } from 'next-auth/react';
import { FaKey } from 'react-icons/fa6';

import Button from '@/app/_components/ui/button';

function SignInButton() {
  return (
    <Button arialabel="Sign In" onClick={() => signIn('discord')} className="h-6 w-6 p-0 lg:h-8 lg:w-8">
      <FaKey size={20} />
      <span className="sr-only">Sign In</span>
    </Button>
  );
}

export default SignInButton;
