<div align="center">

# 📬 inbox-ea

**your inbox, triaged. every morning, what needs attention.**

![version](https://img.shields.io/badge/version-0.1.0-blue) ![license](https://img.shields.io/badge/license-MIT-green) ![made for](https://img.shields.io/badge/made%20for-Vellum-8A2BE2)

[What You Get](#what-you-get) • [Requirements](#requirements) • [Install](#install) • [Usage](#usage) • [Surfaces](#surfaces)

</div>

---

Your assistant already reads email. What it can't do out of the box is remember what's in motion, age it, and tell you what's urgent today. Inbox EA gives your assistant a persistent store for business items found in your inbox, so every morning you get a prioritized brief instead of re-reading everything from scratch.

## What you get

- **A morning brief**, delivered every day with urgency-ranked actions. Overdue items first, then aging quotes and follow-ups, then what's new today.
- **A persistent watchlist** that grows with your inbox. Items stay until you mark them done or ignored.
- **Daily markdown history** written to your workspace. Every brief is archived as a readable file you can open anytime.
- **Spreadsheet sync** (optional). Items mirror to Google Sheets or Microsoft Excel so you can see everything in a format you already know.
- **In-chat logging**. Say "log a new lead from Sarah" and it's tracked. No app to open, no form to fill.

## Scheduled jobs

Once set up, the assistant acts on its own every morning:

| When | What happens |
| --- | --- |
| Every morning (configurable) | Assistant scans email since last run, logs new business items, generates and delivers the urgency-ranked brief |

What it will never do on its own: send emails, spend money, or sync to spreadsheets without being asked.

## Requirements

- **Gmail or Outlook**: the assistant reads your email to find business items. One must be connected.
- **Email or Slack**: where the morning brief gets delivered. Pick one at setup. Email is the default.
- **Google Sheets or Microsoft Excel** (optional): if you want items synced to a spreadsheet. The brief works without this.

## Install

```
assistant plugins install inbox-ea
```

First use: the assistant scans your recent email, shows you what it found, and asks you to confirm before the first brief goes out.

## Surfaces

| Surface | What it does |
| --- | --- |
| `log-item` (tool) | Store a new business item extracted from email or entered manually |
| `get-brief` (tool) | Generate the urgency-ranked brief and write the daily markdown file |
| `update-item` (tool) | Change an item's status, priority, or notes |
| `list-items` (tool) | List all items with optional filters by type, status, or date |
| `set-channel` (tool) | Set or check the preferred notification channel for the morning brief |
| `inbox-ea` (skill) | The daily triage workflow: scan, log, brief, deliver |

## Usage

- "scan my inbox and give me my brief"
- "log a new lead from Sarah, she wants a painting quote"
- "mark the Henderson quote as done"
- "show me my watchlist"
- "what needs my attention today"
- "ignore that supplier email about price changes"

## License

MIT
