'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TbCardsFilled } from 'react-icons/tb';
import { FaCaretDown, FaDog, FaHorse, FaMusic, FaWandMagicSparkles, FaFaceLaugh, FaScissors } from 'react-icons/fa6';
import StyledLink from '../ui/StyledLink';
import Image from 'next/image';
import { type Session } from 'next-auth';
import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import ThemeButton from './themeButton';
import { Separator } from '../ui/Separator';
import { LuSearch } from 'react-icons/lu';
import SyncButton from './SyncButton';

type NavbarMenuProps = {
  session: Session | null;
};

function ExpandedMenu({ session }: { session: Session | null }) {
  return (
    <div
      data-testid="expandable-menu"
      className="mt-2 flex max-h-[800px] flex-col items-center justify-center gap-2 py-2">
      <StyledLink href="/collectible/minions" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaDog size={20} />
      </StyledLink>
      <StyledLink href="/collectible/mounts" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaHorse size={20} />
      </StyledLink>
      <StyledLink href="/collectible/cards" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <TbCardsFilled size={20} />
      </StyledLink>
      <StyledLink href="/collectible/orchestrions" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaMusic size={20} />
      </StyledLink>
      <StyledLink href="/collectible/spells" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaWandMagicSparkles size={20} />
      </StyledLink>
      <StyledLink href="/collectible/emotes" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaFaceLaugh size={20} />
      </StyledLink>
      <StyledLink href="/collectible/hairstyles" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaScissors size={20} />
      </StyledLink>
      <Separator className="bg-zinc-800 dark:bg-zinc-200" />
      <StyledLink href="/search" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <LuSearch size={20} />
      </StyledLink>
      {session ? (
        <>
          <SyncButton session={session} />
          <SignOutButton />
        </>
      ) : (
        <SignInButton />
      )}
      <ThemeButton />
    </div>
  );
}

export default function NavbarMenu({ session }: NavbarMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="pointer-events-auto relative flex flex-col">
      <div className="flex flex-col items-center justify-center gap-2">
        <StyledLink href="/instance/dungeons" className="group p-1">
          <Image
            priority={true}
            src="/sources/Dungeon.png"
            alt="Dungeon"
            width={50}
            height={50}
            className="duration transition-200 h-8 w-8 object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </StyledLink>
        <StyledLink href="/instance/raids" className="group p-1">
          <Image
            priority={true}
            src="/sources/Raid.png"
            alt="Raid"
            width={50}
            height={50}
            className="duration transition-200 h-8 w-8 object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </StyledLink>
        <StyledLink href="/instance/trials" className="group p-1">
          <Image
            priority={true}
            src="/sources/Trial.png"
            alt="Trial"
            width={50}
            height={50}
            className="duration transition-200 h-8 w-8 object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </StyledLink>
        <StyledLink href="/instance/variants" className="group p-1">
          <Image
            priority={true}
            src="/sources/V&C Dungeon.png"
            alt="V&C Dungeon"
            width={50}
            height={50}
            className="duration transition-200 h-8 w-8 object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </StyledLink>
        <div onMouseLeave={() => setIsExpanded(false)}>
          <button
            className="flex h-8 w-8 flex-row items-center justify-center gap-2 whitespace-nowrap text-nowrap rounded-xl p-0 font-semibold transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-zinc-900 active:scale-x-110 active:bg-cyan-300 active:duration-100 dark:hover:bg-cyan-700 dark:hover:text-zinc-100 dark:active:bg-cyan-700 md:h-full md:w-full md:p-4"
            onMouseEnter={() => setIsExpanded(true)}
            onClick={toggleMenu}
            aria-label="Expand menu">
            <FaCaretDown size={20} />
          </button>
          {isExpanded && <ExpandedMenu session={session} />}
        </div>
      </div>
    </div>
  );
}
