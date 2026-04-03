import { type ItemRouteKey } from 'types';

import { fetchItems } from '@/server/queries/items';
import { EXPANSIONS } from '@/utils/consts';
import { itemKeytoModel } from '@/utils/mappers';

const MAX_TAKE = 100;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as ItemRouteKey | null;
    const expansion = searchParams.get('expansion');
    const skip = parseInt(searchParams.get('skip') ?? '0', 10);
    const take = parseInt(searchParams.get('take') ?? '20', 10);

    if (!type || !itemKeytoModel[type]) {
      return Response.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (isNaN(skip) || isNaN(take) || skip < 0 || take < 1) {
      return Response.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    const model = itemKeytoModel[type];
    const { items, hasMore } = await fetchItems(model, {
      expansion: expansion ? EXPANSIONS[expansion as keyof typeof EXPANSIONS] : undefined,
      skip,
      take: Math.min(take, MAX_TAKE),
    });

    return Response.json({ items, hasMore });
  } catch (error) {
    console.error('Failed to fetch collectibles:', error);
    return Response.json({ error: 'Failed to fetch collectibles' }, { status: 500 });
  }
}
