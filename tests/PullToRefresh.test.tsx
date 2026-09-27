// @vitest-environment jsdom
import { StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import PullToRefresh from '../components/PullToRefresh';

afterEach(cleanup);
function pull(element: Element) {
  fireEvent.touchStart(element, { touches: [{ clientX: 0, clientY: 0 }] });
  fireEvent.touchMove(element, { touches: [{ clientX: 0, clientY: 100 }] });
}

describe('pull to refresh', () => {
  it('settles after refresh under StrictMode and allows another refresh', async () => {
    const refresh = vi.fn().mockResolvedValue(undefined);
    const { container, queryByText } = render(
      <StrictMode>
        <PullToRefresh onRefresh={refresh} refreshingContent="Refreshing">
          Content
        </PullToRefresh>
      </StrictMode>,
    );
    pull(container.firstElementChild!);
    fireEvent.touchEnd(container.firstElementChild!);
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(queryByText('Refreshing')).toBeNull());
    pull(container.firstElementChild!);
    fireEvent.touchEnd(container.firstElementChild!);
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(2));
  });

  it('does not refresh a cancelled gesture', () => {
    const refresh = vi.fn();
    const { container } = render(
      <PullToRefresh onRefresh={refresh}>Content</PullToRefresh>,
    );
    pull(container.firstElementChild!);
    fireEvent.touchCancel(container.firstElementChild!);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('settles when the refresh callback throws synchronously', async () => {
    const refresh = vi.fn(() => {
      throw new Error('failed');
    });
    const { container, queryByText } = render(
      <PullToRefresh onRefresh={refresh} refreshingContent="Refreshing">
        Content
      </PullToRefresh>,
    );
    pull(container.firstElementChild!);
    fireEvent.touchEnd(container.firstElementChild!);
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    await waitFor(() => expect(queryByText('Refreshing')).toBeNull());
  });
});
