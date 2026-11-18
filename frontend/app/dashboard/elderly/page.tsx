import { Bell, CheckCircle2, Clock3, MessageSquareHeart, ShieldCheck, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardAction, EventList, SharingControl } from "@/components/dashboard/dashboard-interactions";

const reminders = [
  "Take your morning vitamins.",
  "Family call at 3:00 PM.",
  "Doctor visit reminder on Friday.",
];

const activities = [
  "Morning wellness check",
  "Tea with neighbor",
  "Family check-in",
  "Evening walk",
];

export default function ElderlyDashboardPage() {
  return (
    <DashboardShell role="elderly" title="Good Morning, Mrs. Lin!" subtitle="How are you feeling today?">
      <div id="overview" className="mb-6 rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-teal-700 p-6 text-white shadow-xl shadow-blue-900/10 sm:p-8">
        <p className="text-sm font-semibold text-blue-100">TUESDAY · YOUR DAILY CARE SPACE</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Good morning, Mrs. Lin!</h2>
          <p className="mt-2 text-base text-blue-50 sm:text-lg">You are connected. What would you like to do?</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
          <p className="text-xs text-blue-100">TODAY&apos;S CHECK-IN</p>
          <p className="mt-1 flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4" /> Ready whenever you are</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
          <DashboardAction kind="chat" title="Talk to CareBridge Assistant" variant="default" className="h-[76px] justify-start gap-3 rounded-2xl bg-blue-700 px-5 text-left text-base shadow-lg shadow-blue-900/10 hover:bg-blue-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><MessageSquareHeart className="h-5 w-5" /></span>
            <span><span className="block font-bold">Talk to AI</span><span className="block text-xs font-medium text-blue-100">Friendly daily support</span></span>
          </DashboardAction>
          <DashboardAction kind="checkin" title="Your daily check-in" variant="secondary" className="h-[76px] justify-start gap-3 rounded-2xl px-5 text-left text-base">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><CheckCircle2 className="h-5 w-5" /></span>
            <span><span className="block font-bold">Daily check-in</span><span className="block text-xs font-medium text-teal-50">Share how you feel</span></span>
          </DashboardAction>
          <DashboardAction kind="help" title="Request human assistance" variant="outline" className="h-[76px] justify-start gap-3 rounded-2xl border-rose-200 bg-white px-5 text-left text-base text-rose-700 hover:bg-rose-50">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50"><Bell className="h-5 w-5" /></span>
            <span><span className="block font-bold">Request help</span><span className="block text-xs font-medium text-slate-500">Contact a person</span></span>
          </DashboardAction>
          </div>

          <Card id="checkins" className="overflow-hidden border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader className="flex-row items-center justify-between border-b border-slate-100">
            <CardTitle>Today&apos;s check-in</CardTitle>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Ready</span>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-50 to-teal-50 p-5 text-slate-800">
              <div>
                <p className="text-lg font-bold">How are you feeling today?</p>
                <p className="mt-1 text-sm text-slate-600">Your answer helps your authorized care circle stay updated.</p>
              </div>
              <DashboardAction kind="checkin" title="Your daily check-in" variant="outline" className="shrink-0 border-blue-200 bg-white text-blue-700">
                <span className="hidden sm:inline">Start check-in</span><span className="sm:hidden">Start</span>
              </DashboardAction>
            </div>
          </CardContent>
          </Card>

          <Card id="activities" className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>My daily activities</CardTitle>
              <DashboardAction kind="task" title="Add a daily activity" label="Add activity" variant="outline" className="h-10 rounded-xl px-3 text-xs" />
            </CardHeader>
            <CardContent className="space-y-2">
              {activities.map((activity, index) => (
                <div key={activity} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${index === 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{index === 0 ? <CheckCircle2 className="h-4 w-4" /> : index + 1}</span>
                  <span className="flex-1 font-medium text-slate-700">{activity}</span>
                  <span className="text-xs text-slate-400">{index === 0 ? "Done" : "Today"}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-brand-600" />
                  <span>Current time</span>
                </div>
                <span className="font-semibold">9:15 AM</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-brand-600" />
                  <span>Contact family</span>
                </div>
                <span className="font-semibold">David</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-brand-600" />
                  <span>Support</span>
                </div>
                <span className="font-semibold">Available</span>
              </div>
            </CardContent>
          </Card>

          <Card id="support">
            <CardHeader>
              <CardTitle>Today&apos;s reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminders.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <Bell className="h-5 w-5 text-warning" />
                  <span className="flex-1">{item}</span>
                </div>
              ))}
              <DashboardAction kind="contact" title="Contact your family" label="Ask family to call" variant="outline" className="w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Family update sharing</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-sm leading-6 text-slate-600">Pause sharing your routine updates with family at any time.</p>
              <SharingControl />
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-teal-50 to-blue-50 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <CardTitle>CareBridge Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl bg-teal-50 p-4 text-teal-700">
                <div className="flex items-center gap-2">
                  <MessageSquareHeart className="h-5 w-5" />
                  <span className="font-semibold">How can I help today?</span>
                </div>
                <p className="mt-2 text-sm">I can help you contact family, review tasks, or schedule reminders.</p>
                <DashboardAction kind="chat" title="Talk to CareBridge Assistant" label="Start a conversation" variant="secondary" className="mt-4 w-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Recent updates</CardTitle></CardHeader>
            <CardContent><EventList /></CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
