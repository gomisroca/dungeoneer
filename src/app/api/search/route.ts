import { fetchSearchResults } from '@/server/queries/search';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get('term');

    if (!term?.trim()) {
      return Response.json({ error: 'Invalid search term' }, { status: 400 });
    }

    const items = await fetchSearchResults(term);
    return Response.json(items);
  } catch (error) {
    console.error('Failed to fetch search results:', error);
    return Response.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
