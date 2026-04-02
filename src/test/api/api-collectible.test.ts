import { describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/collectible/route';

vi.mock('@/server/queries/items', () => ({
  fetchItems: vi.fn().mockResolvedValue({ items: [{ id: '1' }], hasMore: false }),
}));

describe('GET /api/collectible', () => {
  it('returns 400 for invalid type', async () => {
    const req = new Request('http://localhost/api/collectible?type=invalid');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid pagination', async () => {
    const req = new Request('http://localhost/api/collectible?type=minions&skip=abc');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns items for valid request', async () => {
    const req = new Request('http://localhost/api/collectible?type=minions&skip=0&take=20');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { items: { id: string }[]; hasMore: boolean };
    expect(data.items).toHaveLength(1);
    expect(data.hasMore).toBe(false);
  });
});
