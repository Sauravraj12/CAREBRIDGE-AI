"use client";

import { FormEvent, useEffect, useState } from "react";
import { CalendarDays, Check, ClipboardList, HeartHandshake, NotebookPen, Plus, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardAction, EventList } from "@/components/dashboard/dashboard-interactions";
import { addDemoEvent } from "@/lib/demo-store";

type CareTask = { id: string; title: string; status: "Pending" | "In Progress" | "Completed"; time: string };
const TASKS_KEY = "carebridge_caregiver_tasks";
const initialTasks: CareTask[] = [
  { id: "morning-check", title: "Morning wellness check", status: "In Progress", time: "9:00 AM" },
  { id: "groceries", title: "Grocery assistance", status: "Pending", time: "11:30 AM" },
  { id: "visit-followup", title: "Visit notes follow-up", status: "Completed", time: "1:00 PM" },
];
const taskLoad = [
  { day: "Mon", tasks: 3 },
  { day: "Tue", tasks: 4 },
  { day: "Wed", tasks: 5 },
  { day: "Thu", tasks: 4 },
  { day: "Fri", tasks: 6 },
];

export default function CaregiverDashboardPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(TASKS_KEY);
    if (stored) setTasks(JSON.parse(stored) as CareTask[]);
  }, []);

  const saveTasks = (nextTasks: CareTask[]) => {
    setTasks(nextTasks);
    localStorage.setItem(TASKS_KEY, JSON.stringify(nextTasks));
  };

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;
    const task = { id: crypto.randomUUID(), title, status: "Pending" as const, time: "Today" };
    saveTasks([task, ...tasks]);
    addDemoEvent({ type: "task", title: "Care task created", detail: title, acknowledged: true });
    setNewTaskTitle("");
    setShowNewTask(false);
  };

  const toggleTask = (taskId: string) => {
    const nextTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: task.status === "Completed" ? "Pending" as const : "Completed" as const }
        : task
    );
    saveTasks(nextTasks);
    const task = nextTasks.find((item) => item.id === taskId);
    if (task?.status === "Completed") {
      addDemoEvent({ type: "task", title: "Care task completed", detail: task.title, acknowledged: true });
    }
  };

  const pendingCount = tasks.filter((task) => task.status !== "Completed").length;
  return (
    <DashboardShell role="caregiver" title="Caregiver workspace" subtitle="Your schedule, assigned tasks, and care-team updates">
      <div id="overview" className="mb-6 flex flex-wrap items-end justify-between gap-5 rounded-[28px] bg-gradient-to-br from-teal-800 via-teal-700 to-blue-800 p-7 text-white shadow-xl shadow-teal-950/10">
        <div>
          <p className="text-sm font-bold text-teal-100">TUESDAY · FIELD WORKSPACE</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Hello, Anna</h2>
          <p className="mt-2 text-sm text-teal-50">Here is your care plan for today.</p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3">
          <p className="text-xs text-teal-100">OPEN TASKS</p><p className="mt-1 text-2xl font-extrabold">{pendingCount}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Assigned elders", "06", "Clients in your care"],
          ["Today’s visits", "03", "Scheduled today"],
          ["Pending tasks", String(pendingCount).padStart(2, "0"), "Need your attention"],
          ["Requests", "02", "Awaiting acknowledgment"],
        ].map(([label, value, caption]) => (
          <Card key={label} className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card id="schedule" className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-teal-700" /> Weekly task load</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <div className="flex h-full items-end gap-3">
              {taskLoad.map((entry) => (
                <div key={entry.day} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
                  <div className="flex h-[78%] w-full items-end">
                    <div className="w-full rounded-t-xl bg-gradient-to-t from-teal-700 to-teal-400 transition-all hover:from-blue-700 hover:to-blue-400" style={{ height: `${entry.tasks * 15}%` }} title={`${entry.tasks} tasks`} />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{entry.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card id="tasks" className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-teal-700" /> Assigned tasks</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowNewTask((value) => !value)}><Plus className="mr-1 h-4 w-4" /> Add task</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {showNewTask && (
              <form onSubmit={addTask} className="flex gap-2 rounded-xl bg-teal-50 p-3">
                <input autoFocus required value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="New task title" className="min-w-0 flex-1 rounded-lg border border-teal-100 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500" />
                <Button type="submit" size="sm">Save</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewTask(false)}>Cancel</Button>
              </form>
            )}
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-teal-100 hover:bg-teal-50/40">
                <button
                  type="button"
                  aria-label={task.status === "Completed" ? `Reopen ${task.title}` : `Mark ${task.title} complete`}
                  onClick={() => toggleTask(task.id)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${task.status === "Completed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-400 hover:border-teal-300 hover:text-teal-700"}`}
                >
                  {task.status === "Completed" ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-amber-400" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-bold ${task.status === "Completed" ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><TimerReset className="h-3 w-3" />{task.time}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${task.status === "Completed" ? "bg-emerald-50 text-emerald-700" : task.status === "In Progress" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{task.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div id="updates" className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><HeartHandshake className="h-5 w-5 text-teal-700" /> Visit notes</CardTitle>
            <DashboardAction kind="note" title="Add a visit note" label="Add note" variant="outline" className="h-10 rounded-xl px-3 text-xs" />
          </CardHeader>
          <CardContent><p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Mrs. Lin shared that she feels comfortable and requested a family call this afternoon.</p></CardContent>
        </Card>
        <Card className="border-0 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <CardHeader><CardTitle className="flex items-center gap-2"><NotebookPen className="h-5 w-5 text-teal-700" /> Recent care-team updates</CardTitle></CardHeader>
          <CardContent><EventList filter="note" /></CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
