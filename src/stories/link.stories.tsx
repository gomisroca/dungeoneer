import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NextImage from 'next/image';
import { createElement } from 'react';
import { FaPlus } from 'react-icons/fa';

import Link from '@/app/_components/ui/link';

const meta = {
  title: 'Base/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    href: 'basic-link',
    children: 'Basic Link',
  },
};

export const CustomClass: Story = {
  args: {
    href: 'custom-class-link',
    children: 'Custom Class Link',
    className: 'bg-blue-500 text-white p-2 rounded',
  },
};

export const Icon: Story = {
  args: {
    href: 'icon-link',
    children: createElement(FaPlus),
  },
};

export const Image: Story = {
  args: {
    href: 'image-link',
    children: <NextImage src="/xivlogo.png" alt="Next.js Logo" width={32} height={32} />,
    className: 'p-2',
  },
};
