"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  HeartHandshake,
  Languages,
  LogOut,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EventList } from "@/components/dashboard/dashboard-interactions";
import { getDemoEvents } from "@/lib/demo-store";

const roleConfig = {
  elderly: {
    label: "Elderly User",
    nav: [
      { href: "#top", label: "Home" },
      { href: "#checkins", label: "Daily check-in" },
      { href: "#activities", label: "My activities" },
      { href: "#support", label: "Family & help" },
    ],
  },
  family: {
    label: "Family Member",
    nav: [
      { href: "#overview", label: "Overview" },
      { href: "#notifications", label: "Updates" },
      { href: "#profile", label: "Elder profile" },
      { href: "#history", label: "Family notes" },
    ],
  },
  caregiver: {
    label: "Caregiver",
    nav: [
      { href: "#overview", label: "Overview" },
      { href: "#schedule", label: "Schedule" },
      { href: "#tasks", label: "Assigned tasks" },
      { href: "#updates", label: "Visit notes" },
    ],
  },
  admin: {
    label: "Administrator",
    nav: [
      { href: "#overview", label: "Overview" },
      { href: "#incidents", label: "Incident watch" },
      { href: "#management", label: "Management" },
      { href: "#audit", label: "Audit activity" },
    ],
  },
} as const;

export function DashboardShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: keyof typeof roleConfig;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string; email?: string }>({});
  const [language, setLanguage] = useState("English");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeSection, setActiveSection] = useState("#top");

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem("carebridge_user");
      if (currentUser) setUser(JSON.parse(currentUser) as { name?: string; email?: string });
      setLanguage(localStorage.getItem("carebridge_language") ?? "English");
      setActiveSection(window.location.hash || "#top");
      const refresh = () => setNotificationCount(getDemoEvents().filter((event) => !event.acknowledged).length);
      refresh();
      const updateSection = () => setActiveSection(window.location.hash || "#top");
      window.addEventListener("carebridge:events", refresh);
      window.addEventListener("storage", refresh);
      window.addEventListener("hashchange", updateSection);
      return () => {
        window.removeEventListener("carebridge:events", refresh);
        window.removeEventListener("storage", refresh);
        window.removeEventListener("hashchange", updateSection);
      };
    } catch (error) {
      console.error("Could not load CareBridge demo session.", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("carebridge_user");
    router.push("/auth");
  };

  const setPreferredLanguage = (value: string) => {
    localStorage.setItem("carebridge_language", value);
    setLanguage(value);
    setLanguageMenuOpen(false);
  };

  return (
    <div id="top" className="min-h-screen bg-[#f5f8fc]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] flex-col border-r border-slate-200/80 bg-white px-5 py-6 lg:flex">
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 text-white shadow-lg shadow-blue-900/15">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[17px] font-extrabold tracking-tight text-slate-900">CareBridge</p>
            <p className="text-[11px] font-medium tracking-wide text-slate-500">AI · HUMAN-LED CARE</p>
          </div>
        </Link>

        <div className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</div>
        <nav className="mt-3 space-y-1">
          {roleConfig[role].nav.map((item, index) => (
            <a
              key={item.href}
              href={`${pathname}${item.href}`}
              onClick={() => setActiveSection(item.href)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                activeSection === item.href || (activeSection === "#top" && index === 0)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${index === 0 ? "bg-blue-600" : "bg-slate-300 group-hover:bg-blue-400"}`} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-teal-800">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold">Your privacy matters</span>
            </div>
            <p className="text-xs leading-5 text-slate-600">Updates are shared only with authorized people in this demo.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{user.name ?? ({ elderly: "Mrs. Lin", family: "David Lin", caregiver: "Anna Chen", admin: "Admin User" }[role])}</p>
              <p className="text-xs text-slate-500">{roleConfig[role].label}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:ml-[272px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>CareBridge AI</span><span>/</span><span>{roleConfig[role].label}</span>
              </div>
              <h1 className="mt-1 truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Open notifications"
                  aria-expanded={notificationsOpen}
                  onClick={() => {
                    setNotificationsOpen((open) => !open);
                    setLanguageMenuOpen(false);
                  }}
                  className="relative rounded-xl"
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{notificationCount}</span>}
                </Button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-14 z-50 w-[min(90vw,360px)] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="font-bold text-slate-900">Recent updates</h2>
                      <button type="button" className="text-xs font-semibold text-blue-700" onClick={() => setNotificationsOpen(false)}>Close</button>
                    </div>
                    <EventList />
                  </div>
                )}
              </div>
              <div className="relative hidden sm:block">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLanguageMenuOpen((open) => !open);
                    setNotificationsOpen(false);
                  }}
                  aria-expanded={languageMenuOpen}
                  className="gap-2 rounded-xl"
                >
                  <Languages className="h-4 w-4 text-teal-700" />
                  <span>{language}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {languageMenuOpen && (
                  <div className="absolute right-0 top-14 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                    {["English", "繁體中文"].map((item) => (
                      <button key={item} type="button" onClick={() => setPreferredLanguage(item)} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">{item}</button>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="ghost" onClick={handleLogout} className="rounded-xl px-2 sm:px-3" aria-label="Sign out">
                <LogOut className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-5 pb-24 pt-7 sm:px-8 sm:pt-9 lg:pb-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{subtitle}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-4 w-4" /> Consent-aware demo
            </div>
          </div>
          {children}
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur lg:hidden">
        {roleConfig[role].nav.map((item, index) => (
          <a key={item.href} href={`${pathname}${item.href}`} onClick={() => setActiveSection(item.href)} className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${activeSection === item.href || (activeSection === "#top" && index === 0) ? "text-blue-700" : "text-slate-500"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${activeSection === item.href || (activeSection === "#top" && index === 0) ? "bg-blue-600" : "bg-slate-300"}`} />
            <span className="max-w-full truncate">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
