import { act, render, screen } from '@testing-library/react';
import { Provider, useAtom } from 'jotai';
import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Message from '@/app/_components/ui/message';
import { messageAtom } from '@/atoms/message';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/mock-path'),
}));

function MessageWithProvider() {
  const [, setMessage] = useAtom(messageAtom);
  useEffect(() => {
    setMessage({ content: 'Test Message', type: 'success' });
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
        setMessage({ content: 'Error occurred', type: 'error' });
      }, []);
      return <Message />;
    }

    render(
      <Provider>
        <ErrorMessage />
      </Provider>
    );

    // border-red-500 is on the wrapper div, not the text node
    const wrapper = screen.getByText('Error occurred').closest('div');
    expect(wrapper).toHaveClass('border-red-500');
  });
});
