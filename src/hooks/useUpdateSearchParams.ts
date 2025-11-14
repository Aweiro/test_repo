import { useRouter } from 'next/router';
import { SearchLabelsType } from '../types/SearchLabelsType';

export type SearchParams = {
  [key: string]: string | string[] | null;
};

function normalizeParams(params: SearchParams) {
  const newParams = { ...params };

  if (SearchLabelsType.ItemsPerPage in newParams) {
    newParams[SearchLabelsType.PageCatalog] = null;
  }

  return newParams;
}

export function useUpdateSearchParams() {
  const router = useRouter();

  const updateSearch = (params: SearchParams) => {
    const newParams = normalizeParams(params);

    const filteredQuery: Record<string, string | string[]> = {};

    Object.entries({ ...router.query, ...newParams }).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filteredQuery[key] = value;
      }
    });

    router.push(
      {
        pathname: router.pathname,
        query: filteredQuery,
      },
      undefined,
      { scroll: false },
    );
  };

  return updateSearch;
}
