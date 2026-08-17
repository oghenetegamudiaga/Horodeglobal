"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { Service, Project, Post } from "@/lib/supabase";

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"services" | "projects" | "posts">("services");

  // Data states
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Form & Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resS, resP, resB] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/posts"),
      ]);

      if (resS.status === 401 || resP.status === 401 || resB.status === 401) {
        router.push("/admin/login");
        return;
      }

      const sData = await resS.json();
      const pData = await resP.json();
      const bData = await resB.json();

      setServices(Array.isArray(sData) ? sData : []);
      setProjects(Array.isArray(pData) ? pData : []);
      setPosts(Array.isArray(bData) ? bData : []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Reorder Handler (Services / Projects)
  const handleReorder = async (type: "services" | "projects", index: number, direction: "up" | "down") => {
    if (type === "services") {
      const list = [...services];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;

      const tempSort = list[index].sort_order;
      list[index].sort_order = list[targetIndex].sort_order;
      list[targetIndex].sort_order = tempSort;
      setServices(list);

      const itemA = list[index];
      const itemB = list[targetIndex];

      await Promise.all([
        fetch(`/api/admin/services/${itemA.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: itemA.sort_order }),
        }),
        fetch(`/api/admin/services/${itemB.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: itemB.sort_order }),
        }),
      ]);
    } else {
      const list = [...projects];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;

      const tempSort = list[index].sort_order;
      list[index].sort_order = list[targetIndex].sort_order;
      list[targetIndex].sort_order = tempSort;
      setProjects(list);

      const itemA = list[index];
      const itemB = list[targetIndex];

      await Promise.all([
        fetch(`/api/admin/projects/${itemA.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: itemA.sort_order }),
        }),
        fetch(`/api/admin/projects/${itemB.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: itemB.sort_order }),
        }),
      ]);
    }
  };

  // Delete Handler
  const handleDelete = async (type: "services" | "projects" | "posts", id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/${type}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await loadAllData();
    } catch (err) {
      alert("Error deleting item");
    }
  };

  // Open Form Modal
  const openForm = (item: any = null) => {
    setError(null);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      // Default new item form data
      if (activeTab === "services") {
        setFormData({
          name: "",
          slug: "",
          one_liner: "",
          image_url: "",
          sort_order: services.length + 1,
        });
      } else if (activeTab === "projects") {
        setFormData({
          name: "",
          slug: "",
          client_name: "",
          year: "2026",
          one_liner: "",
          brief: "",
          thumbnail_url: "",
          gallery_urls: [],
          service_tags: ["Product Design", "Branding"],
          featured: true,
          sort_order: projects.length + 1,
        });
      } else {
        setFormData({
          title: "",
          slug: "",
          category: "Design Strategy",
          read_time: "5 min read",
          excerpt: "",
          cover_image_url: "",
          content: "",
          published: true,
        });
      }
    }
    setIsFormOpen(true);
  };

  // Save Form Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const isEdit = !!editingItem;
    const url = isEdit
      ? `/api/admin/${activeTab}/${editingItem.id}`
      : `/api/admin/${activeTab}`;
    const method = isEdit ? "PUT" : "POST";

    // Format service_tags if string
    const payload = { ...formData };
    if (typeof payload.service_tags === "string") {
      payload.service_tags = payload.service_tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Save failed");
      }

      setIsFormOpen(false);
      await loadAllData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#25252a]">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[var(--border)] px-[36px] py-[18px] flex items-center justify-between sticky top-0 z-30 max-sm:px-[20px]">
        <div className="flex items-center gap-[16px]">
          <span className="font-bold text-[20px] tracking-tight text-[#111111]">
            HORODE
          </span>
          <span className="text-[11px] font-bold px-[8px] py-[3px] rounded-full bg-[#111111] text-white uppercase tracking-wider">
            Admin Panel
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="text-[13px] font-semibold text-[#8c8c93] hover:text-[#e11d48] transition-colors"
        >
          Log out →
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto p-[36px_24px]">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-[20px] mb-[32px] border-b border-[var(--border)] pb-[16px] max-sm:flex-col max-sm:items-start">
          <div className="flex items-center gap-[12px]">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-[18px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all ${
                activeTab === "services"
                  ? "bg-[#111111] text-white shadow-sm"
                  : "bg-white border border-[var(--border)] text-[#77777e] hover:text-[#111111]"
              }`}
            >
              Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-[18px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all ${
                activeTab === "projects"
                  ? "bg-[#111111] text-white shadow-sm"
                  : "bg-white border border-[var(--border)] text-[#77777e] hover:text-[#111111]"
              }`}
            >
              Works ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-[18px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all ${
                activeTab === "posts"
                  ? "bg-[#111111] text-white shadow-sm"
                  : "bg-white border border-[var(--border)] text-[#77777e] hover:text-[#111111]"
              }`}
            >
              Blog Posts ({posts.length})
            </button>
          </div>

          <button
            onClick={() => openForm()}
            className="px-[20px] py-[10px] rounded-[12px] bg-[#111111] text-white text-[13px] font-bold hover:bg-[#333337] transition-colors flex items-center gap-[6px]"
          >
            + Create New {activeTab === "services" ? "Service" : activeTab === "projects" ? "Project" : "Post"}
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="p-[60px] text-center text-[#8c8c93]">
            Loading dashboard data...
          </div>
        ) : (
          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
            {/* Services List */}
            {activeTab === "services" && (
              <div className="divide-y divide-[var(--border)]">
                {services.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-[20px_24px] flex items-center justify-between gap-[20px] hover:bg-[#fafafa] transition-colors max-sm:flex-col max-sm:items-start"
                  >
                    <div className="flex items-center gap-[18px]">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-[2px]">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorder("services", idx, "up")}
                          className="w-[24px] h-[24px] rounded bg-[#fafafa] border border-[var(--border)] text-[10px] font-bold disabled:opacity-30 hover:bg-[#e8e8ea]"
                        >
                          ▲
                        </button>
                        <button
                          disabled={idx === services.length - 1}
                          onClick={() => handleReorder("services", idx, "down")}
                          className="w-[24px] h-[24px] rounded bg-[#fafafa] border border-[var(--border)] text-[10px] font-bold disabled:opacity-30 hover:bg-[#e8e8ea]"
                        >
                          ▼
                        </button>
                      </div>

                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-[48px] h-[48px] object-cover rounded-[10px] border border-[var(--border)] shrink-0"
                        />
                      )}

                      <div>
                        <h3 className="m-0 text-[16px] font-bold text-[#25252a]">
                          {item.name}
                        </h3>
                        <span className="text-[12px] text-[#8c8c93] block">
                          /services/{item.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-[10px] self-end max-sm:self-stretch max-sm:justify-end">
                      <button
                        onClick={() => openForm(item)}
                        className="px-[14px] py-[6px] text-[12px] font-semibold border border-[var(--border)] rounded-[8px] bg-white hover:bg-[#fafafa]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("services", item.id, item.name)}
                        className="px-[14px] py-[6px] text-[12px] font-semibold text-[#e11d48] border border-[#fecdd3] rounded-[8px] bg-white hover:bg-[#fff1f2]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Works/Projects List */}
            {activeTab === "projects" && (
              <div className="divide-y divide-[var(--border)]">
                {projects.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-[20px_24px] flex items-center justify-between gap-[20px] hover:bg-[#fafafa] transition-colors max-sm:flex-col max-sm:items-start"
                  >
                    <div className="flex items-center gap-[18px]">
                      <div className="flex flex-col gap-[2px]">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorder("projects", idx, "up")}
                          className="w-[24px] h-[24px] rounded bg-[#fafafa] border border-[var(--border)] text-[10px] font-bold disabled:opacity-30 hover:bg-[#e8e8ea]"
                        >
                          ▲
                        </button>
                        <button
                          disabled={idx === projects.length - 1}
                          onClick={() => handleReorder("projects", idx, "down")}
                          className="w-[24px] h-[24px] rounded bg-[#fafafa] border border-[var(--border)] text-[10px] font-bold disabled:opacity-30 hover:bg-[#e8e8ea]"
                        >
                          ▼
                        </button>
                      </div>

                      <img
                        src={item.thumbnail_url || "/assets/zalyx-ledger.png"}
                        alt={item.name}
                        className="w-[64px] h-[42px] object-cover rounded-[8px] border border-[var(--border)] shrink-0"
                      />

                      <div>
                        <div className="flex items-center gap-[8px]">
                          <h3 className="m-0 text-[16px] font-bold text-[#25252a]">
                            {item.name}
                          </h3>
                          {item.featured && (
                            <span className="text-[10px] font-bold px-[6px] py-[2px] bg-[#fef3c7] text-[#92400e] rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-[#8c8c93] block">
                          Client: {item.client_name || "—"} · /work/{item.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-[10px] self-end max-sm:self-stretch max-sm:justify-end">
                      <button
                        onClick={() => openForm(item)}
                        className="px-[14px] py-[6px] text-[12px] font-semibold border border-[var(--border)] rounded-[8px] bg-white hover:bg-[#fafafa]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("projects", item.id, item.name)}
                        className="px-[14px] py-[6px] text-[12px] font-semibold text-[#e11d48] border border-[#fecdd3] rounded-[8px] bg-white hover:bg-[#fff1f2]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Blog Posts List */}
            {activeTab === "posts" && (
              <div className="divide-y divide-[var(--border)]">
                {posts.map((item) => (
                  <div
                    key={item.id}
                    className="p-[20px_24px] flex items-center justify-between gap-[20px] hover:bg-[#fafafa] transition-colors max-sm:flex-col max-sm:items-start"
                  >
                    <div className="flex items-center gap-[18px]">
                      {item.cover_image_url && (
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="w-[64px] h-[42px] object-cover rounded-[8px] border border-[var(--border)] shrink-0"
                        />
                      )}

                      <div>
                        <div className="flex items-center gap-[8px]">
                          <h3 className="m-0 text-[16px] font-bold text-[#25252a]">
                            {item.title}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-[6px] py-[2px] rounded ${
                              item.published
                                ? "bg-[#dcfce7] text-[#166534]"
                                : "bg-[#f3f4f6] text-[#4b5563]"
                            }`}
                          >
                            {item.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <span className="text-[12px] text-[#8c8c93] block">
                          Category: {item.category || "Design"} · /blog/{item.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-[10px] self-end max-sm:self-stretch max-sm:justify-end">
                      <button
                        onClick={() => openForm(item)}
                        className="px-[14px] py-[6px] text-[12px] font-semibold border border-[var(--border)] rounded-[8px] bg-white hover:bg-[#fafafa]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("posts", item.id, item.title)}
                        className="px-[14px] py-[6px] text-[12px] font-semibold text-[#e11d48] border border-[#fecdd3] rounded-[8px] bg-white hover:bg-[#fff1f2]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-[20px] overflow-y-auto">
          <div className="w-full max-w-[680px] bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[36px] my-[40px] shadow-xl relative max-sm:p-[24px]">
            <div className="flex items-center justify-between mb-[24px]">
              <h2 className="m-0 text-[22px] font-bold text-[#25252a]">
                {editingItem ? "Edit" : "Create"} {activeTab === "services" ? "Service" : activeTab === "projects" ? "Project" : "Blog Post"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-[32px] h-[32px] rounded-full bg-[#fafafa] text-[#8c8c93] font-bold text-[16px] hover:bg-[#e8e8ea]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-[20px]">
              {/* SERVICE FORM FIELDS */}
              {activeTab === "services" && (
                <>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                      Service Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: formData.slug || e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                        })
                      }
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                      Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug || ""}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                      One Liner Summary
                    </label>
                    <textarea
                      rows={2}
                      value={formData.one_liner || ""}
                      onChange={(e) => setFormData({ ...formData, one_liner: e.target.value })}
                      className="w-full p-[12px] border border-[var(--border)] rounded-[10px] text-[14px]"
                    />
                  </div>

                  <ImageUploadField
                    label="Service Visual Image"
                    bucket="service-media"
                    slug={formData.slug || "service"}
                    currentImageUrl={formData.image_url}
                    onUpload={(publicUrl) => setFormData({ ...formData, image_url: publicUrl })}
                    onClear={() => setFormData({ ...formData, image_url: "" })}
                  />
                </>
              )}

              {/* PROJECT / WORKS FORM FIELDS */}
              {activeTab === "projects" && (
                <>
                  <div className="grid grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                        Project Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: formData.slug || e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                          })
                        }
                        className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                        Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ""}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={formData.client_name || ""}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                        Year
                      </label>
                      <input
                        type="text"
                        value={formData.year || "2026"}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                      One Liner Summary
                    </label>
                    <input
                      type="text"
                      value={formData.one_liner || ""}
                      onChange={(e) => setFormData({ ...formData, one_liner: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                      Brief & Challenge Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={formData.brief || ""}
                      onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                      className="w-full p-[12px] border border-[var(--border)] rounded-[10px] text-[14px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                      Service Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(formData.service_tags)
                          ? formData.service_tags.join(", ")
                          : formData.service_tags || ""
                      }
                      onChange={(e) => setFormData({ ...formData, service_tags: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                    />
                  </div>

                  <ImageUploadField
                    label="Project Thumbnail Image"
                    bucket="project-media"
                    slug={formData.slug || "project"}
                    currentImageUrl={formData.thumbnail_url}
                    onUpload={(publicUrl) => setFormData({ ...formData, thumbnail_url: publicUrl })}
                    onClear={() => setFormData({ ...formData, thumbnail_url: "" })}
                  />

                  <div className="flex items-center gap-[10px] pt-[8px]">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={!!formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-[18px] h-[18px]"
                    />
                    <label htmlFor="featured" className="text-[14px] font-semibold text-[#25252a]">
                      Feature on Home Page
                    </label>
                  </div>
                </>
              )}

              {/* BLOG POST FORM FIELDS */}
              {activeTab === "posts" && (
                <>
                  <div className="grid grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                        Post Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            title: e.target.value,
                            slug: formData.slug || e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                          })
                        }
                        className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                        Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ""}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category || "Design Strategy"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={formData.read_time || "5 min read"}
                        onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                        className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[10px] text-[14px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                      Excerpt
                    </label>
                    <textarea
                      rows={2}
                      value={formData.excerpt || ""}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full p-[12px] border border-[var(--border)] rounded-[10px] text-[14px]"
                    />
                  </div>

                  <ImageUploadField
                    label="Post Cover Image"
                    bucket="blog-media"
                    slug={formData.slug || "post"}
                    currentImageUrl={formData.cover_image_url}
                    onUpload={(publicUrl) => setFormData({ ...formData, cover_image_url: publicUrl })}
                    onClear={() => setFormData({ ...formData, cover_image_url: "" })}
                  />

                  <div>
                    <label className="block text-[13px] font-semibold text-[#25252a] mb-[6px]">
                      Markdown Content
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={formData.content || ""}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="# Post Title&#10;&#10;Write your markdown content here..."
                      className="w-full p-[14px] border border-[var(--border)] rounded-[10px] text-[14px] font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-[10px] pt-[8px]">
                    <input
                      type="checkbox"
                      id="published"
                      checked={!!formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-[18px] h-[18px]"
                    />
                    <label htmlFor="published" className="text-[14px] font-semibold text-[#25252a]">
                      Publish Post (Make Visible on /blog)
                    </label>
                  </div>
                </>
              )}

              {error && (
                <p className="text-[13px] text-[#e11d48] font-medium m-0">
                  ⚠️ {error}
                </p>
              )}

              <div className="flex items-center justify-end gap-[12px] pt-[16px] border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-[20px] py-[10px] rounded-[10px] text-[14px] font-semibold border border-[var(--border)] bg-white hover:bg-[#fafafa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-[24px] py-[10px] rounded-[10px] text-[14px] font-bold bg-[#111111] text-white hover:bg-[#333337]"
                >
                  {isSaving ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
