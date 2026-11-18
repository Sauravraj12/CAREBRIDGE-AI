"use client";

import { useState } from "react";
import { Activity, AlertTriangle, BarChart3, BellRing, Download, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EventList, SharingControl } from "@/components/dashboard/dashboard-interactions";
import { addDemoEvent } from "@/lib/demo-store";

const metrics = [
  { label: "Total users", value: "128", detail: "+8 this month", color: "blue" },
  { label: "Elderly users", value: "47", detail: "Consent records active", color: "teal" },
  { label: "Caregivers", value: "29", detail: "Across 12 teams", color: "violet" },
  { label: "Check-ins today", value: "84%", detail: "Based on demo activity", color: "amber" },
];
const trend = [
  { day: "Mon", checkins: 70, tasks: 60 },
  { day: "Tue", checkins: 72, tasks: 65 },
  { day: "Wed", checkins: 80, tasks: 73 },
  { day: "Thu", checkins: 82, tasks: 76 },
  { day: "Fri", checkins: 88, tasks: 82 },
];

export default function AdminDashboardPage() {
  const [escalationsAcknowledged, setEscalationsAcknowledged] = useState(false);
  const [notificationsReviewed, setNotificationsReviewed] = useState(false);

  const exportReport = () => {
    const report = [
      ["Metric", "Value"],
      ["Total users", "128"],
      ["Elderly users", "47"],
      ["Caregivers", "29"],
      ["Check-ins today", "84%"],
      ["Report type", "Synthetic demonstration data"],
    ].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "carebridge-demo-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    addDemoEvent({ type: "note", title: "Admin report exported", detail: "Synthetic dashboard summary exported as CSV.", acknowledged: true });
  };

  const acknowledgeEscalations = () => {
    setEscalationsAcknowledged(true);
    addDemoEvent({ type: "note", title: "Demo escalations reviewed", detail: "Admin acknowledged the synthetic incident-watch entries.", acknowledged: true });
  };

  const reviewNotifications = () => {
    setNotificationsReviewed(true);
    addDemoEvent({ type: "note", title: "Notification queue reviewed", detail: "Admin reviewed the synthetic notification monitor.", acknowledged: true });
  };

  return (
    <DashboardShell role="admin" title="Admin dashboard" subtitle="Platform activity, operational checks, and account oversight">
      <div id="overview" className="mb-6 flex flex-wrap items-end justify-between gap-5 rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 text-white shadow-xl shadow-slate-950/10">
        <div>
          <p className="text-sm font-bold text-blue-200">PLATFORM OPERATIONS · DEMO DATA</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Care operations at a glance</h2>
          <p className="mt-2 text-sm text-slate-300">Synthetic activity for the CareBridge demonstration workspace.</p>
        </div>
        <Button type="button" onClick={exportReport} className="rounded-xl bg-white text-slate-900 hover:bg-blue-50"><Download className="mr-2 h-4 w-4" /> Export report</Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={metric.label} className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-semibold text-slate-500">{metric.label}</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{metric.value}</p></div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${index === 0 ? "bg-blue-50 text-blue-700" : index === 1 ? "bg-teal-50 text-teal-700" : index === 2 ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-700"}`}>
                  {index === 0 ? <Users className="h-5 w-5" /> : index === 1 ? <ShieldCheck className="h-5 w-5" /> : index === 2 ? <Activity className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-blue-700" /> Weekly activity</CardTitle>
            <p className="text-sm text-slate-500">Illustrative, synthetic activity—not live medical monitoring.</p>
          </CardHeader>
          <CardContent className="h-72">
            <div className="flex h-full items-end gap-4">
              {trend.map((entry) => (
                <div key={entry.day} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
                  <div className="flex h-[80%] w-full items-end justify-center gap-1">
                    <div className="w-[42%] rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-400" style={{ height: `${entry.checkins}%` }} title={`${entry.checkins}% check-ins`} />
                    <div className="w-[42%] rounded-t-lg bg-gradient-to-t from-teal-700 to-teal-400" style={{ height: `${entry.tasks}%` }} title={`${entry.tasks}% tasks`} />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{entry.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-5 text-xs font-medium text-slate-500"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-blue-600" /> Check-ins</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-teal-600" /> Tasks</span></div>
          </CardContent>
        </Card>

        <Card id="incidents" className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-600" /> Incident watch</CardTitle>
            <p className="text-sm text-slate-500">Sample workflow states only.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <div className="flex items-start justify-between gap-3"><p className="font-bold text-slate-800">2 check-in follow-ups</p><span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">{escalationsAcknowledged ? "Reviewed" : "Pending"}</span></div>
              <p className="mt-2 text-xs leading-5 text-slate-600">Missed check-ins do not imply an emergency. Follow up with designated contacts.</p>
              <Button type="button" variant="outline" size="sm" disabled={escalationsAcknowledged} onClick={acknowledgeEscalations} className="mt-3">{escalationsAcknowledged ? "Acknowledged" : "Acknowledge review"}</Button>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
              <div className="flex items-start justify-between gap-3"><p className="font-bold text-slate-800">5 notification attempts</p><span className="rounded-full bg-rose-100 px-2 py-1 text-[10px] font-bold text-rose-800">{notificationsReviewed ? "Reviewed" : "Review"}</span></div>
              <p className="mt-2 text-xs leading-5 text-slate-600">Demo records only. No external delivery provider is connected.</p>
              <Button type="button" variant="outline" size="sm" disabled={notificationsReviewed} onClick={reviewNotifications} className="mt-3">{notificationsReviewed ? "Queue reviewed" : "Review queue"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card id="users" className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader><CardTitle>Demo user directory</CardTitle><p className="text-sm text-slate-500">Synthetic accounts for walkthroughs.</p></CardHeader>
          <CardContent className="space-y-2">
            {[
              ["Mrs. Lin", "Elderly user", "Active"],
              ["David Lin", "Family member", "Active"],
              ["Anna Chen", "Caregiver", "Active"],
              ["Admin User", "Administrator", "Active"],
            ].map(([name, role, status]) => (
              <div key={name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                <span><span className="block text-sm font-bold text-slate-800">{name}</span><span className="text-xs text-slate-500">{role}</span></span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">{status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card id="consent" className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader><CardTitle>Consent and sharing state</CardTitle><p className="text-sm text-slate-500">The elder controls their own routine sharing preference.</p></CardHeader>
          <CardContent className="flex items-center justify-between gap-5 rounded-2xl bg-slate-50 p-4">
            <div><p className="font-bold text-slate-800">Mrs. Lin · routine family updates</p><p className="mt-1 text-xs text-slate-500">Changes apply to family dashboard detail visibility in this browser demo.</p></div>
            <SharingControl />
          </CardContent>
        </Card>
      </div>

      <div id="management" className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader><CardTitle>Management areas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              ["User management", "Roles and enrollment status", "#users"],
              ["Consent records", "Sharing preferences and history", "#consent"],
              ["System activity", "AI fallback and audit events", "#audit"],
            ].map(([label, detail, href]) => (
              <a key={label} href={href} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition hover:bg-blue-50">
                <span><span className="block text-sm font-bold text-slate-800">{label}</span><span className="text-xs text-slate-500">{detail}</span></span><span className="text-blue-700" aria-hidden="true">→</span>
              </a>
            ))}
          </CardContent>
        </Card>
        <Card id="audit" className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader><CardTitle>Recent demo audit activity</CardTitle></CardHeader>
          <CardContent><EventList /></CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
