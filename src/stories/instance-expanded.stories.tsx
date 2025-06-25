import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { type ExpandedCard, type ExpandedInstance, type ExpandedMinion } from 'types';

import { InstanceCard } from '@/app/_components/ui/cards';

const meta = {
  title: 'Cards/Instance/Expanded',
  component: InstanceCard,

  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof InstanceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicInstance: ExpandedInstance = {
  id: 1,
  name: 'Basic Instance',
  image: '/sources/Dungeon.png',
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
