import { type Session } from 'next-auth';
import { useState, useEffect } from 'react';
import { type Item, type ExpandedInstance } from 'types';

function checkDatabaseOwnership(instance: ExpandedInstance, userId: string | undefined) {
  if (!userId) return false;

  const allMinionsOwned = instance.minions.every((minion) => minion.owners.some((m) => m.id === userId));
  const allMountsOwned = instance.mounts.every((mount) => mount.owners.some((m) => m.id === userId));
  const allOrchsOwned = instance.orchestrions.every((orch) => orch.owners.some((o) => o.id === userId));
  const allSpellsOwned = instance.spells.every((spell) => spell.owners.some((o) => o.id === userId));
  const allCardsOwned = instance.cards.every((card) => card.owners.some((o) => o.id === userId));
  const allEmotesOwned = instance.emotes.every((emote) => emote.owners.some((o) => o.id === userId));
  const allHairstylesOwned = instance.hairstyles.every((hairstyle) => hairstyle.owners.some((o) => o.id === userId));

  return (
    allMinionsOwned &&
    allMountsOwned &&
    allOrchsOwned &&
    allSpellsOwned &&
    allCardsOwned &&
    allEmotesOwned &&
    allHairstylesOwned
  );
}

function checkLocalStorageOwnership(instance: ExpandedInstance) {
  const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];

  const allMinionsOwned = instance.minions.every((minion) => localItems.some((item) => item.id === minion.id));
  const allMountsOwned = instance.mounts.every((mount) => localItems.some((item) => item.id === mount.id));
  const allOrchsOwned = instance.orchestrions.every((orch) => localItems.some((item) => item.id === orch.id));
  const allSpellsOwned = instance.spells.every((spell) => localItems.some((item) => item.id === spell.id));
  const allCardsOwned = instance.cards.every((card) => localItems.some((item) => item.id === card.id));
  const allEmotesOwned = instance.emotes.every((emote) => localItems.some((item) => item.id === emote.id));
  const allHairstylesOwned = instance.hairstyles.every((hairstyle) =>
    localItems.some((item) => item.id === hairstyle.id)
  );

  return (
    allMinionsOwned &&
    allMountsOwned &&
    allOrchsOwned &&
    allSpellsOwned &&
    allCardsOwned &&
    allEmotesOwned &&
    allHairstylesOwned
  );
}

export default function useCheckOwnership(instance: ExpandedInstance, session: Session | null) {
  const [isOwned, setIsOwned] = useState(false);

  useEffect(() => {
    const listenStorageChange = () => {
      if (session?.user?.id) {
        setIsOwned(checkDatabaseOwnership(instance, session.user.id));
      } else {
        setIsOwned(checkLocalStorageOwnership(instance));
      }
    };
    window.addEventListener('storage', listenStorageChange);
    return () => window.removeEventListener('storage', listenStorageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      setIsOwned(checkDatabaseOwnership(instance, session.user.id));
    }
  }, [instance, session]);

  if (
    (!instance.minions || instance.minions.length === 0) &&
    (!instance.mounts || instance.mounts.length === 0) &&
    (!instance.orchestrions || instance.orchestrions.length === 0) &&
    (!instance.spells || instance.spells.length === 0) &&
    (!instance.cards || instance.cards.length === 0) &&
    (!instance.emotes || instance.emotes.length === 0) &&
    (!instance.hairstyles || instance.hairstyles.length === 0)
  ) {
    return 'empty';
  } else {
    return isOwned ? 'owned' : 'not-owned';
  }
}
