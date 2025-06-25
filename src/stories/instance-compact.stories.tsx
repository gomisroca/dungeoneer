import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { type ExpandedCard, type ExpandedInstance, type ExpandedMinion } from 'types';

import InstanceListItem from '@/app/instance/[type]/item';

const meta = {
  title: 'Cards/Instance/Compact',
  component: InstanceListItem,

  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof InstanceListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicInstance: ExpandedInstance = {
  id: 1,
  name: 'Basic Raid',
  image: '/sources/Raid.png',
  description: 'This is a basic instance description.',
  patch: '1.0',
  cards: [],
  emotes: [],
  hairstyles: [],
  minions: [],
  mounts: [],
  orchestrions: [],
  spells: [],
};

const card: ExpandedCard = {
  id: '1',
  name: 'Card 1',
  image: '/xivlogo.png',
  owners: [{ id: '1', name: 'Owner 1', image: '', email: '', emailVerified: new Date() }],
  sources: [],
  number: '1',
  stars: 1,
  description: 'This is a basic card description.',
  patch: '1.0',
  owned: '10%',
};

const minion: ExpandedMinion = {
  id: '1',
  name: 'Minion 1',
  image: '/xivlogo.png',
  owners: [{ id: '1', name: 'Owner 1', image: '', email: '', emailVerified: new Date() }],
  sources: [],
  description: 'This is a basic minion description.',
  shortDescription: 'A cute minion.',
  tradeable: true,
  behavior: 'Passive',
  race: 'Bug',
  patch: '1.0',
  owned: '10%',
};

const instanceWithItems: ExpandedInstance = {
  ...basicInstance,
  cards: [card],
  minions: [minion],
};

export const WithItems: Story = {
  args: {
    instance: instanceWithItems,
    session: null,
  },
};

export const Empty: Story = {
  args: {
    instance: basicInstance,
    session: null,
  },
};

export const Completed: Story = {
  args: {
    instance: instanceWithItems,
    session: {
      user: {
        id: '1',
        name: 'Owner 1',
        image: '',
        email: '',
        minions: [],
        mounts: [],
        orchestrions: [],
        spells: [],
        cards: [card],
        emotes: [],
        hairstyles: [],
      },
      expires: '',
    },
  },
};
