'use client';

import Image from 'next/image';
import { type Session } from 'next-auth';
import { useEffect, useRef, useState } from 'react';
import { FaCaretDown, FaDog, FaFaceLaugh, FaHorse, FaMusic, FaScissors, FaWandMagicSparkles } from 'react-icons/fa6';
import { LuSearch } from 'react-icons/lu';
import { MdOutlineSync } from 'react-icons/md';
import { TbCardsFilled } from 'react-icons/tb';

import SignInButton from '@/app/_components/navbar/sign-in';
import SignOutButton from '@/app/_components/navbar/sign-out';
import ThemeButton from '@/app/_components/navbar/theme-button';
import Button from '@/app/_components/ui/button';
import Link from '@/app/_components/ui/link';
import { Separator } from '@/app/_components/ui/separator';

function ExpandedMenu({ session }: { session: Session | null }) {
  return (
    <div data-testid="expandable-menu" className="mt-2 flex flex-col flex-wrap items-center justify-end gap-2 py-2">
      <Link href="/collectible/minions" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
        <FaDog size={20} />
      </Link>
      <Link href="/collectible/mounts" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
        <FaHorse size={20} />
      </Link>
      <Link href="/collectible/cards" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
        <TbCardsFilled size={20} />
      </Link>
      <Link href="/collectible/orchestrions" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
        <FaMusic size={20} />
      </Link>
      <Link href="/collectible/spells" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
        <FaWandMagicSparkles size={20} />
      </Link>
      <Link href="/collectible/emotes" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
        <FaFaceLaugh size={20} />
      </Link>
      <Link href="/collectible/hairstyles" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
        <FaScissors size={20} />
      </Link>
      <Separator className="bg-zinc-800 dark:bg-zinc-200" />
      <Link href="/search" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
        <LuSearch size={20} />
      </Link>
      {session ? (
        <>
          <Link href="/sync" className="h-6 w-6 p-0 lg:h-8 lg:w-8">
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

export default function NavbarMenu({ session }: { session: Session | null }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="pointer-events-auto relative flex flex-col">
      <div className="flex flex-col items-center justify-center gap-2">
        {[
          { href: '/instance/dungeons', src: '/sources/Dungeon.png', alt: 'Dungeon' },
          { href: '/instance/raids', src: '/sources/Raid.png', alt: 'Raid' },
          { href: '/instance/trials', src: '/sources/Trial.png', alt: 'Trial' },
          { href: '/instance/variants', src: '/sources/V&C Dungeon.png', alt: 'V&C Dungeon' },
        ].map(({ href, src, alt }) => (
          <Link key={href} href={href} className="group p-1">
            <Image
              priority
              src={src}
              alt={alt}
              width={50}
              height={50}
              className="h-6 w-6 object-fill transition duration-200 ease-in-out group-hover:contrast-125 lg:h-8 lg:w-8"
            />
          </Link>
        ))}
        <Button
          arialabel="Expand menu"
          className="h-6 w-6 p-0 lg:h-8 lg:w-8"
          onClick={() => setIsExpanded((prev) => !prev)}>
          <FaCaretDown size={20} />
        </Button>
        {isExpanded && <ExpandedMenu session={session} />}
      </div>
    </div>
  );
}
