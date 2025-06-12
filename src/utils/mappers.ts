import { type InstanceModelName, type InstanceRouteKey, type ItemModelName, type ItemRouteKey } from 'types';

export const itemKeytoModel: Record<ItemRouteKey, ItemModelName> = {
  cards: 'card',
  emotes: 'emote',
  minions: 'minion',
  mounts: 'mount',
  hairstyles: 'hairstyle',
  orchestrions: 'orchestrion',
  spells: 'spell',
};

export const itemModelToKey: Record<ItemModelName, ItemRouteKey> = {
  card: 'cards',
  emote: 'emotes',
  minion: 'minions',
  mount: 'mounts',
  hairstyle: 'hairstyles',
  orchestrion: 'orchestrions',
  spell: 'spells',
};

export const instanceKeytoModel: Record<InstanceRouteKey, InstanceModelName> = {
  dungeons: 'dungeon',
  raids: 'raid',
  trials: 'trial',
  variants: 'variantDungeon',
};

export const instanceModelToKey: Record<InstanceModelName, InstanceRouteKey> = {
  dungeon: 'dungeons',
  raid: 'raids',
  trial: 'trials',
  variantDungeon: 'variants',
};
