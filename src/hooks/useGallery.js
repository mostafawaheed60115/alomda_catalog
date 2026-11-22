import { useEffect, useState } from 'react';
import { loadGallery } from '../api/catalog';

/**
 * Images for the open product. Starts with the primary image already in the list
 * (instant), then swaps in the full gallery from GET /products/{id} (one cached request).
 */
export function useGallery(product) {
  const [images, setImages] = useState(product.images);

  useEffect(() => {
    let alive = true;
    setImages(product.images);
    loadGallery(product.id)
      .then((g) => alive && g.length && setImages(g))
      .catch(() => {}); // keep the primary image on failure
    return () => {
      alive = false;
    };
  }, [product]);

  return images;
}
