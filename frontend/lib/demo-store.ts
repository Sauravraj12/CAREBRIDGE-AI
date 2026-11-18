export type DemoEvent = {
  id: string;
  type: "checkin" | "help" | "contact" | "task" | "note" | "chat";
  title: string;
  detail: string;
  createdAt: string;
  acknowledged?: boolean;
};

const EVENTS_KEY = "carebridge_events";

export function getDemoEvents(): DemoEvent[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(EVENTS_KEY);
  return stored ? (JSON.parse(stored) as DemoEvent[]) : [];
}

export function addDemoEvent(event: Omit<DemoEvent, "id" | "createdAt">): DemoEvent {
  const created: DemoEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const events = [created, ...getDemoEvents()];
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent("carebridge:events"));
  return created;
}

export function acknowledgeDemoEvent(id: string): void {
  const events = getDemoEvents().map((event) =>
    event.id === id ? { ...event, acknowledged: true } : event
  );
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent("carebridge:events"));
}
