import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';

import {
  CollectibleListItemSkeleton,
  InstanceCardSkeleton,
  InstanceListItemSkeleton,
  ItemCardSkeleton,
} from '@/app/_components/ui/skeletons';

describe('Skeleton components', () => {
  describe('ItemCardSkeleton', () => {
    it('renders without crashing', () => {
      render(<ItemCardSkeleton />);
      const container = screen.getByTestId('item-card-skeleton');
      expect(container).toBeInTheDocument();
    });

    it('applies owned styles and shows owned indicator', () => {
      render(<ItemCardSkeleton owned={true} />);
      // owned styles add opacity-50 and show owned indicator div
      const container = screen.getByTestId('item-card-skeleton');
      expect(container).toHaveClass('opacity-50');

      // Owned indicator has absolute positioning and cyan bg
      expect(container.querySelector('div.absolute')).toBeInTheDocument();
      expect(container.querySelector('div.bg-cyan-300')).toBeInTheDocument();
    });

    it('does not show owned indicator when owned is false', () => {
      render(<ItemCardSkeleton owned={false} />);
      const container = screen.getByTestId('item-card-skeleton');
      expect(container).not.toHaveClass('opacity-50');
      expect(container.querySelector('div.absolute')).not.toBeInTheDocument();
    });
  });

  describe('CollectibleListItemSkeleton', () => {
    it('renders without crashing', () => {
      render(<CollectibleListItemSkeleton />);
      const container = screen.getByTestId('item-list-skeleton');
      expect(container).toBeInTheDocument();
    });

    it('applies owned styles and shows owned indicator', () => {
      render(<CollectibleListItemSkeleton owned={true} />);
      const container = screen.getByTestId('item-list-skeleton');
      expect(container).toHaveClass('opacity-50');
      expect(container.querySelector('div.absolute')).toBeInTheDocument();
      expect(container.querySelector('div.bg-cyan-300')).toBeInTheDocument();
    });

    it('does not show owned indicator when owned is false', () => {
      render(<CollectibleListItemSkeleton owned={false} />);
      const container = screen.getByTestId('item-list-skeleton');
      expect(container).not.toHaveClass('opacity-50');
      expect(container.querySelector('div.absolute')).not.toBeInTheDocument();
    });
  });

  describe('InstanceCardSkeleton', () => {
    it('renders without crashing and has expected classes', () => {
      render(<InstanceCardSkeleton />);

      const container = screen.getByTestId('instance-card-skeleton');
      expect(container).toBeInTheDocument();
      // Check for animate-pulse as a sign of skeleton
      expect(container).toHaveClass('animate-pulse');
    });
  });

  describe('InstanceListItemSkeleton', () => {
    it('renders without crashing and has expected classes', () => {
      render(<InstanceListItemSkeleton />);
      const container = screen.getByTestId('instance-list-skeleton');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('animate-pulse');
    });
  });
});
