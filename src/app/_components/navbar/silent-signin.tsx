'use client';

import { type Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function SilentSignIn({ session }: { session: Session | null }) {
  // Store credentials when user is signed in
  useEffect(() => {
    if (!session?.user?.email) return;
    if (!('credentials' in navigator) || !('FederatedCredential' in window)) return;

    void (async () => {
      try {
        // @ts-expect-error: TS doesn't support FederatedCredential yet
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        const cred: Credential = new FederatedCredential({
          id: session.user.id,
          name: session.user.name ?? '',
          iconURL: session.user.image ?? '',
          provider: 'https://discord.com',
        });
        await navigator.credentials.store(cred);
      } catch (error) {
        console.error('Failed to store credentials:', error);
      }
    })();
  }, [session?.user?.email]);

  // Attempt silent sign-in when user is not signed in
  useEffect(() => {
    if (session) return;
    if (!('credentials' in navigator) || !('FederatedCredential' in window)) return;

    void navigator.credentials
      .get({
        // @ts-expect-error: TS doesn't support federated credential get yet
        federated: { providers: ['https://discord.com'] },
        mediation: 'optional',
      })
      .then((cred) => {
        if (cred) void signIn('discord');
      })
      .catch(console.error);
  }, [session]);

  return null;
}
