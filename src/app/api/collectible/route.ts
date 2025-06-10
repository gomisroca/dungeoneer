import { fetchItems } from '@/server/queries/items';
import { EXPANSIONS } from '@/utils/consts';
import { itemKeytoModel } from '@/utils/mappers';
import { ItemRouteKey } from 'types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type')! as ItemRouteKey;
  const expansion = searchParams.get('expansion')!;
  const skip = parseInt(searchParams.get('skip') || '0', 10);
  const take = parseInt(searchParams.get('take') || '20', 10);

  if (!type || !itemKeytoModel[type]) {
    return new Response('Invalid type', { status: 400 });
  }

  const model = itemKeytoModel[type];
  const { items, hasMore } = await fetchItems(model, {
    expansion: EXPANSIONS[expansion as keyof typeof EXPANSIONS],
    skip,
    take,
  });

  return Response.json({ items, hasMore });
}
