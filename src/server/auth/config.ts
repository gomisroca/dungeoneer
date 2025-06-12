import { PrismaAdapter } from '@auth/prisma-adapter';
import {
  type Card,
  type Emote,
  type Hairstyle,
  type Minion,
  type Mount,
  type Orchestrion,
  type Spell,
} from 'generated/prisma';
import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

import { env } from '@/env';
import { db } from '@/server/db';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      minions: Minion[];
      mounts: Mount[];
      orchestrions: Orchestrion[];
      spells: Spell[];
      cards: Card[];
      emotes: Emote[];
      hairstyles: Hairstyle[];
    } & DefaultSession['user'];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async session({ session, user }) {
      if (!user?.id) return session;

      const dbUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          minions: true,
          mounts: true,
          orchestrions: true,
          spells: true,
          cards: true,
          emotes: true,
          hairstyles: true,
        },
      });
      if (!dbUser) return session;

      return {
        ...session,
        user: {
          ...session.user,
          id: dbUser.id,
          minions: dbUser.minions,
          mounts: dbUser.mounts,
          orchestrions: dbUser.orchestrions,
          spells: dbUser.spells,
          cards: dbUser.cards,
          emotes: dbUser.emotes,
          hairstyles: dbUser.hairstyles,
        },
      };
    },
  },
} satisfies NextAuthConfig;
