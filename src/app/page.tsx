import Image from 'next/image';

import { Separator } from '@/app/_components/ui/separator';

export default async function Home() {
  return (
    <div className="relative rounded-md bg-zinc-300/20 p-4 text-base font-semibold shadow-md md:text-xl dark:bg-zinc-700/20">
      <Image
        unoptimized
        src="/xivlogo.png"
        alt="Logo"
        width={200}
        height={200}
        className="pointer-events-none absolute top-[-80px] left-[-80px] opacity-30 grayscale"
      />
      <h1 className="mb-2 text-2xl font-bold underline decoration-4 md:text-4xl">Dungeoneer</h1>
      <p>Keep track of what collectibles you are missing from dungeons, raids or trials.</p>
      <p>Click on any of the categories to the right and get collecting!</p>
      <Separator className="mx-auto my-8 w-1/2 bg-zinc-800 dark:bg-zinc-200" />
      <p>Please beware your collection will be stored in your browser until you sign in.</p>
      <p>Make sure to sign in to never lose your collection.</p>
    </div>
  );
}
