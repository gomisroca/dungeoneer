'use client';

import { type Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function SilentSignIn({ session }: { session: Session | null }) {
  useEffect(() => {
    if (session?.user?.email && 'credentials' in navigator && 'FederatedCredential' in window) {
      const store = async () => {
        // @ts-expect-error: TS doesn't support this yet
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const cred: Credential = new FederatedCredential({
          id: session.user.id,
          name: session.user.name ?? '',
          iconURL: session.user.image ?? '',
          provider: 'https://discord.com',
        });
        await navigator.credentials.store(cred);
      };

      store().catch(console.error);
    }

    if ('credentials' in navigator && !session) {
      void navigator.credentials
        .get({
          // @ts-expect-error: TS doesn't support this yet
          federated: {
            providers: ['https://discord.com'],
          },
          mediation: 'optional',
        })
        .then((cred) => {
          if (cred) {
            void signIn('discord');
          }
        });
    }
  }, [session]);

  return null;
}
