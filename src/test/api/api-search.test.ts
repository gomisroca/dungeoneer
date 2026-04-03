import { describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/search/route';

vi.mock('@/server/queries/search', () => ({
  fetchSearchResults: vi.fn().mockResolvedValue([{ id: 1, name: 'Halatali' }]),
}));

describe('GET /api/search', () => {
  it('returns 400 for missing term', async () => {
    const req = new Request('http://localhost/api/search');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for whitespace-only term', async () => {
    const req = new Request('http://localhost/api/search?term=   ');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns results for valid term', async () => {
    const req = new Request('http://localhost/api/search?term=halatali');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { id: number; name: string }[];
    expect(data).toHaveLength(1);
  });
});
