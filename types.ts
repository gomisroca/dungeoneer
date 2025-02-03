import {
  type Minion,
  type User,
  type Dungeon,
  type MinionSource,
  type Raid,
  type Trial,
  type Mount,
  type MountSource,
  type Orchestrion,
  type OrchestrionSource,
  type Spell,
  type SpellSource,
  type Card,
  type CardStats,
  type CardSource,
  type VariantDungeon,
  type Hairstyle,
  type HairstyleSource,
  type EmoteSource,
  type Emote,
} from '@prisma/client';

export interface ExpandedMinion extends Minion {
  owners: User[];
  sources?: MinionSource[];
}

export interface ExpandedMount extends Mount {
  owners: User[];
  sources?: MountSource[];
}

export interface ExpandedOrchestrion extends Orchestrion {
  owners: User[];
  sources?: OrchestrionSource[];
}
export interface ExpandedSpell extends Spell {
  owners: User[];
  sources?: SpellSource[];
}

export interface ExpandedEmote extends Emote {
  owners: User[];
  sources?: EmoteSource[];
}

export interface ExpandedHairstyle extends Hairstyle {
  owners: User[];
  sources?: HairstyleSource[];
}
export interface ExpandedCard extends Card {
  owners: User[];
  stats?: CardStats;
  sources?: CardSource[];
}
export interface ExpandedDungeon extends Dungeon {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
  spells: ExpandedSpell[];
  cards: ExpandedCard[];
  emotes: ExpandedEmote[];
  hairstyles: ExpandedHairstyle[];
}

export interface ExpandedVariantDungeon extends VariantDungeon {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
  spells: ExpandedSpell[];
  cards: ExpandedCard[];
  emotes: ExpandedEmote[];
  hairstyles: ExpandedHairstyle[];
}

export interface ExpandedRaid extends Raid {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
  spells: ExpandedSpell[];
  cards: ExpandedCard[];
  emotes: ExpandedEmote[];
  hairstyles: ExpandedHairstyle[];
}

export interface ExpandedTrial extends Trial {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
  spells: ExpandedSpell[];
  cards: ExpandedCard[];
  emotes: ExpandedEmote[];
  hairstyles: ExpandedHairstyle[];
}

export type ItemType = 'cards' | 'minions' | 'mounts' | 'spells' | 'orchestrions' | 'emotes' | 'hairstyles';

export interface Item {
  id: string;
  name: string;
  image: string | null;
  owners: { id: string }[];
  type: ItemType;
}

export type Instance = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  patch: string | null;
  cards: ExpandedCard[];
  emotes: ExpandedEmote[];
  hairstyles: ExpandedHairstyle[];
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
  spells: ExpandedSpell[];
};

export type ExpandedInstance = ExpandedDungeon | ExpandedTrial | ExpandedRaid | ExpandedVariantDungeon;
