import { fetchSearchResults } from '@/server/queries/search';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term')!;

  if (!term) {
    return new Response('Invalid search term', { status: 400 });
  }

  const items = await fetchSearchResults(term);

  return Response.json(items);
}
