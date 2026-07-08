import type { PluginHookFn } from "@vellumai/plugin-api";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const STORAGE_DIR = process.env.VELLUM_WORKSPACE_DIR
  ? join(process.env.VELLUM_WORKSPACE_DIR, "plugins", "smb-inbox-brief", "data")
  : join(process.cwd(), "plugins-data", "smb-inbox-brief");

const STORE_FILE = join(STORAGE_DIR, "items.json");

const ONBOARDING_INSTRUCTION = `[Plugin: SMB Inbox Brief] Onboarding has NOT been completed yet — the owner just installed this plugin but hasn't set up their preferences. You MUST run the onboarding flow from the smb-inbox-brief skill BEFORE doing anything else. Start by explaining what the plugin does in one or two plain-English sentences, then walk them through the setup steps in order: (1) email provider, (2) brief delivery channel, (3) optional spreadsheet, (4) first scan. Wait for each answer before moving on. Do NOT list tool names. Do NOT ask open-ended questions like "want me to help configure?" Just start the flow.`;

const onUserPromptSubmit: PluginHookFn = async (ctx) => {
  if (ctx.isNonInteractive) return;

  // Check if onboarding is complete (preferredChannel is set)
  let needsOnboarding = false;
  try {
    if (!existsSync(STORE_FILE)) {
      needsOnboarding = true;
    } else {
      const raw = readFileSync(STORE_FILE, "utf-8");
      const store = JSON.parse(raw);
      if (!store.preferredChannel) {
        needsOnboarding = true;
      }
    }
  } catch {
    needsOnboarding = true;
  }

  if (!needsOnboarding) return;

  // Inject a system instruction at the front of the working message list
  // so the assistant runs onboarding before responding to anything else.
  ctx.latestMessages.unshift({
    role: "system",
    content: ONBOARDING_INSTRUCTION,
  });
};

export default onUserPromptSubmit;
