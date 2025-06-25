import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { type ExpandedMinion } from 'types';

import CollectibleListItem from '@/app/collectible/[type]/item';

const meta = {
  title: 'Cards/Collectible/Compact',
  component: CollectibleListItem,

  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof CollectibleListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const minion: ExpandedMinion = {
  id: '1',
  name: 'Minion 1',
  image: '/xivlogo.png',
  owners: [{ id: '1', name: 'Owner 1', image: '', email: '', emailVerified: new Date() }],
  sources: [{ id: '1', type: 'Dungeon', text: 'Halatali', minionId: '1' }],
  description: 'This is a basic minion description.',
  shortDescription: 'A cute minion.',
  tradeable: true,
  behavior: 'Passive',
  race: 'Bug',
  patch: '1.0',
  owned: '10%',
};

export const Basic: Story = {
  args: {
    item: minion,
    type: 'minions',
    session: null,
  },
};
