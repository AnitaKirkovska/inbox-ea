import type { ToolDefinition } from "@vellumai/plugin-api";
import { loadStore, type ItemType, type ItemStatus } from "../src/store";

const VALID_TYPES: ItemType[] = [
  "lead",
  "quote",
  "follow_up",
  "supplier_change",
  "delivery",
  "appointment",
  "alert",
];

const VALID_STATUSES: ItemStatus[] = ["new", "in_progress", "done", "ignored"];

const tool: ToolDefinition = {
  description:
    "List all stored inbox items, optionally filtered by type, status, or date range. Use when the owner asks 'show me my watchlist', 'what quotes do I have open', 'what's been completed', or when the assistant needs to check existing items before logging new ones. Returns all matching items with full details.",
  input_schema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: VALID_TYPES,
        description: "Filter by item type. Omit to return all types.",
      },
      status: {
        type: "string",
        enum: VALID_STATUSES,
        description: "Filter by status. Omit to return all statuses.",
      },
      fromDate: {
        type: "string",
        description: "ISO date. Only return items on or after this date.",
      },
      toDate: {
        type: "string",
        description: "ISO date. Only return items on or before this date.",
      },
    },
  },
  defaultRiskLevel: "low",
  execute: async (input: {
    type?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    const store = loadStore();
    let items = store.items;

    if (input.type) {
      items = items.filter((i) => i.type === input.type);
    }

    if (input.status) {
      items = items.filter((i) => i.status === input.status);
    }

    if (input.fromDate) {
      const from = new Date(input.fromDate);
      items = items.filter((i) => new Date(i.date) >= from);
    }

    if (input.toDate) {
      const to = new Date(input.toDate);
      items = items.filter((i) => new Date(i.date) <= to);
    }

    // Sort by date, newest first
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      content: JSON.stringify({
        count: items.length,
        items,
        lastScanAt: store.lastScanAt,
      }),
    };
  },
};

export default tool;
