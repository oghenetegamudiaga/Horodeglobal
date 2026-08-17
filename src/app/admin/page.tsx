import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard | Horode Design Studio",
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}
