import { type Minion, type User, type Dungeon, type MinionSource } from '@prisma/client';

export interface ExpandedMinion extends Minion {
  owners: User[];
  sources: MinionSource[];
}

export interface ExpandedDungeon extends Dungeon {
  minions: ExpandedMinion[];
}
