import type { ToolDefinition } from "@vellumai/plugin-api";
import {
  loadStore,
  saveStore,
  type ItemStatus,
  type Priority,
} from "../src/store";

const VALID_STATUSES: ItemStatus[] = ["new", "in_progress", "done", "ignored"];
const VALID_PRIORITIES: Priority[] = ["urgent", "high", "normal", "low"];

const tool: ToolDefinition = {
  description:
    "Update an existing inbox item's status, priority, or notes. Use when the owner says 'mark the Henderson quote as done', 'ignore that supplier email', 'bump priority on the Martinez lead', or similar. Finds items by ID or by searching counterparty/subject.",
  input_schema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The item ID to update. If not provided, use search to find the item.",
      },
      search: {
        type: "string",
        description:
          "Search term to find the item by counterparty or subject. Used when ID is not known. Returns the first match.",
      },
      status: {
        type: "string",
        enum: VALID_STATUSES,
        description: "New status for the item.",
      },
      priority: {
        type: "string",
        enum: VALID_PRIORITIES,
        description: "New priority for the item.",
      },
      notes: {
        type: "string",
        description: "Additional notes to append to the item.",
      },
    },
  },
  defaultRiskLevel: "low",
  execute: async (input: {
    id?: string;
    search?: string;
    status?: string;
    priority?: string;
    notes?: string;
  }) => {
    if (!input.id && !input.search) {
      return {
        content: { error: "Either id or search is required to find the item." },
        isError: true,
      };
    }

    if (input.status && !VALID_STATUSES.includes(input.status as ItemStatus)) {
      return {
        content: { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        isError: true,
      };
    }

    if (input.priority && !VALID_PRIORITIES.includes(input.priority as Priority)) {
      return {
        content: { error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}` },
        isError: true,
      };
    }

    const store = loadStore();
    let item = store.items.find((i) => i.id === input.id);

    if (!item && input.search) {
      const term = input.search.toLowerCase();
      item = store.items.find(
        (i) =>
          i.counterparty.toLowerCase().includes(term) ||
          i.subject.toLowerCase().includes(term)
      );
    }

    if (!item) {
      return {
        content: { error: "Item not found." },
        isError: true,
      };
    }

    // Track what changed
    const changes: string[] = [];
    if (input.status) {
      changes.push(`status: ${item.status} → ${input.status}`);
      item.status = input.status as ItemStatus;
    }
    if (input.priority) {
      changes.push(`priority: ${item.priority} → ${input.priority}`);
      item.priority = input.priority as Priority;
    }
    if (input.notes) {
      item.notes = item.notes
        ? `${item.notes}\n${input.notes}`
        : input.notes;
      changes.push("notes updated");
    }

    saveStore(store);

    return {
      content: {
        id: item.id,
        updated: true,
        changes,
        item,
      },
    };
  },
};

export default tool;
