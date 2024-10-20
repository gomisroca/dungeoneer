import { type Minion, type User } from '@prisma/client';

export interface MinionWithOwners extends Minion {
  owners: User[];
}
