import { useEffect, useState, type FormEvent } from "react";
import adminApi from "../../lib/adminApi";
import { formatNaira } from "../../lib/format";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  stock: number;
  category: string;
  collection: string | null;
  isAvailable: boolean;
}

interface ProductsResponse {
  products: Product[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

const CATEGORY_OPTIONS = ["rtw", "bridals", "bespoke", "sales", "accessories"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "rtw",
  collection: "",
  sizes: "",
  isAvailable: true,
};

export default function AdminProducts() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [removingImage, setRemovingImage] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    adminApi
      .get("/products/admin/all", { params: { page, limit: 20 } })
      .then((res) => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFiles(null);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      collection: product.collection || "",
      sizes: product.sizes.join(", "),
      isAvailable: product.isAvailable,
    });
    setFiles(null);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    if (form.collection) formData.append("collection", form.collection);
    formData.append("sizes", form.sizes);
    formData.append("isAvailable", String(form.isAvailable));

    if (files) {
      Array.from(files).forEach((file) => formData.append("images", file));
    }

    try {
      if (editingProduct) {
        const res = await adminApi.patch(`/products/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingProduct(res.data.data);
      } else {
        await adminApi.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setShowModal(false);
      }
      setFiles(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!editingProduct) return;
    if (!confirm("Remove this image from the product?")) return;

    setRemovingImage(imageUrl);
    try {
      const res = await adminApi.delete(`/products/${editingProduct.id}/images`, {
        data: { imageUrl },
      });
      setEditingProduct(res.data.data);
      fetchProducts();
    } catch {
      alert("Could not remove image.");
    } finally {
      setRemovingImage(null);
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      await adminApi.patch(`/products/${product.id}`, { isAvailable: !product.isAvailable });
      fetchProducts();
    } catch {
      // silently fail
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.delete(`/products/${product.id}`);
      fetchProducts();
    } catch {
      alert("Could not delete product.");
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-brand-text">Products</h1>
        <button
          onClick={openCreateModal}
          className="bg-brand-primary px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-brand-cream transition hover:bg-brand-primary/90"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-brand-text/70">Loading products...</p>
      ) : !data || data.products.length === 0 ? (
        <p className="mt-8 text-sm text-brand-text/70">No products yet.</p>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto border border-brand-text/10 bg-brand-surface">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-brand-text/10 text-left text-xs uppercase tracking-[0.05em] text-brand-text/70">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product.id} className="border-b border-brand-text/10">
                    <td className="px-4 py-3">
                      <div className="h-12 w-10 overflow-hidden bg-brand-muted">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-text">{product.name}</td>
                    <td className="px-4 py-3 text-brand-text/70">{product.category}</td>
                    <td className="px-4 py-3 text-brand-text/70">{formatNaira(product.price)}</td>
                    <td className="px-4 py-3 text-brand-text/70">{product.stock}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleAvailable(product)}
                        className={`rounded-full px-2.5 py-1 text-xs ${
                          product.isAvailable
                            ? "bg-brand-accent/15 text-brand-gold"
                            : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {product.isAvailable ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEditModal(product)}
                        className="mr-3 text-xs text-brand-gold underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-xs text-red-600 dark:text-red-400 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-sm text-brand-text underline disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-brand-text/70">
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

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-brand-surface p-6 dark:ring-1 dark:ring-brand-line"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl text-brand-text">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                className="w-full border border-brand-text/20 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none"
              />

              <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                rows={3}
                className="w-full border border-brand-text/20 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Price (₦)"
                  className="w-full border border-brand-text/20 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none"
                />
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="Stock quantity"
                  className="w-full border border-brand-text/20 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-brand-text/20 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={form.collection}
                  onChange={(e) => setForm({ ...form, collection: e.target.value })}
                  placeholder="Collection (optional)"
                  className="w-full border border-brand-text/20 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none"
                />
              </div>

              <input
                type="text"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="Sizes, comma separated (e.g. S, M, L, XL)"
                className="w-full border border-brand-text/20 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none"
              />

              <label className="flex items-center gap-2 text-sm text-brand-text">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="h-4 w-4"
                />
                Available for purchase
              </label>

              {editingProduct && editingProduct.images.length > 0 && (
                <div>
                  <p className="text-xs text-brand-text/70">Current images (click × to remove):</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {editingProduct.images.map((img) => (
                      <div key={img} className="relative">
                        <img src={img} alt="" className="h-14 w-12 object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img)}
                          disabled={removingImage === img}
                          aria-label="Remove image"
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white disabled:opacity-50"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-brand-text/70">
                  {editingProduct ? "Add more images (optional)" : "Product images"}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="mt-1 w-full text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-brand-text/20 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-brand-text"
                >
                  {editingProduct ? "Close" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-primary py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-brand-cream disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
