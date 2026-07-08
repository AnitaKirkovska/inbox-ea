import type { ToolDefinition } from "@vellumai/plugin-api";
import {
  loadStore,
  saveStore,
  type PreferredChannel,
} from "../src/store";

const VALID_CHANNELS: PreferredChannel[] = ["email", "slack"];

const tool: ToolDefinition = {
  description:
    "Set or get the preferred notification channel for the morning brief. Use when the owner says 'send my brief to Slack' or 'email me my brief' or during setup when asking where to deliver. The plugin stores the preference. The assistant handles actual delivery through the connected channel. The assistant skips its own sent messages when scanning email, so sending the brief to Gmail is safe.",
  input_schema: {
    type: "object",
    properties: {
      channel: {
        type: "string",
        enum: VALID_CHANNELS,
        description:
          "The preferred channel for the morning brief. 'email' sends to the owner's connected email (Gmail or Outlook). 'slack' posts to a designated channel or DM. Omit to just check the current preference.",
      },
    },
  },
  defaultRiskLevel: "low",
  execute: async (input: { channel?: string }) => {
    const store = loadStore();

    // If no channel provided, just return current preference
    if (!input.channel) {
      return {
        content: JSON.stringify({
          preferredChannel: store.preferredChannel,
          message: store.preferredChannel
            ? `Briefs are currently sent via ${store.preferredChannel}.`
            : "No channel set yet. Ask the owner where to send the morning brief.",
        }),
      };
    }

    if (!VALID_CHANNELS.includes(input.channel as PreferredChannel)) {
      return {
        content: JSON.stringify({
          error: `Invalid channel. Must be one of: ${VALID_CHANNELS.join(", ")}`,
        }),
        isError: true,
      };
    }

    store.preferredChannel = input.channel as PreferredChannel;
    saveStore(store);

    return {
      content: JSON.stringify({
        preferredChannel: store.preferredChannel,
        updated: true,
        message: `Morning brief will now be delivered via ${store.preferredChannel}.`,
      }),
    };
  },
};

export default tool;
