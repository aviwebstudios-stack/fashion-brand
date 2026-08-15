import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";
import { usePanelStore } from "../../store/panelStore";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export default function SearchOverlay() {
  const isOpen = usePanelStore((s) => s.isSearchOpen);
  const closeSearch = usePanelStore((s) => s.closeSearch);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get("/products", { params: { search: query, limit: 8 } })
        .then((res) => {
          setResults(res.data.data.products || []);
          setSearched(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (productId: string) => {
    closeSearch();
    navigate(`/product/${productId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[95] bg-black/40" onClick={closeSearch}>
      <div
        className="mx-auto max-h-[80vh] w-full max-w-2xl overflow-y-auto bg-brand-bg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-brand-text/10 px-6 py-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand-text/50">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for dresses, bridals, bespoke pieces..."
            className="w-full bg-transparent text-sm text-brand-text placeholder:text-brand-text/50 focus:outline-none"
          />
          <button
            onClick={closeSearch}
            aria-label="Close search"
            className="shrink-0 rounded-full p-1.5 text-brand-text/60 transition hover:bg-black/5 hover:text-brand-text"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          {loading && <p className="text-sm text-brand-text/60">Searching...</p>}

          {!loading && searched && results.length === 0 && (
            <p className="text-sm text-brand-text/60">No products found for "{query}".</p>
          )}

          {!loading && results.length > 0 && (
            <ul className="divide-y divide-brand-text/10">
              {results.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleSelect(product.id)}
                    className="flex w-full items-center gap-4 py-3 text-left"
                  >
                    <div className="h-16 w-14 shrink-0 overflow-hidden bg-[#e5e1d8]">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-brand-text">{product.name}</p>
                      <p className="mt-1 text-xs text-brand-text/60">
                        {formatNaira(product.price)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}