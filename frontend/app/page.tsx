import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  HeartHandshake,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "AI Elderly Assistant",
    description: "Simple daily check-ins, clear reminders, and friendly conversation in English or Traditional Chinese.",
    icon: MessageSquareHeart,
  },
  {
    title: "Family Coordination",
    description: "Authorized family members can monitor wellbeing updates, approve requests, and stay in sync.",
    icon: Users,
  },
  {
    title: "Caregiver Management",
    description: "Review tasks, schedules, and follow-ups while preserving consent boundaries and role restrictions.",
    icon: Stethoscope,
  },
  {
    title: "Privacy & Security",
    description: "Consent-first workflows, secure sessions, logging, and clear user controls for data sharing.",
    icon: ShieldCheck,
  },
];

const steps = [
  "Create the elder profile and consent settings.",
  "Schedule daily check-ins and care tasks.",
  "Family and caregivers share updates securely.",
  "AI summarizes routines and triggers human follow-up when needed.",
];

const faqs = [
  { q: "Is this a medical tool?", a: "No. CareBridge AI is a non-clinical care coordination platform designed to support communication and routines." },
  { q: "Can families and caregivers see updates?", a: "Only with consent and appropriate permissions; the platform enforces access rules." },
  { q: "Does it support Traditional Chinese?", a: "Yes. The demo speaks Traditional Chinese and English with locale-aware flows." },
  { q: "What happens if a check-in is missed?", a: "The system records the missed check-in, notifies the designated contacts, and supports human acknowledgment." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold">CareBridge AI</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#benefits">Benefits</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/auth">Family Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
              <Sparkles className="h-4 w-4" />
              Human-centered elderly care coordination
            </div>
            <h1 className="max-w-xl text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
              Care That Connects. AI That Supports. Families That Care.
            </h1>
            <p className="mt-6 max-w-lg text-xl leading-8 text-slate-600">
              Helping older adults stay connected, supported, and engaged through intelligent check-ins and human-centered care coordination.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/auth">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Trusted by care teams</div>
              <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-warning" /> Missed-check-in alerts</div>
            </div>
          </div>

          <div className="card-surface rounded-[28px] border border-slate-200 p-6 shadow-soft">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between pb-5">
                <div>
                  <p className="text-sm text-slate-500">Today</p>
                  <p className="text-2xl font-bold">Good morning, Mrs. Lin</p>
                </div>
                <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-brand-50 p-4 text-brand-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Daily check-in</span>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-medium">Completed</span>
                  </div>
                  <p className="mt-2 text-sm">Feeling comfortable. Would like a family call this afternoon.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500"><UserRound className="h-4 w-4" /> Family</div>
                    <p className="font-semibold">David Lin</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500"><Bell className="h-4 w-4" /> Reminders</div>
                    <p className="font-semibold">Medication check at 5:00 PM</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Button className="h-16">Talk to AI</Button>
                  <Button variant="secondary" className="h-16">Check-in</Button>
                  <Button variant="outline" className="h-16">Request Help</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">CareBridge AI</p>
            <h2 className="mt-3 text-4xl font-bold">Everything needed for calmer, connected care</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="h-full border-slate-200/80">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">How CareBridge AI Works</p>
          <h2 className="mt-3 text-4xl font-bold">A clear flow for families and caregivers</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">{index + 1}</div>
              <p className="text-lg font-semibold text-slate-800">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Benefits</p>
            <h2 className="mt-3 text-4xl font-bold">Built for trust, clarity, and peace of mind</h2>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6">
            <p className="text-3xl font-bold text-brand-300">92%</p>
            <p className="mt-2 text-slate-300">of families want clearer daily wellbeing visibility.</p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6">
            <p className="text-3xl font-bold text-brand-300">24/7</p>
            <p className="mt-2 text-slate-300">assistance reminders and check-ins with human escalation when appropriate.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">FAQ</p>
          <h2 className="mt-3 text-4xl font-bold">Questions families often ask</h2>
        </div>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">{q}</h3>
                <ChevronDown className="h-5 w-5 text-slate-500" />
              </div>
              <p className="mt-3 text-slate-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-bold">CareBridge AI</p>
            <p className="text-slate-500">Technology-enabled, human-led care.</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#faq">FAQ</a>
            <Link href="/auth">Login</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
