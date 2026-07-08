import type { ToolDefinition } from "@vellumai/plugin-api";
import {
  loadStore,
  saveStore,
  isOverdue,
  isAging,
  getAgeDays,
  priorityRank,
  type Item,
} from "../src/store";

function formatBrief(items: Item[]): {
  overdue: Item[];
  aging: Item[];
  newToday: Item[];
  upcoming: Item[];
  other: Item[];
  summary: {
    total: number;
    overdueCount: number;
    agingCount: number;
    newTodayCount: number;
    upcomingCount: number;
    activeCount: number;
    doneCount: number;
  };
} {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const active = items.filter(
    (i) => i.status !== "done" && i.status !== "ignored"
  );

  const overdue = active
    .filter((i) => isOverdue(i))
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));

  const aging = active
    .filter((i) => isAging(i) && !isOverdue(i))
    .sort((a, b) => getAgeDays(b) - getAgeDays(a));

  const newToday = active
    .filter((i) => {
      const itemDate = new Date(i.date);
      return itemDate >= todayStart && !isOverdue(i) && !isAging(i);
    })
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));

  const upcoming = active
    .filter((i) => {
      if (!i.dueDate) return false;
      if (isOverdue(i) || isAging(i) || newToday.includes(i)) return false;
      const due = new Date(i.dueDate);
      const weekOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return due <= weekOut;
    })
    .sort((a, b) => {
      const dueA = new Date(a.dueDate!).getTime();
      const dueB = new Date(b.dueDate!).getTime();
      return dueA - dueB;
    });

  const other = active
    .filter(
      (i) =>
        !overdue.includes(i) &&
        !aging.includes(i) &&
        !newToday.includes(i) &&
        !upcoming.includes(i)
    )
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));

  const doneCount = items.filter((i) => i.status === "done").length;

  return {
    overdue,
    aging,
    newToday,
    upcoming,
    other,
    summary: {
      total: items.length,
      overdueCount: overdue.length,
      agingCount: aging.length,
      newTodayCount: newToday.length,
      upcomingCount: upcoming.length,
      activeCount: active.length,
      doneCount,
    },
  };
}

function renderItem(item: Item): string {
  const ageDays = getAgeDays(item);
  const ageLabel =
    ageDays === 0 ? "today" : ageDays === 1 ? "1 day ago" : `${ageDays} days ago`;
  const dueLabel = item.dueDate
    ? ` | due ${new Date(item.dueDate).toLocaleDateString()}`
    : "";
  return `- [${item.priority.toUpperCase()}] ${item.subject} — ${item.counterparty} (${item.type}, ${ageLabel}${dueLabel})`;
}

const tool: ToolDefinition = {
  description:
    "Get the urgency-ranked business brief. Reads all stored items, sorts by urgency (overdue first, then aging quotes/follow-ups older than 7 days, then new items from today, then upcoming deadlines within a week, then everything else). Returns a structured brief designed to be delivered every morning. Also writes a markdown file to the workspace for history. Call this after scanning email and logging new items, or when the owner asks 'what needs my attention' or 'give me my brief'.",
  input_schema: {
    type: "object",
    properties: {
      updateLastScan: {
        type: "boolean",
        description:
          "If true, updates lastScanAt to now. Set this when the brief is generated after an email scan. Defaults to true.",
      },
    },
  },
  defaultRiskLevel: "low",
  execute: async (input: { updateLastScan?: boolean }) => {
    const store = loadStore();
    const brief = formatBrief(store.items);

    // Build the brief text
    const sections: string[] = [];

    if (brief.overdue.length > 0) {
      sections.push(
        `OVERDUE (${brief.overdue.length}):\n` +
          brief.overdue.map(renderItem).join("\n")
      );
    }

    if (brief.aging.length > 0) {
      sections.push(
        `AGING — needs follow-up (${brief.aging.length}):\n` +
          brief.aging.map(renderItem).join("\n")
      );
    }

    if (brief.newToday.length > 0) {
      sections.push(
        `NEW TODAY (${brief.newToday.length}):\n` +
          brief.newToday.map(renderItem).join("\n")
      );
    }

    if (brief.upcoming.length > 0) {
      sections.push(
        `DUE THIS WEEK (${brief.upcoming.length}):\n` +
          brief.upcoming.map(renderItem).join("\n")
      );
    }

    if (brief.other.length > 0) {
      sections.push(
        `ON YOUR WATCHLIST (${brief.other.length}):\n` +
          brief.other.map(renderItem).join("\n")
      );
    }

    if (sections.length === 0) {
      sections.push("Nothing needs attention right now. Your watchlist is clear.");
    }

    const briefText = `INBOX EA — ${new Date().toLocaleDateString()}\n\n${sections.join("\n\n")}`;

    // Write markdown file for history
    try {
      const { writeFileSync, mkdirSync, existsSync } = await import("fs");
      const { join } = await import("path");
      const briefDir = process.env.VELLUM_WORKSPACE_DIR
        ? join(process.env.VELLUM_WORKSPACE_DIR, "plugins", "inbox-ea", "briefs")
        : join(process.cwd(), "plugins-data", "inbox-ea", "briefs");
      if (!existsSync(briefDir)) {
        mkdirSync(briefDir, { recursive: true });
      }
      const today = new Date().toISOString().slice(0, 10);
      writeFileSync(join(briefDir, `${today}.md`), briefText, "utf-8");
    } catch {
      // Brief file write is best-effort, don't fail the tool
    }

    // Update lastScanAt
    if (input.updateLastScan !== false) {
      store.lastScanAt = new Date().toISOString();
      saveStore(store);
    }

    return {
      content: {
        brief: briefText,
        summary: brief.summary,
        lastScanAt: store.lastScanAt,
      },
    };
  },
};

export default tool;
