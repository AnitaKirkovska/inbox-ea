import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export type ItemType =
  | "lead"
  | "quote"
  | "follow_up"
  | "supplier_change"
  | "delivery"
  | "appointment"
  | "alert";

export type ItemStatus = "new" | "in_progress" | "done" | "ignored";
export type Priority = "urgent" | "high" | "normal" | "low";

export interface Item {
  id: string;
  type: ItemType;
  subject: string;
  counterparty: string;
  date: string;
  dueDate: string | null;
  status: ItemStatus;
  priority: Priority;
  source: "email" | "manual";
  notes: string;
  createdAt: string;
}

export type PreferredChannel = "email" | "slack";

export interface Store {
  items: Item[];
  lastScanAt: string | null;
  preferredChannel: PreferredChannel | null;
}

const STORAGE_DIR = process.env.VELLUM_WORKSPACE_DIR
  ? join(process.env.VELLUM_WORKSPACE_DIR, "plugins", "smb-inbox-brief", "data")
  : join(process.cwd(), "plugins-data", "smb-inbox-brief");

const STORE_FILE = join(STORAGE_DIR, "items.json");

export function ensureDir(): void {
  if (!existsSync(STORAGE_DIR)) {
    mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

export function loadStore(): Store {
  ensureDir();
  if (!existsSync(STORE_FILE)) {
    const empty: Store = { items: [], lastScanAt: null, preferredChannel: null };
    writeFileSync(STORE_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
  const raw = readFileSync(STORE_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Store;
    // Backward compat: ensure preferredChannel exists on older stores
    if (parsed.preferredChannel === undefined) {
      parsed.preferredChannel = null;
    }
    return parsed;
  } catch {
    return { items: [], lastScanAt: null, preferredChannel: null };
  }
}

export function saveStore(store: Store): void {
  ensureDir();
  writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
}

export function generateId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function daysBetween(from: string, to: string): number {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function getAgeDays(item: Item): number {
  return daysBetween(item.date, new Date().toISOString());
}

export function isOverdue(item: Item): boolean {
  if (!item.dueDate) return false;
  if (item.status === "done" || item.status === "ignored") return false;
  return new Date(item.dueDate) < new Date();
}

export function isAging(item: Item): boolean {
  if (item.status === "done" || item.status === "ignored") return false;
  if (item.type !== "follow_up" && item.type !== "quote") return false;
  return getAgeDays(item) >= 7;
}

export function priorityRank(p: Priority): number {
  const ranks: Record<Priority, number> = {
    urgent: 0,
    high: 1,
    normal: 2,
    low: 3,
  };
  return ranks[p];
}
