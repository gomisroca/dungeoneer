'use client';

import Image from 'next/image';
import { type Session } from 'next-auth';
import React, { useEffect, useRef, useState } from 'react';
import { FaCaretDown, FaDog, FaFaceLaugh, FaHorse, FaMusic, FaScissors, FaWandMagicSparkles } from 'react-icons/fa6';
import { LuSearch } from 'react-icons/lu';
import { MdOutlineSync } from 'react-icons/md';
import { TbCardsFilled } from 'react-icons/tb';

import SignInButton from '@/app/_components/navbar/sign-in';
import SignOutButton from '@/app/_components/navbar/sign-out';
import ThemeButton from '@/app/_components/navbar/theme-button';
import Link from '@/app/_components/ui/link';
import { Separator } from '@/app/_components/ui/separator';

type NavbarMenuProps = {
  session: Session | null;
};

function ExpandedMenu({ session }: { session: Session | null }) {
  return (
    <div
      data-testid="expandable-menu"
      className="mt-2 flex max-h-[800px] flex-col items-center justify-center gap-2 py-2">
      <Link href="/collectible/minions" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaDog size={20} />
      </Link>
      <Link href="/collectible/mounts" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaHorse size={20} />
      </Link>
      <Link href="/collectible/cards" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <TbCardsFilled size={20} />
      </Link>
      <Link href="/collectible/orchestrions" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaMusic size={20} />
      </Link>
      <Link href="/collectible/spells" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaWandMagicSparkles size={20} />
      </Link>
      <Link href="/collectible/emotes" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaFaceLaugh size={20} />
      </Link>
      <Link href="/collectible/hairstyles" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <FaScissors size={20} />
      </Link>
      <Separator className="bg-zinc-800 dark:bg-zinc-200" />
      <Link href="/search" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
        <LuSearch size={20} />
      </Link>
      {session ? (
        <>
          <Link href="/sync" className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
            <MdOutlineSync size={20} />
            <span className="sr-only">Sync Collection</span>
          </Link>
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
        <Link href="/instance/dungeons" className="group p-1">
          <Image
            priority={true}
            src="/sources/Dungeon.png"
            alt="Dungeon"
            width={50}
            height={50}
            className="duration transition-200 h-8 w-8 object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </Link>
        <Link href="/instance/raids" className="group p-1">
          <Image
            priority={true}
            src="/sources/Raid.png"
            alt="Raid"
            width={50}
            height={50}
            className="duration transition-200 h-8 w-8 object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </Link>
        <Link href="/instance/trials" className="group p-1">
          <Image
            priority={true}
            src="/sources/Trial.png"
            alt="Trial"
            width={50}
            height={50}
            className="duration transition-200 h-8 w-8 object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </Link>
        <Link href="/instance/variants" className="group p-1">
          <Image
            priority={true}
            src="/sources/V&C Dungeon.png"
            alt="V&C Dungeon"
            width={50}
            height={50}
            className="duration transition-200 h-8 w-8 object-fill ease-in-out group-hover:contrast-125 md:h-[45px] md:w-[45px]"
          />
        </Link>
        <div onMouseLeave={() => setIsExpanded(false)}>
          <button
            className="flex h-8 w-8 flex-row items-center justify-center gap-2 rounded-xl p-0 font-semibold text-nowrap whitespace-nowrap transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-zinc-900 active:scale-x-110 active:bg-cyan-300 active:duration-100 md:h-full md:w-full md:p-4 dark:hover:bg-cyan-700 dark:hover:text-zinc-100 dark:active:bg-cyan-700"
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
