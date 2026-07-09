<div align="center">

<img src="hero.png" width="200" alt="SMB Inbox Brief">

# 📬 smb-inbox-brief

**inbox triage for small business. what needs attention today.**

![version](https://img.shields.io/badge/version-0.2.0-blue) ![license](https://img.shields.io/badge/license-MIT-green) ![made for](https://img.shields.io/badge/made%20for-Vellum-8A2BE2)

[What You Get](#what-you-get) • [Requirements](#requirements) • [Install](#install) • [Usage](#usage) • [Surfaces](#surfaces)

</div>

---

Your assistant already reads email. What it can't do out of the box is remember what's in motion, age it, and tell you what's urgent today. SMB Inbox Brief gives your assistant a persistent store for business items found in your inbox, so every morning you get a prioritized brief instead of re-reading everything from scratch.

## What you get

- **A morning brief.** You wake up to a short list of what needs your attention. "Follow up with Henderson, quote is 9 days cold." That's it. No numbers to interpret, just what to do.
- **A watchlist that remembers.** "Log a lead from Sarah, she wants a painting quote." It's tracked. Stays on your list until you say "mark Sarah as done."
- **History you can look back on.** Every morning's brief is saved as a file in your workspace. Open any day to see what was on your plate.
- **Your spreadsheet, if you want it.** Everything syncs to Google Sheets or Excel. Same stuff, in a format you already know. Add your own columns, share it with your accountant.
- **Just talk.** No app to open, no form to fill. Say what happened, say what's done. That's the whole interface.

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
assistant plugins install smb-inbox-brief
```

First run walks you through setup in 4 steps:

```
Hey, I'm your inbox assistant. Every morning I scan your email for business
stuff that needs your attention, new leads, quotes that haven't been
answered, supplier price changes, deliveries coming in. I sort it all
by urgency and send you a short brief so you know what to deal with
today.

Let me get you set up.

Step 1: Do you use Gmail or Outlook for your business email?
  > Gmail

Step 2: Where should I send your morning brief? Email or Slack?
  > Email

Step 3: Do you want everything synced to a spreadsheet too?
        Google Sheets, Excel, or skip?
  > Google Sheets

Step 4: Want me to scan your inbox now and show you what I find?
        I'll look at the last 7 days.
  > Yes

  [scans inbox, logs items, shows sample brief]

  Does this look useful? Want me to run this every morning at 7am?
  > Yes

  Done. I'll scan your inbox every morning at 7am and send you a brief.
  You can change the time anytime, just say "send my brief at 8am instead."
```

## Surfaces

| Surface | What it does |
| --- | --- |
| `log-item` (tool) | Store a new business item extracted from email or entered manually |
| `get-brief` (tool) | Generate the urgency-ranked brief and write the daily markdown file |
| `update-item` (tool) | Change an item's status, priority, or notes |
| `list-items` (tool) | List all items with optional filters by type, status, or date |
| `set-channel` (tool) | Set or check the preferred notification channel for the morning brief |
| `user-prompt-submit` (hook) | Forces onboarding flow on first use, before any other response |
| `smb-inbox-brief` (skill) | The daily triage workflow: scan, log, brief, deliver |

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
INBOX BRIEF - July 8, 2026

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

## License

MIT

