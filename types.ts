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
} from '@prisma/client';

export interface ExpandedMinion extends Minion {
  owners: User[];
  sources: MinionSource[];
}

export interface ExpandedMount extends Mount {
  owners: User[];
  sources: MountSource[];
}

export interface ExpandedOrchestrion extends Orchestrion {
  owners: User[];
  sources: OrchestrionSource[];
}

export interface ExpandedDungeon extends Dungeon {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
}

export interface ExpandedRaid extends Raid {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
}

export interface ExpandedTrial extends Trial {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
}
