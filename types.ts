import {
  type Card,
  type CardSource,
  type CardStats,
  type Dungeon,
  type Emote,
  type EmoteSource,
  type Hairstyle,
  type HairstyleSource,
  type Minion,
  type MinionSource,
  type Mount,
  type MountSource,
  type Orchestrion,
  type OrchestrionSource,
  type Raid,
  type Spell,
  type SpellSource,
  type Trial,
  type User,
  type VariantDungeon,
} from 'generated/prisma';

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
export type ExpandedCollectible =
  | ExpandedCard
  | ExpandedMinion
  | ExpandedMount
  | ExpandedOrchestrion
  | ExpandedSpell
  | ExpandedEmote
  | ExpandedHairstyle;

export type LodestoneCharacter = {
  id: string;
  name: string;
  avatar: string;
  server: string | undefined;
  data_center: string | undefined;
  mounts?: {
    count: number;
    total: number;
    public: boolean;
  };
  minions?: {
    count: number;
    total: number;
    public: boolean;
  };
};

export type LodestoneCollectable = {
  id: number;
  name: string;
  patch: string;
  image: string;
  sources: [
    {
      type: string;
      text: string;
    },
  ];
};

export type ItemRouteKey = 'cards' | 'minions' | 'mounts' | 'spells' | 'orchestrions' | 'emotes' | 'hairstyles';
export type ItemModelName = 'card' | 'emote' | 'minion' | 'mount' | 'hairstyle' | 'orchestrion' | 'spell';
export type InstanceRouteKey = 'dungeons' | 'trials' | 'raids' | 'variants';
export type InstanceModelName = 'dungeon' | 'trial' | 'raid' | 'variantDungeon';
