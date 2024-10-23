import { type Source, type Minion, type User, type Dungeon } from '@prisma/client';

export interface ExpandedMinion extends Minion {
  owners: User[];
  sources: Source[];
}

export interface ExpandedDungeon extends Dungeon {
  minions: ExpandedMinion[];
}
