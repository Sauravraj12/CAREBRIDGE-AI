"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Mic,
  MicOff,
  Send,
  Volume2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { acknowledgeDemoEvent, addDemoEvent, DemoEvent, getDemoEvents } from "@/lib/demo-store";

type ActionKind = "chat" | "checkin" | "help" | "contact" | "task" | "note";

type DashboardActionProps = {
  kind: ActionKind;
  title: string;
  label?: string;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  elderName?: string;
};

const prompts: Record<ActionKind, string> = {
  chat: "Share what is on your mind. You can also use your voice if your browser supports it.",
  checkin: "Tell us how you are feeling today. Your response is saved as a demo check-in.",
  help: "Describe the kind of human assistance you would like us to request.",
  contact: "Add a short message for your authorized family contact.",
  task: "Add a care task to the local demonstration list.",
  note: "Write an update for the care coordination timeline.",
};

function assistantReply(message: string): string {
  const text = message.toLowerCase();
  if (/emergency|unsafe|hurt|pain|dizzy|help now/.test(text)) {
    return "If you are in immediate danger or this is an emergency, contact local emergency services or a trusted person now. I can also record a request for human assistance.";
  }
  if (/lonely|alone|sad|miss/.test(text)) {
    return "Thank you for sharing that. Would you like me to create a request to contact your authorized family member?";
  }
  if (/family|daughter|son|contact/.test(text)) {
    return "I can record a family contact request. The app will show it as pending; it does not confirm delivery.";
  }
  return "Thank you for telling me. I can help with a reminder, a family contact request, or a request for human assistance.";
}

