'use client';

import { FaKey } from 'react-icons/fa6';
import Button from '../ui/Button';
import { signIn } from 'next-auth/react';

function SignInButton() {
  return (
    <Button name="Sign In" onClick={() => signIn('discord')}>
      <FaKey />
      <span className="sr-only">Sign In</span>
    </Button>
  );
}

export default SignInButton;
