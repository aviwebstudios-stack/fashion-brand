import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";
import QuickViewModal from "../../components/shop/QuickViewModal";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  isAvailable: boolean;
}

interface ProductsResponse {
  products: Product[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

const CATEGORY_TITLES: Record<string, string> = {
  rtw: "Ready-to-Wear",
  bridals: "Bridals",
  bespoke: "Bespoke",
  sales: "Shop Sales",
};

export default function ProductListing() {
  const { category } = useParams<{ category: string }>();
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setPage(1);
  }, [category]);

  useEffect(() => {
    api
      .get("/products", { params: { category, page, limit: 12 } })
      .then((res) => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [category, page]);

  const title = category ? CATEGORY_TITLES[category] || category : "Shop";

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-center font-heading text-3xl text-brand-text">{title}</h1>

      {loading ? (
        <p className="mt-12 text-center text-sm text-brand-text/60">Loading...</p>
      ) : !data || data.products.length === 0 ? (
        <p className="mt-12 text-center text-sm text-brand-text/60">
          No products found in this collection yet.
        </p>
      ) : (
        <>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {data.products.map((product) => (
              <div key={product.id}>
                <div className="group relative aspect-[3/4] overflow-hidden bg-[#e5e1d8]">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}

                  <button
                    onClick={() => setQuickViewId(product.id)}
                    className="absolute inset-x-3 bottom-3 bg-brand-primary py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] opacity-0 transition hover:opacity-90 group-hover:opacity-100"
                  >
                    Shop Now
                  </button>
                </div>

                <Link to={`/product/${product.id}`} className="mt-3 block">
                  <p className="text-sm text-brand-text">{product.name}</p>
                  <p className="mt-1 text-sm text-brand-text/70">{formatNaira(product.price)}</p>
                </Link>
              </div>
            ))}
          </div>

          {data.pagination.pages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-sm text-brand-text underline disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-brand-text/60">
                Page {data.pagination.page} of {data.pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                disabled={page >= data.pagination.pages}
                className="text-sm text-brand-text underline disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {quickViewId && (
        <QuickViewModal productId={quickViewId} onClose={() => setQuickViewId(null)} />
      )}
    </div>
  );
}