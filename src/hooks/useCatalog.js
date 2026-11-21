import { useEffect, useState } from 'react';
import { loadCatalog, readCachedData } from '../api/catalog';

/** Renders instantly from cache/snapshot, then revalidates once on mount. */
export function useCatalog() {
  const [state, setState] = useState(() => ({ data: readCachedData(), loading: true, offline: false }));

  useEffect(() => {
    const ctrl = new AbortController();
    loadCatalog({ signal: ctrl.signal })
      .then(({ data, fresh }) => setState({ data, loading: false, offline: !fresh }))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  return state;
}
