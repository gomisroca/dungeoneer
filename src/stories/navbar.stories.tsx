import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import NavbarMenu from '@/app/_components/navbar/navbar-menu';

const meta = {
  title: 'Base/Navbar',
  component: NavbarMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof NavbarMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    session: null,
  },
};

export const LoggedIn: Story = {
  args: {
    session: {
      user: {
        id: '1',
        name: 'User 1',
        image: '',
        email: '',
        minions: [],
        mounts: [],
        orchestrions: [],
        spells: [],
        cards: [],
        emotes: [],
        hairstyles: [],
      },
      expires: '',
    },
  },
};
