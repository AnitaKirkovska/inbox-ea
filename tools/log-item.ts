import type { ToolDefinition } from "@vellumai/plugin-api";
import {
  loadStore,
  saveStore,
  generateId,
  type Item,
  type ItemType,
  type ItemStatus,
  type Priority,
} from "../src/store";

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
const VALID_PRIORITIES: Priority[] = ["urgent", "high", "normal", "low"];

const tool: ToolDefinition = {
  description:
    "Log a new inbox item extracted from email or entered manually by the business owner. Validates required fields and rejects incomplete entries. Use this when the assistant finds a business-relevant item in the inbox (a lead, quote, follow-up, supplier change, delivery notification, appointment request, or alert) or when the owner says something like 'log a new lead from Sarah'.",
  input_schema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: VALID_TYPES,
        description:
          "The kind of item. lead = new prospect inquiry. quote = a quote sent or received. follow_up = a thread that needs a reply. supplier_change = price change or policy update from a supplier. delivery = shipment or delivery notification. appointment = scheduling request or confirmation. alert = anything else needing attention.",
      },
      subject: {
        type: "string",
        description: "What the item is about, in plain language. e.g. 'Kitchen reno quote for Henderson'.",
      },
      counterparty: {
        type: "string",
        description: "Who the item is with. Customer name, supplier name, etc.",
      },
      date: {
        type: "string",
        description: "ISO date when the item was detected or occurred. e.g. 2026-07-08T14:00:00Z.",
      },
      dueDate: {
        type: "string",
        description: "ISO date when action is needed, if applicable. null if no deadline.",
      },
      status: {
        type: "string",
        enum: VALID_STATUSES,
        description: "Current status. Defaults to 'new'.",
      },
      priority: {
        type: "string",
        enum: VALID_PRIORITIES,
        description: "How urgent. Defaults to 'normal'.",
      },
      source: {
        type: "string",
        enum: ["email", "manual"],
        description: "Whether the assistant found this in email or the owner logged it manually.",
      },
      notes: {
        type: "string",
        description: "Additional context from the assistant or owner.",
      },
    },
    required: ["type", "subject", "counterparty", "date"],
  },
  defaultRiskLevel: "low",
  execute: async (input: {
    type: string;
    subject: string;
    counterparty: string;
    date: string;
    dueDate?: string;
    status?: string;
    priority?: string;
    source?: string;
    notes?: string;
  }) => {
    // Validate required fields
    if (!input.type || !VALID_TYPES.includes(input.type as ItemType)) {
      return {
        content: { error: `Invalid or missing type. Must be one of: ${VALID_TYPES.join(", ")}` },
        isError: true,
      };
    }
    if (!input.subject || input.subject.trim().length === 0) {
      return { content: { error: "subject is required and cannot be empty" }, isError: true };
    }
    if (!input.counterparty || input.counterparty.trim().length === 0) {
      return { content: { error: "counterparty is required and cannot be empty" }, isError: true };
    }
    if (!input.date) {
      return { content: { error: "date is required" }, isError: true };
    }

    const item: Item = {
      id: generateId(),
      type: input.type as ItemType,
      subject: input.subject.trim(),
      counterparty: input.counterparty.trim(),
      date: input.date,
      dueDate: input.dueDate || null,
      status: (input.status as ItemStatus) || "new",
      priority: (input.priority as Priority) || "normal",
      source: (input.source as "email" | "manual") || "email",
      notes: input.notes || "",
      createdAt: new Date().toISOString(),
    };

    const store = loadStore();
    store.items.push(item);
    saveStore(store);

    return {
      content: {
        id: item.id,
        logged: true,
        item,
        totalItems: store.items.length,
      },
    };
  },
};

export default tool;
