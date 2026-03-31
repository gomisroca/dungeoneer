import { type InstanceRouteKey } from 'types';

import { fetchInstances } from '@/server/queries/instances';
import { EXPANSIONS } from '@/utils/consts';
import { instanceKeytoModel } from '@/utils/mappers';

const MAX_TAKE = 100;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as InstanceRouteKey | null;
    const expansion = searchParams.get('expansion');
    const skip = parseInt(searchParams.get('skip') ?? '0', 10);
    const take = parseInt(searchParams.get('take') ?? '20', 10);

    if (!type || !instanceKeytoModel[type]) {
      return Response.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (isNaN(skip) || isNaN(take) || skip < 0 || take < 1) {
      return Response.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    const model = instanceKeytoModel[type];
    const { instances, hasMore } = await fetchInstances(model, {
      expansion: expansion ? EXPANSIONS[expansion as keyof typeof EXPANSIONS] : undefined,
      skip,
      take: Math.min(take, MAX_TAKE),
    });

    return Response.json({ instances, hasMore });
  } catch (error) {
    console.error('Failed to fetch instances:', error);
    return Response.json({ error: 'Failed to fetch instances' }, { status: 500 });
  }
}
