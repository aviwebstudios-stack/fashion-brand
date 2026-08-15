import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import { formatNaira } from "../../lib/format";
import { useAuthStore } from "../../store/authStore";
import { usePanelStore } from "../../store/panelStore";
import SizeGuideModal from "../../components/shop/SizeGuideModal";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  stock: number;
  isAvailable: boolean;
  category: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleCart = usePanelStore((s) => s.toggleCart);
  const setCartCount = usePanelStore((s) => s.setCartCount);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data.data;
        setProduct(p);
        setActiveImage(0);
        setSelectedSize("");
        setQuantity(1);

        return api.get("/products", { params: { category: p.category, limit: 5 } });
      })
      .then((res) => {
        const others = res.data.data.products.filter((p: Product) => p.id !== id);
        setRelated(others.slice(0, 4));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToBag = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (product?.sizes?.length && !selectedSize) {
      setError("Please select a size.");
      return;
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
      toggleCart();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not add to bag. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p className="px-6 py-20 text-center text-sm text-brand-text/60">Loading...</p>;
  }

  if (!product) {
    return (
      <p className="px-6 py-20 text-center text-sm text-brand-text/60">Product not found.</p>
    );
  }

  return (
    <div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2">
        <div>
          <div className="aspect-[3/4] overflow-hidden bg-[#e5e1d8]">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-14 overflow-hidden border ${
                    i === activeImage ? "border-brand-accent" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-heading text-2xl text-brand-text">{product.name}</h1>
          <p className="mt-2 text-lg text-brand-text/80">{formatNaira(product.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-brand-text/70">{product.description}</p>

          {!product.isAvailable || product.stock === 0 ? (
            <p className="mt-8 text-sm text-red-600">Currently out of stock.</p>
          ) : (
            <div className="mt-8 space-y-6">
              {product.sizes?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.1em] text-brand-text">Size</p>
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
                        className={`border px-4 py-2 text-sm transition ${
                          selectedSize === size
                            ? "border-brand-primary bg-brand-primary text-[#f4f1e8]"
                            : "border-brand-text/25 text-brand-text hover:border-brand-text"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-brand-text">Quantity</p>
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

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                onClick={handleAddToBag}
                disabled={adding}
                className="w-full bg-brand-primary py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-[#f4f1e8] transition hover:opacity-90 disabled:opacity-60"
              >
                {adding ? "Adding..." : "Add to Bag"}
              </button>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <h2 className="text-center font-heading text-2xl text-brand-text">You May Also Like</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-[#e5e1d8]">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>
                <p className="mt-3 text-sm text-brand-text">{p.name}</p>
                <p className="mt-1 text-sm text-brand-text/70">{formatNaira(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
}