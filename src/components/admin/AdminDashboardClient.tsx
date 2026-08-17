"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { Service, Project, Post } from "@/lib/supabase";

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"services" | "projects" | "posts" | "site-content">("services");

  // Data states
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Form & Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Site Content & Settings Form States
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [contentSuccessMsg, setContentSuccessMsg] = useState<string | null>(null);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);

  // Admin Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrMsg, setPasswordErrMsg] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrMsg(null);
    setPasswordSuccessMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordErrMsg("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordErrMsg("New password must be at least 6 characters.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPasswordSuccessMsg(data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccessMsg(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating password";
      setPasswordErrMsg(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resS, resP, resB, resC, resSet] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/posts"),
        fetch("/api/admin/site-content"),
        fetch("/api/admin/site-settings"),
      ]);

      if (resS.status === 401 || resP.status === 401 || resB.status === 401 || resC.status === 401 || resSet.status === 401) {
        router.push("/admin/login");
        return;
      }

      const sData = await resS.json();
      const pData = await resP.json();
      const bData = await resB.json();
      const cData = await resC.json();
      const setDat = await resSet.json();

      setServices(Array.isArray(sData) ? sData : []);
      setProjects(Array.isArray(pData) ? pData : []);
      setPosts(Array.isArray(bData) ? bData : []);
      setSiteContent(cData || {});
      setSiteSettings(setDat || {});
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    setContentSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: siteContent }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Save failed");
      }
      setContentSuccessMsg("Site copy saved and live!");
      setTimeout(() => setContentSuccessMsg(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save site content");
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Save failed");
      }
      setSettingsSuccessMsg("Global settings saved and live!");
      setTimeout(() => setSettingsSuccessMsg(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save site settings");
    } finally {
      setIsSavingSettings(false);
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
            <button
              onClick={() => setActiveTab("site-content")}
              className={`px-[18px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all ${
                activeTab === "site-content"
                  ? "bg-[#111111] text-white shadow-sm"
                  : "bg-white border border-[var(--border)] text-[#77777e] hover:text-[#111111]"
              }`}
            >
              Site Content & Settings
            </button>
          </div>

          {activeTab !== "site-content" && (
            <button
              onClick={() => openForm()}
              className="px-[20px] py-[10px] rounded-[12px] bg-[#111111] text-white text-[13px] font-bold hover:bg-[#333337] transition-colors flex items-center gap-[6px]"
            >
              + Create New {activeTab === "services" ? "Service" : activeTab === "projects" ? "Project" : "Post"}
            </button>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="p-[60px] text-center text-[#8c8c93]">
            Loading dashboard data...
          </div>
        ) : activeTab === "site-content" ? (
          <div className="space-y-[32px]">
            {/* Form 1: Site Copy Form */}
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[32px] max-sm:p-[20px] shadow-sm">
              <div className="flex items-center justify-between mb-[24px] flex-wrap gap-[12px]">
                <div>
                  <h2 className="m-0 text-[20px] font-bold text-[#25252a]">
                    Home & About Page Copy
                  </h2>
                  <p className="m-0 text-[13px] text-[#8c8c93] mt-[4px]">
                    Edit headlines, text blocks, and brand story for Home and About pages.
                  </p>
                </div>
                {contentSuccessMsg && (
                  <span className="text-[13px] font-semibold text-[#166534] bg-[#dcfce7] px-[12px] py-[6px] rounded-[8px]">
                    {contentSuccessMsg}
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveContent} className="space-y-[20px]">
                <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1">
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Hero Headline</label>
                    <input
                      type="text"
                      value={siteContent.hero_headline || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, hero_headline: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Hero CTA Text</label>
                    <input
                      type="text"
                      value={siteContent.hero_cta_text || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, hero_cta_text: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-[6px]">Hero Subhead</label>
                  <textarea
                    rows={2}
                    value={siteContent.hero_subhead || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, hero_subhead: e.target.value })}
                    className="w-full p-[12px] border border-[var(--border)] rounded-[8px] text-[14px]"
                  />
                </div>

                <hr className="border-[var(--border)] my-[20px]" />

                <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1">
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Home "Who We Are" Headline</label>
                    <input
                      type="text"
                      value={siteContent.who_we_are_headline || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, who_we_are_headline: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">About Page Hero Title</label>
                    <input
                      type="text"
                      value={siteContent.about_hero_title || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, about_hero_title: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-[6px]">Home "Who We Are" Text</label>
                  <textarea
                    rows={3}
                    value={siteContent.who_we_are_text || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, who_we_are_text: e.target.value })}
                    className="w-full p-[12px] border border-[var(--border)] rounded-[8px] text-[14px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1">
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">About Page Subhead</label>
                    <input
                      type="text"
                      value={siteContent.about_hero_subhead || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, about_hero_subhead: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">About Philosophy Section Title</label>
                    <input
                      type="text"
                      value={siteContent.about_philosophy_title || ""}
                      onChange={(e) => setSiteContent({ ...siteContent, about_philosophy_title: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-[6px]">About Page Brand Story</label>
                  <textarea
                    rows={5}
                    value={siteContent.about_story || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, about_story: e.target.value })}
                    className="w-full p-[12px] border border-[var(--border)] rounded-[8px] text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-[12px]">About Page Core Values / Principles</label>
                  <div className="space-y-[12px]">
                    {Array.isArray(siteContent.about_values) &&
                      siteContent.about_values.map((val: any, idx: number) => (
                        <div key={idx} className="p-[16px] border border-[var(--border)] rounded-[10px] bg-[#fafafa] flex gap-[16px] items-start">
                          <span className="font-bold text-[14px] text-[#8c8c93] mt-[8px]">{val.number || `0${idx + 1}`}</span>
                          <div className="flex-1 grid grid-cols-1 gap-[10px]">
                            <input
                              type="text"
                              placeholder="Title"
                              value={val.title || ""}
                              onChange={(e) => {
                                const newVals = [...siteContent.about_values];
                                newVals[idx] = { ...newVals[idx], title: e.target.value };
                                setSiteContent({ ...siteContent, about_values: newVals });
                              }}
                              className="w-full h-[40px] px-[12px] border border-[var(--border)] rounded-[6px] bg-white text-[13px] font-semibold"
                            />
                            <textarea
                              rows={2}
                              placeholder="Description"
                              value={val.description || ""}
                              onChange={(e) => {
                                const newVals = [...siteContent.about_values];
                                newVals[idx] = { ...newVals[idx], description: e.target.value };
                                setSiteContent({ ...siteContent, about_values: newVals });
                              }}
                              className="w-full p-[10px] border border-[var(--border)] rounded-[6px] bg-white text-[13px]"
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="px-[24px] py-[12px] rounded-[10px] bg-[#111111] text-white text-[14px] font-bold hover:bg-[#333337] transition-colors disabled:opacity-50"
                >
                  {isSavingContent ? "Saving Copy..." : "Save Site Copy"}
                </button>
              </form>
            </div>

            {/* Form 2: Global Settings Form */}
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[32px] max-sm:p-[20px] shadow-sm">
              <div className="flex items-center justify-between mb-[24px] flex-wrap gap-[12px]">
                <div>
                  <h2 className="m-0 text-[20px] font-bold text-[#25252a]">
                    Global Site Settings & Contact
                  </h2>
                  <p className="m-0 text-[13px] text-[#8c8c93] mt-[4px]">
                    Edit sitewide footer contact details, social URLs, site title, and copyright.
                  </p>
                </div>
                {settingsSuccessMsg && (
                  <span className="text-[13px] font-semibold text-[#166534] bg-[#dcfce7] px-[12px] py-[6px] rounded-[8px]">
                    {settingsSuccessMsg}
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-[20px]">
                <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1">
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Site Title</label>
                    <input
                      type="text"
                      value={siteSettings.site_title || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, site_title: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Copyright Text</label>
                    <input
                      type="text"
                      value={siteSettings.copyright_text || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, copyright_text: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-[6px]">Meta Description</label>
                  <textarea
                    rows={2}
                    value={siteSettings.meta_description || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, meta_description: e.target.value })}
                    className="w-full p-[12px] border border-[var(--border)] rounded-[8px] text-[14px]"
                  />
                </div>

                <hr className="border-[var(--border)] my-[20px]" />

                <div className="grid grid-cols-3 gap-[20px] max-lg:grid-cols-1">
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Phone Number</label>
                    <input
                      type="text"
                      value={siteSettings.phone || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Email Address</label>
                    <input
                      type="email"
                      value={siteSettings.email || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Address / Location</label>
                    <input
                      type="text"
                      value={siteSettings.address || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1">
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">X (Twitter) URL</label>
                    <input
                      type="text"
                      value={siteSettings.social_x || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, social_x: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">LinkedIn URL</label>
                    <input
                      type="text"
                      value={siteSettings.social_linkedin || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, social_linkedin: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">Instagram URL</label>
                    <input
                      type="text"
                      value={siteSettings.social_instagram || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, social_instagram: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-[6px]">TikTok URL</label>
                    <input
                      type="text"
                      value={siteSettings.social_tiktok || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, social_tiktok: e.target.value })}
                      className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-[24px] py-[12px] rounded-[10px] bg-[#111111] text-white text-[14px] font-bold hover:bg-[#333337] transition-colors disabled:opacity-50"
                >
                  {isSavingSettings ? "Saving Settings..." : "Save Global Settings"}
                </button>
              </form>
            </div>

            {/* Form 3: Admin Security & Password Form */}
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[32px] max-sm:p-[20px] shadow-sm">
              <div className="flex items-center justify-between mb-[24px] flex-wrap gap-[12px]">
                <div>
                  <h2 className="m-0 text-[20px] font-bold text-[#25252a]">
                    Admin Security & Password
                  </h2>
                  <p className="m-0 text-[13px] text-[#8c8c93] mt-[4px]">
                    Update your dashboard login password.
                  </p>
                </div>
                {passwordSuccessMsg && (
                  <span className="text-[13px] font-semibold text-[#166534] bg-[#dcfce7] px-[12px] py-[6px] rounded-[8px]">
                    ✓ {passwordSuccessMsg}
                  </span>
                )}
              </div>

              <form onSubmit={handleChangePassword} className="space-y-[20px] max-w-[500px]">
                <div>
                  <label className="block text-[13px] font-bold mb-[6px]">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-[6px]">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-[6px]">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-[46px] px-[14px] border border-[var(--border)] rounded-[8px] text-[14px]"
                  />
                </div>

                {passwordErrMsg && (
                  <p className="text-[13px] text-[#e11d48] font-medium m-0">
                    ⚠️ {passwordErrMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-[24px] py-[12px] rounded-[10px] bg-[#111111] text-white text-[14px] font-bold hover:bg-[#333337] transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? "Updating Password..." : "Update Admin Password"}
                </button>
              </form>
            </div>
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
