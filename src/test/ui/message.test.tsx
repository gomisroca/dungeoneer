import { act, render, screen } from '@testing-library/react';
import { Provider, useAtom } from 'jotai';
import { useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Message from '@/app/_components/ui/message';
import { messageAtom } from '@/atoms/message';

// Mocks for next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/mock-path'),
}));

function MessageWithProvider() {
  const [, setMessage] = useAtom(messageAtom);

  useEffect(() => {
    setMessage({ content: 'Test Message', error: false });
  }, []);

  return <Message />;
}

describe('Message component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a message', () => {
    render(
      <Provider>
        <MessageWithProvider />
      </Provider>
    );

    expect(screen.getByText('Test Message')).toBeVisible();
  });

  it('disappears after 5 seconds', () => {
    render(
      <Provider>
        <MessageWithProvider />
      </Provider>
    );

    expect(screen.getByText('Test Message')).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });

  it('renders with error styling when error is true', () => {
    function ErrorMessage() {
      const [, setMessage] = useAtom(messageAtom);
      useEffect(() => {
        setMessage({ content: 'Error occurred', error: true });
      }, []);
      return <Message />;
    }

    render(
      <Provider>
        <ErrorMessage />
      </Provider>
    );

    const content = screen.getByText('Error occurred');
    expect(content).toHaveClass('border-red-500');
  });
});
