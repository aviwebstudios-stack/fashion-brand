import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";
import { useAuthStore } from "../../store/authStore";
import { usePanelStore } from "../../store/panelStore";
import SizeGuideModal from "./SizeGuideModal";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  stock: number;
  isAvailable: boolean;
}

interface QuickViewModalProps {
  productId: string;
  onClose: () => void;
}

export default function QuickViewModal({ productId, onClose }: QuickViewModalProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleCart = usePanelStore((s) => s.toggleCart);
  const setCartCount = usePanelStore((s) => s.setCartCount);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${productId}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate("/login");
      return false;
    }
    if (product?.sizes?.length && !selectedSize) {
      setError("Please select a size.");
      return false;
    }

    setError("");
    setAdding(true);
    try {
      const res = await api.post("/cart", {
        productId: product?.id,
        quantity,
        size: selectedSize || undefined,
      });
      setCartCount(res.data.data.items?.length || 0);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not add to bag. Please try again.");
      return false;
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCart = async () => {
    const ok = await addToCart();
    if (ok) {
      onClose();
      toggleCart();
    }
  };

  const handleBuyNow = async () => {
    const ok = await addToCart();
    if (ok) {
      onClose();
      navigate("/checkout");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div
          className="relative grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto bg-brand-bg md:grid-cols-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/70 p-1.5 text-brand-text/70 transition hover:bg-white hover:text-brand-text"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {loading || !product ? (
            <div className="col-span-2 flex items-center justify-center py-24">
              <p className="text-sm text-brand-text/60">
                {loading ? "Loading..." : "Product not found."}
              </p>
            </div>
          ) : (
            <>
              <div className="aspect-[3/4] bg-[#e5e1d8] md:aspect-auto">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>

              <div className="p-8">
                <h2 className="font-heading text-xl uppercase tracking-wide text-brand-text">
                  {product.name}
                </h2>
                <p className="mt-2 text-brand-text/80">{formatNaira(product.price)}</p>

                {!product.isAvailable || product.stock === 0 ? (
                  <p className="mt-6 text-sm text-red-600">Currently out of stock.</p>
                ) : (
                  <>
                    {product.sizes?.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-brand-text">Size</p>
                          <button
                            onClick={() => setShowSizeGuide(true)}
                            className="text-xs text-brand-accent underline hover:no-underline"
                          >
                            Size Guide
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`border px-3 py-2 text-sm transition ${
                                selectedSize === size
                                  ? "border-brand-text bg-brand-text text-brand-bg"
                                  : "border-brand-text/25 text-brand-text hover:border-brand-text"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <p className="text-sm font-medium text-brand-text">Quantity</p>
                      <div className="mt-2 flex w-fit items-center border border-brand-text/20">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-3 py-2 text-sm text-brand-text"
                        >
                          −
                        </button>
                        <span className="px-4 text-sm text-brand-text">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                          className="px-3 py-2 text-sm text-brand-text"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="mt-6 w-full bg-brand-primary py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
                    >
                      {adding ? "Adding..." : "Add to Cart"}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={adding}
                      className="mt-3 w-full bg-brand-text py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-bg transition hover:opacity-90 disabled:opacity-60"
                    >
                      Buy it now
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    onClose();
                    navigate(`/product/${product.id}`);
                  }}
                  className="mt-4 text-sm text-brand-text/70 underline hover:text-brand-text"
                >
                  More details
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
    </>
  );
}