import { fetchInstances } from '@/server/queries/instances';
import { EXPANSIONS } from '@/utils/consts';
import { instanceKeytoModel } from '@/utils/mappers';
import { InstanceRouteKey } from 'types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type')! as InstanceRouteKey;
  const expansion = searchParams.get('expansion')!;
  const skip = parseInt(searchParams.get('skip') || '0', 10);
  const take = parseInt(searchParams.get('take') || '20', 10);

  if (!type || !instanceKeytoModel[type]) {
    return new Response('Invalid type', { status: 400 });
  }

  const model = instanceKeytoModel[type];
  const { instances, hasMore } = await fetchInstances(model, {
    expansion: EXPANSIONS[expansion as keyof typeof EXPANSIONS],
    skip,
    take,
  });

  return Response.json({ instances, hasMore });
}
