"use client";

import { useEffect, useState } from "react";
import { Bell, HeartPulse, MessageSquareText, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardAction, EventList } from "@/components/dashboard/dashboard-interactions";

const healthTrend = [
  { day: "Mon", score: 76 },
  { day: "Tue", score: 81 },
  { day: "Wed", score: 78 },
  { day: "Thu", score: 84 },
  { day: "Fri", score: 88 },
  { day: "Sat", score: 90 },
];

const notifications = [
  { title: "Daily check-in completed", time: "09:00 AM" },
  { title: "Anna Chen completed grocery support", time: "12:30 PM" },
  { title: "Mrs. Lin requested family contact", time: "2:15 PM" },
];

export default function FamilyDashboardPage() {
  const [sharingEnabled, setSharingEnabled] = useState(true);
  useEffect(() => {
    const refresh = () => setSharingEnabled(localStorage.getItem("carebridge_sharing_enabled") !== "false");
    refresh();
    window.addEventListener("carebridge:sharing", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("carebridge:sharing", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <DashboardShell role="family" title="Family Dashboard" subtitle="Overview of wellbeing, updates, and important family actions">
      <div id="overview" className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-[28px] bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800 p-7 text-white shadow-xl shadow-blue-950/10">
        <div><p className="text-sm font-semibold text-blue-200">FAMILY CARE OVERVIEW</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight">Good morning, David</h2><p className="mt-2 text-sm text-blue-100">A clear view of Mrs. Lin&apos;s shared updates and care plan.</p></div>
        <DashboardAction kind="contact" title="Contact Mrs. Lin" label="Send a family note" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Linked elderly members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-brand-600">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-success">4/5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-warning">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unacknowledged notices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-danger">1</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Daily wellbeing trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <div className="flex h-full items-end gap-3">
              {healthTrend.map((point) => (
                <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-brand-100" style={{ height: `${point.score}%` }} />
                  <span className="text-xs text-slate-500">{point.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card id="notifications">
          <CardHeader>
            <CardTitle>Recent notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="mt-1 rounded-full bg-brand-100 p-2 text-brand-600">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.time}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Updates created in this demo</p>
              <EventList />
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="profile" className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" /> Elderly profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">Mrs. Lin</p>
            <p className="text-sm text-slate-500">Preferred language: Zh-Hant</p>
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
              {sharingEnabled ? "Mrs. Lin has enabled routine update sharing for this demo." : "Routine sharing is paused by Mrs. Lin. You cannot view new personal updates."}
            </p>
          </CardContent>
        </Card>
        <Card id="history">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5" /> Daily summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{sharingEnabled ? "Feeling comfortable. Requested family contact in the afternoon." : "This update is hidden while sharing is paused."}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquareText className="h-5 w-5" /> Family communication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{sharingEnabled ? "Family note: Keep daily check-in reminder at 9:00 AM." : "Family notes are unavailable while sharing is paused."}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
