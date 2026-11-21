import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useCatalog } from './hooks/useCatalog';
import { descendantIds } from './utils';

// Loaded only when a product is opened.
const ProductDialog = lazy(() => import('./components/ProductDialog'));

export default function App() {
  const { data, loading, offline } = useCatalog();
  const { categories, products, features } = data;

  const [categoryId, setCategoryId] = useState(null);
  const [selected, setSelected] = useState(null);

  const roots = useMemo(() => categories.filter((c) => !c.parentId), [categories]);

  // Product count per category (children included), computed once per catalog.
  const counts = useMemo(() => {
    const out = {};
    for (const c of categories) {
      const ids = descendantIds(categories, c.id);
      out[c.id] = products.filter((p) => ids.has(p.categoryId)).length;
    }
    return out;
  }, [categories, products]);

  const featured = useMemo(() => products.find((p) => p.images.length) ?? products[0], [products]);

  // Selecting a category filters in place, then brings the product list into view.
  const selectCategory = useCallback((id) => {
    setCategoryId(id);
    document.getElementById('products')?.scrollIntoView();
  }, []);
  const openProduct = useCallback((p) => setSelected(p), []);
  const closeProduct = useCallback(() => setSelected(null), []);

  return (
    <div className="pb-20 md:pb-0">
      <Header loading={loading} />
      {offline && (
        <p role="status" className="bg-ink px-4 py-2 text-center text-sm font-semibold text-paper">
          تعذر تحديث الكتالوج الآن، نعرض آخر نسخة محفوظة.
        </p>
      )}

      <main>
        <Hero categoryCount={roots.length} productCount={products.length} featured={featured} onOpen={openProduct} />
        <Categories categories={roots} counts={counts} activeId={categoryId} onSelect={selectCategory} />
        <Products categories={categories} products={products} features={features} counts={counts}
          categoryId={categoryId} onCategory={selectCategory} onOpen={openProduct} />
        <Contact />
      </main>

      <Footer />

      {selected && (
        <Suspense fallback={null}>
          <ProductDialog product={selected} products={products} features={features}
            categoryName={categories.find((c) => c.id === selected.categoryId)?.name}
            onSelect={openProduct} onClose={closeProduct} />
        </Suspense>
      )}
    </div>
  );
}
