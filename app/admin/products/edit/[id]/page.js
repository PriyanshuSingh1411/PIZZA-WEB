"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ===============================
     LOAD PRODUCT
  =============================== */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/products/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load product");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setForm({
            name: data.product.name || "",
            description: data.product.description || "",
            price: data.product.price || "",
            category: data.product.category || "",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  /* ===============================
     UPDATE PRODUCT
  =============================== */
  const submit = async () => {
    if (!form.name || !form.price) {
      alert("Name and price are required");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category", form.category);

      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.error || "Update failed");
        return;
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  if (loading) {
    return <p style={{ padding: 40 }}>Loading product...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">✏️ Edit Pizza</h1>

        {/* NAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        {/* PRICE */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={form.price}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, price: e.target.value }))
            }
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
          />
        </div>

        {/* IMAGE */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* ACTION */}
        <button
          onClick={submit}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>
      </div>
    </div>
  );
}
