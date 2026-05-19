import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetailPanel from './DetailPanel';
import { Character } from '../../types';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.png',
};

function renderDetailPanel(id = '1', page = '1') {
  return render(
    <MemoryRouter initialEntries={[`/details/${id}?page=${page}`]}>
      <Routes>
        <Route path="/details/:id" element={<DetailPanel />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DetailPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows spinner while loading', () => {
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    renderDetailPanel();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders character details after successful fetch', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCharacter),
    } as unknown as Response);

    renderDetailPanel();
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText(/Earth \(C-137\)/)).toBeInTheDocument();
      expect(screen.getByText(/Citadel of Ricks/)).toBeInTheDocument();
      expect(screen.getByText(/Male/)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    } as unknown as Response);

    renderDetailPanel();
    await waitFor(() => {
      expect(screen.getByText(/Request failed: 404/)).toBeInTheDocument();
    });
  });

  it('handles network error gracefully', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    renderDetailPanel();
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('handles unknown error type gracefully', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue('fail');
    renderDetailPanel();
    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
  });

  it('renders close button', async () => {
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    renderDetailPanel();
    expect(screen.getByRole('button', { name: /Close/ })).toBeInTheDocument();
  });

  it('navigates back on close button click', async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCharacter),
    } as unknown as Response);

    render(
      <MemoryRouter initialEntries={['/details/1?page=2']}>
        <Routes>
          <Route path="/" element={<div>Main Page</div>} />
          <Route path="/details/:id" element={<DetailPanel />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Rick Sanchez'));
    await user.click(screen.getByRole('button', { name: /Close/ }));
    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  it('displays character image', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCharacter),
    } as unknown as Response);

    renderDetailPanel();
    await waitFor(() => {
      const img = screen.getByRole('img', { name: 'Rick Sanchez' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/rick.png');
    });
  });
});
