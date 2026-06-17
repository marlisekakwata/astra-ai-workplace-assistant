export type HistoryEntry = {
  id: string;
  tool: "email" | "meeting" | "chat";
  title: string;
  preview: string;
  payload: unknown;
  createdAt: number;
};

const KEY = "awpa:history";
const MAX = 30;

function safeRead(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function getHistory(): HistoryEntry[] {
  return safeRead();
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const items = safeRead();
  const next: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const merged = [next, ...items].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event("awpa:history-changed"));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("awpa:history-changed"));
}
