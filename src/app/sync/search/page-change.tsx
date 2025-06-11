'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import Button from '@/app/_components/ui/button';

export default function PageChange({
  pagination,
}: {
  pagination: { current: string; total: string; prev: string | null; next: string | null };
}) {
  const router = useRouter();
  const params = useSearchParams();

  const decodeParam = (param: string | null) => (param ? decodeURIComponent(param).replace(/\+/g, ' ') : '');

  const name = decodeParam(params.get('name'));
  const server = decodeParam(params.get('server'));
  const dc = decodeParam(params.get('dc'));
  const page = decodeParam(params.get('page'));

  const handlePageChange = (page: number) => {
    router.replace(`?name=${name}&dc=${dc}&server=${server}&page=${Number(page)}`);
  };

  return (
    <section className="flex items-center justify-center gap-2">
      {pagination.prev !== 'javascript:void(0);' && (
        <Button onClick={() => handlePageChange(Number(page) - 1)} disabled={page === '1' || !pagination.prev}>
          {Number(page) - 1}
        </Button>
      )}
      <span className="rounded-xl p-4 text-lg font-bold">{pagination.current}</span>
      {pagination.next !== 'javascript:void(0);' && (
        <Button
          onClick={() => handlePageChange(Number(page) + 1)}
          disabled={page === pagination.total || !pagination.next}>
          {Number(page) + 1}
        </Button>
      )}
    </section>
  );
}
