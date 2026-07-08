<div align="center">

# 📬 inbox-ea

**inbox triage for small business. what needs attention today.**

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

## Example

Mike owns a painting company. Gmail connected. Every morning at 7am, the assistant scans his inbox, logs new items, and delivers the brief.

### Morning Brief (delivered to email or Slack)

```
INBOX EA - July 8, 2026

OVERDUE
  [URGENT] Exterior repaint quote - Mike & Sarah Chen
    7d ago, due Jul 5, $12,500, no response

AGING
  [HIGH] Living room start date? - Jennifer Patel
    9d ago, customer waiting on reply

NEW TODAY
  [HIGH] Kitchen repaint - Tom Reyes (wants quote by Fri)
  [NORMAL] Deck staining - Robert Kim (saw our truck)

DUE THIS WEEK
  [NORMAL] SW price increase Jul 15 - stock up now
  [NORMAL] Color consult Tue 2pm - Linda Morris
  [LOW] Primer delivery Wed - 20 gal ProMar 200

WATCHLIST
  [LOW] 5-star review from Henderson - ask for testimonial
```

### Google Sheet View (synced automatically)

```
+------------+------------------------------------------+-------------------+--------+--------+--------+----------+
| Type       | Subject                                  | Counterparty      | Age    | Due    | Status | Priority |
+------------+------------------------------------------+-------------------+--------+--------+--------+----------+
| Quote      | Exterior repaint - 2 story colonial      | Mike & Sarah Chen | 7d ago | Jul 5  | new    | urgent   |
| Follow-up  | Living room job - when can you start?    | Jennifer Patel    | 9d ago | -      | new    | high     |
| Lead       | Kitchen repaint quote request             | Tom Reyes         | today  | Jul 12 | new    | high     |
| Lead       | Deck staining inquiry - saw our truck     | Robert Kim        | today  | -      | new    | normal   |
| Supplier   | SW price increase July 15                 | SW Supply Co      | today  | Jul 15 | new    | normal   |
| Appt       | Color consultation Tuesday 2pm            | Linda Morris      | today  | Jul 9  | new    | normal   |
| Delivery   | Primer delivery arriving Wednesday        | Sherwin-Williams  | today  | Jul 10 | new    | low      |
| Alert      | Google review from Henderson job          | Dave Henderson    | 1d ago | -      | new    | low      |
+------------+------------------------------------------+-------------------+--------+--------+--------+----------+
```

### A day in the life

```
7:00 AM  Assistant scans Gmail since last run
         |  Finds 4 new business emails
         v
7:01 AM  Logs items: 2 leads, 1 supplier change, 1 delivery
         |  Calls get-brief
         v
7:02 AM  Brief delivered to Mike's email
         |  Assistant skips its own sent message
         v
9:30 AM  Mike reads brief, says "mark Chen quote as in_progress"
         |  update-item called, status updated
         v
2:00 PM  Mike finishes a job, says "log a job, painted 3 rooms
         |  at 123 Main St for Henderson, $4,500, done"
         v
2:01 PM  log-item called, item stored
         |  If Google Sheet connected, row synced
         v
Next AM  Assistant scans again, only new emails
         |  Chen quote still in_progress, shows in aging
         |  Henderson job marked done, off the watchlist
```

## License

MIT