export function DashboardAction({
  kind,
  title,
  label,
  children,
  className,
  variant = "outline",
  elderName = "Mrs. Lin",
}: DashboardActionProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Comfortable");
  const [saved, setSaved] = useState(false);
  const [messages, setMessages] = useState<{ from: "assistant" | "you"; text: string }[]>([
    { from: "assistant", text: "Hello. How can I help you today?" },
  ]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!open) {
      setSaved(false);
      setText("");
      setListening(false);
    }
  }, [open]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const detail = kind === "checkin" ? `${mood}. ${text.trim()}` : text.trim();
    if (!detail) return;
    const titles: Record<ActionKind, string> = {
      chat: "Assistant conversation",
      checkin: "Daily check-in completed",
      help: "Human assistance request",
      contact: "Family contact request",
      task: "Care task added",
      note: "Care update added",
    };
    addDemoEvent({
      type: kind,
      title: titles[kind],
      detail,
      acknowledged: false,
    });
    if (kind === "chat") {
      setMessages((current) => [
        ...current,
        { from: "you", text: text.trim() },
        { from: "assistant", text: assistantReply(text) },
      ]);
      setText("");
      return;
    }
    setSaved(true);
    setText("");
  };

  const sendChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    addDemoEvent({
      type: "chat",
      title: "Assistant conversation",
      detail: text.trim(),
      acknowledged: true,
    });
    setMessages((current) => [
      ...current,
      { from: "you", text: text.trim() },
      { from: "assistant", text: assistantReply(text) },
    ]);
    setText("");
  };

  const beginVoiceInput = () => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
          (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition
        : undefined;
    if (!SpeechRecognition) {
      setText("Voice input is not supported in this browser. Please type your message.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      setText(event.results[0]?.[0]?.transcript ?? "");
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  const speakLastReply = () => {
    if (!("speechSynthesis" in window)) return;
    const lastReply = [...messages].reverse().find((message) => message.from === "assistant");
    if (lastReply) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(lastReply.text));
    }
  };

  return (
    <>
      <Button type="button" variant={variant} className={className} onClick={() => setOpen(true)}>
        {children ?? label ?? title}
      </Button>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-title"
            className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl border border-white/70 bg-white p-6 shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">CareBridge demo</p>
                <h2 id="action-title" className="mt-1 text-2xl font-bold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{prompts[kind]}</p>
              </div>
              <button type="button" aria-label="Close dialog" onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </header>

            {kind === "chat" ? (
              <div className="mt-5">
                <div className="max-h-64 space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-4" aria-live="polite">
                  {messages.map((message, index) => (
                    <p key={`${index}-${message.text}`} className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.from === "you" ? "ml-auto bg-brand-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}>
                      {message.text}
                    </p>
                  ))}
                </div>
                <form onSubmit={sendChat} className="mt-4 flex gap-2">
                  <input aria-label="Message CareBridge Assistant" value={text} onChange={(event) => setText(event.target.value)} placeholder="Type a message…" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                  <Button type="button" variant="outline" size="icon" aria-label={listening ? "Listening" : "Start voice input"} onClick={beginVoiceInput}>
                    {listening ? <MicOff className="h-4 w-4 text-danger" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button type="submit" size="icon" aria-label="Send message"><Send className="h-4 w-4" /></Button>
                </form>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{listening ? "Listening only after your request…" : "Demo assistant · not a medical service"}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={speakLastReply}><Volume2 className="mr-1 h-4 w-4" /> Read aloud</Button>
                </div>
              </div>
            ) : saved ? (
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-800" role="status">
                <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" /> Saved in this demo</div>
                <p className="mt-2 text-sm">Your update is recorded locally. No external message delivery is claimed.</p>
                <Button className="mt-4" onClick={() => setOpen(false)}>Done</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                {kind === "checkin" && (
                  <label className="block text-sm font-medium text-slate-700">
                    How are you feeling?
                    <select value={mood} onChange={(event) => setMood(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3">
                      {["Comfortable", "Happy", "Tired", "Lonely", "Need support"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                )}
                <label className="block text-sm font-medium text-slate-700">
                  {kind === "task" ? "Task title" : kind === "note" ? "Update" : "Message"}
                  <textarea
                    autoFocus
                    required
                    rows={4}
                    maxLength={500}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={kind === "help" ? `What help would you like, ${elderName}?` : "Write here…"}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </label>
                <p className="text-xs text-slate-500">{text.length}/500 · saved only in this browser demo</p>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit"><Check className="mr-2 h-4 w-4" />Save update</Button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}

type SpeechRecognitionLike = {
  lang: string;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

export function EventList({ filter }: { filter?: DemoEvent["type"] }) {
  const [events, setEvents] = useState<DemoEvent[]>([]);
  useEffect(() => {
    const refresh = () => setEvents(getDemoEvents());
    refresh();
    window.addEventListener("carebridge:events", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("carebridge:events", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filtered = events.filter((event) => !filter || event.type === filter);
  if (!filtered.length) return <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Updates you add in this demo will appear here.</p>;
  return (
    <div className="space-y-3">
      {filtered.slice(0, 6).map((event) => (
        <article key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-800">{event.title}</p>
            <span className="shrink-0 text-xs text-slate-500">{new Date(event.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{event.detail}</p>
          {event.type === "help" || event.type === "contact" ? <p className="mt-3 text-xs font-semibold text-amber-700">Pending · delivery not confirmed</p> : null}
          {!event.acknowledged && (
            <button type="button" onClick={() => acknowledgeDemoEvent(event.id)} className="mt-3 text-xs font-bold text-blue-700 hover:text-blue-900">
              Mark as acknowledged
            </button>
          )}
        </article>
      ))}
    </div>
  );
}

export function SharingControl() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const refresh = () => setEnabled(localStorage.getItem("carebridge_sharing_enabled") !== "false");
    refresh();
    window.addEventListener("carebridge:sharing", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("carebridge:sharing", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const toggleSharing = () => {
    const nextEnabled = !enabled;
    localStorage.setItem("carebridge_sharing_enabled", String(nextEnabled));
    setEnabled(nextEnabled);
    window.dispatchEvent(new CustomEvent("carebridge:sharing"));
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={toggleSharing}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${enabled ? "bg-teal-600" : "bg-slate-300"}`}
    >
      <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
      <span className="sr-only">{enabled ? "Pause family sharing" : "Resume family sharing"}</span>
    </button>
  );
}
