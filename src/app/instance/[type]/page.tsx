import { notFound } from 'next/navigation';
import { type InstanceRouteKey } from 'types';

import InstanceList from '@/app/instance/[type]/list';
import { auth } from '@/server/auth';
import { INSTANCE_TYPES } from '@/utils/consts';

export default async function InstanceListWrapper({ params }: { params: Promise<{ type: InstanceRouteKey }> }) {
  const { type } = await params;
  if (!INSTANCE_TYPES.includes(type as string)) return notFound();

  const session = await auth();
  return <InstanceList session={session} routeKey={type} />;
}
