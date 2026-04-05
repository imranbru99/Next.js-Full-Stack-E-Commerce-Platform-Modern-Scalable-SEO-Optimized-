"use client";

import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    logoUrl: "",
    faviconUrl: "",
    googleAnalytics: "",
    metaPixel: "",
    searchConsole: "",
    currency: "USD",
    currencySymbol: "$",
    metaDescription: "",
    metaKeywords: "",
  });

  // Load existing settings
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) setFormData((prev) => ({ ...prev, ...data }));
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) alert("Settings saved successfully!");
    } catch (err) {
      alert("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Global Store Settings</h1>
      
      <form onSubmit={handleSave} className="space-y-6 bg-white p-8 border rounded-2xl shadow-sm">
        {/* Brand Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
          <h2 className="col-span-full text-lg font-semibold">Brand Identity</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input name="storeName" value={formData.storeName} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Favicon URL</label>
            <input name="faviconUrl" value={formData.faviconUrl} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </section>

        {/* SEO Section */}
        <section className="grid grid-cols-1 gap-4 border-b pb-6">
          <h2 className="text-lg font-semibold">SEO Metadata</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="w-full p-2 border rounded h-20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Keywords (comma separated)</label>
            <input name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </section>

        {/* Tracking Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
          <h2 className="col-span-full text-lg font-semibold">Tracking & Verification</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Google Analytics (G-XXXXX)</label>
            <input name="googleAnalytics" value={formData.googleAnalytics} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Pixel ID</label>
            <input name="metaPixel" value={formData.metaPixel} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">Google Search Console Tag</label>
            <input name="searchConsole" value={formData.searchConsole} onChange={handleChange} placeholder='content="XXXXX"' className="w-full p-2 border rounded" />
          </div>
        </section>

        {/* Currency Section */}
        <section className="grid grid-cols-2 gap-4">
          <h2 className="col-span-full text-lg font-semibold">Currency Settings</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Currency Code (e.g., USD)</label>
            <input name="currency" value={formData.currency} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency Symbol (e.g., $)</label>
            <input name="currencySymbol" value={formData.currencySymbol} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </section>

        <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
          {isSaving ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}