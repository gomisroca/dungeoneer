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

  const decode = (key: string) => decodeURIComponent(params.get(key) ?? '').replace(/\+/g, ' ');
  const name = decode('name');
  const server = decode('server');
  const dc = decode('dc');
  const currentPage = Number(decode('page'));

  const navigate = (page: number) => {
    router.replace(`?name=${name}&dc=${dc}&server=${server}&page=${page}`);
  };

  return (
    <section className="flex items-center justify-center gap-2">
      {pagination.prev && (
        <Button arialabel="Previous page" onClick={() => navigate(currentPage - 1)} disabled={currentPage === 1}>
          {currentPage - 1}
        </Button>
      )}
      <span className="rounded-md p-4 text-lg font-bold">{pagination.current}</span>
      {pagination.next && (
        <Button
          arialabel="Next page"
          onClick={() => navigate(currentPage + 1)}
          disabled={currentPage === Number(pagination.total)}>
          {currentPage + 1}
        </Button>
      )}
    </section>
  );
}
