import React from 'react';
import { TbCardsFilled } from 'react-icons/tb';
import { FaDog, FaDungeon, FaHorse, FaMusic, FaWandMagicSparkles } from 'react-icons/fa6';
import { getServerAuthSession } from '@/server/auth';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import ThemeButton from './themeButton';
import StyledLink from '../ui/StyledLink';

async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 flex flex-row items-start justify-between p-4">
      <StyledLink href="/" className="pointer-events-auto">
        <h1 className="text-xl font-bold backdrop-blur-sm">dungeoneer</h1>
      </StyledLink>
      {/* Basic Menu */}
      <div className="pointer-events-auto flex flex-col gap-2">
        {session ? <SignOutButton /> : <SignInButton />}
        <ThemeButton />
        <StyledLink href="/dungeons">
          <FaDungeon size={20} />
        </StyledLink>
        <StyledLink href="/minions">
          <FaDog size={20} />
        </StyledLink>
        {/* <StyledLink href="/mounts">
          <FaHorse size={20} />
        </StyledLink>
        <StyledLink href="/cards">
          <TbCardsFilled size={20} />
        </StyledLink>
        <StyledLink href="/orchestrions">
          <FaMusic size={20} />
        </StyledLink>
        <StyledLink href="/spells">
          <FaWandMagicSparkles size={20} />
        </StyledLink> */}
      </div>
    </div>
  );
}

export default Navbar;
