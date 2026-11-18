"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const rawUser = localStorage.getItem("carebridge_user");
    const user = rawUser ? JSON.parse(rawUser) : { role: "elderly" };
    router.replace(`/dashboard/${user.role ?? "elderly"}`);
  }, [router]);

  return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading dashboard...</div>;
}
