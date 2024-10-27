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

type NavbarMenuProps = {
  session: Session | null;
};

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
        <StyledLink href="/dungeons" className="group p-1">
          <Image
            unoptimized
            src="/sources/Dungeon.png"
            alt="Dungeon"
            width={50}
            height={50}
            className="duration transition-200 h-[35px] w-[35px] object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </StyledLink>
        <StyledLink href="/raids" className="group p-1">
          <Image
            unoptimized
            src="/sources/Raid.png"
            alt="Raid"
            width={50}
            height={50}
            className="duration transition-200 h-[35px] w-[35px] object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </StyledLink>
        <StyledLink href="/trials" className="group p-1">
          <Image
            unoptimized
            src="/sources/Trial.png"
            alt="Trial"
            width={50}
            height={50}
            className="duration transition-200 h-[35px] w-[35px] object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </StyledLink>
        <StyledLink href="/variants" className="group p-1">
          <Image
            unoptimized
            src="/sources/V&C Dungeon.png"
            alt="V&C Dungeon"
            width={50}
            height={50}
            className="duration transition-200 h-[35px] w-[35px] object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </StyledLink>
        <button
          className="flex h-[35px] w-[35px] flex-row items-center justify-center gap-2 whitespace-nowrap text-nowrap rounded-xl p-0 font-semibold backdrop-blur-md transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-zinc-900 active:scale-x-110 active:bg-cyan-300 active:duration-100 dark:hover:bg-cyan-700 dark:hover:text-zinc-100 dark:active:bg-cyan-700 md:h-full md:w-full md:p-4"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          onClick={toggleMenu}
          aria-label="Expand menu">
          <FaCaretDown size={20} />
        </button>
      </div>
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`flex flex-col items-center justify-center gap-2 overflow-hidden py-2 transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <StyledLink href="/minions" className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4">
          <FaDog size={20} />
        </StyledLink>
        <StyledLink href="/mounts" className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4">
          <FaHorse size={20} />
        </StyledLink>
        <StyledLink href="/cards" className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4">
          <TbCardsFilled size={20} />
        </StyledLink>
        <StyledLink href="/orchestrions" className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4">
          <FaMusic size={20} />
        </StyledLink>
        <StyledLink href="/spells" className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4">
          <FaWandMagicSparkles size={20} />
        </StyledLink>
        <StyledLink href="/emotes" className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4">
          <FaFaceLaugh size={20} />
        </StyledLink>
        <StyledLink href="/hairstyles" className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4">
          <FaScissors size={20} />
        </StyledLink>
        <Separator className="bg-zinc-800 dark:bg-zinc-200" />
        {session ? <SignOutButton /> : <SignInButton />}
        <ThemeButton />
      </div>
    </div>
  );
}
