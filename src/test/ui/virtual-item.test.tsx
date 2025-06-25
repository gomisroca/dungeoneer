import { act, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';

import VirtualItem from '@/app/_components/ui/virtual-item';

class IntersectionObserverMock {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  trigger = (isIntersecting: boolean) => {
    // @ts-expect-error - Mocking IntersectionObserverEntry
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
  };
}

describe('VirtualItem', () => {
  let intersectionObserverInstance: IntersectionObserverMock;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    intersectionObserverInstance = new IntersectionObserverMock(() => {});
    // @ts-expect-error - Mocking global IntersectionObserver
    global.IntersectionObserver = vi.fn((callback) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      intersectionObserverInstance.callback = callback;
      return intersectionObserverInstance;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders placeholder initially', () => {
    render(
      <VirtualItem placeholder={<div>Placeholder content</div>}>
        <div>Visible content</div>
      </VirtualItem>
    );

    expect(screen.getByText('Placeholder content')).toBeInTheDocument();
    expect(screen.queryByText('Visible content')).not.toBeInTheDocument();
  });

  it('renders children when intersection observer triggers visible', () => {
    render(
      <VirtualItem>
        <div>Visible content</div>
      </VirtualItem>
    );

    // Initially, placeholder shown
    expect(screen.queryByText('Visible content')).not.toBeInTheDocument();

    // Simulate intersection observer reporting visibility
    act(() => {
      intersectionObserverInstance.trigger(true);
    });

    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('shows children after fallback scroll triggers visibility', () => {
    render(
      <VirtualItem>
        <div>Visible content</div>
      </VirtualItem>
    );

    // Initially placeholder
    expect(screen.queryByText('Visible content')).not.toBeInTheDocument();

    // Simulate no intersection (still not visible)
    act(() => {
      intersectionObserverInstance.trigger(false);
    });

    // Scroll event triggers fallback
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // Because your component uses a throttled timeout of 100ms, wait for it:
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(screen.getByText('Visible content')).toBeInTheDocument();
        resolve(null);
      }, 150);
    });
  });

  it('cleans up observer and scroll listener on unmount', () => {
    const { unmount } = render(
      <VirtualItem>
        <div>Visible content</div>
      </VirtualItem>
    );

    unmount();

    expect(intersectionObserverInstance.unobserve).toHaveBeenCalled();
    expect(intersectionObserverInstance.disconnect).toHaveBeenCalled();
  });
});
