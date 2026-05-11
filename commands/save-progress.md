---
description: |
  Save session progress to LOG.md before ending work.
  Use when: "закругляемся", "заканчиваем", "сохрани прогресс", "save progress",
  "сохрани лог", "конец сессии", "end session", "save-progress"
---

# Save Progress — Session Log Entry

## Step 1: Analyze Session

Review everything done in this session:
- What files were created or modified
- What decisions were made
- What tasks remain incomplete
- What questions are still open

## Step 2: Draft LOG.md Entry

Compose an entry using this format:

```markdown
## YYYY-MM-DD — [Brief description]

**Did:** [1-3 sentences — what was accomplished]
**Decided:** [Key decisions made, if any]
**Artifacts:** [Files created or modified]
**Remaining:** [Unfinished tasks, next steps]
**Open questions:** [If any, otherwise —]
```

Rules:
- Use today's date from the system
- Keep it concise — this is a reference, not a report
- "Remaining" is the most important field — it's what the next session will read first
- If multiple unrelated things were done, use bullet points within fields

## Step 3: Confirm with User

Show the draft entry and ask: "All good? Anything to add or change?"

Wait for confirmation before writing.

## Step 4: Write to LOG.md

1. Read current `LOG.md`
2. Insert the new entry **after the header** (line 3) and **before** existing entries
3. New entries always go on top (reverse chronological order)

If `LOG.md` doesn't exist — create it:
```markdown
# Work Log — {project name from CLAUDE.md or folder name}

Live project history. Newest entries on top.

{new entry here}
```

## Step 5: Archive Check

If LOG.md has more than 20 entries:
1. Create `logs/` directory if it doesn't exist
2. Move entries older than the last 15 to `logs/YYYY-QN.md` (by quarter)
3. Add a line at the bottom of LOG.md: `> Archive: see logs/`
4. Show user what was archived, wait for confirmation

## Step 6: Commit (if git repo)

If the project is a git repository:
```
git add LOG.md
git commit -m "log: session progress {date}"
```

Do NOT push — just commit locally.

## Self-Verification

- [ ] Session analyzed thoroughly
- [ ] Entry drafted and confirmed by user
- [ ] Entry inserted at the top of LOG.md
- [ ] Archive check performed if needed
- [ ] Committed (if git repo)

## Next Step Hint

After progress is saved, always end with:

```
Прогресс сохранён! Когда вернётесь:

  Просто откройте проект — я прочитаю LOG.md и вспомню, где остановились.
  Незавершённые задачи и следующие шаги записаны в лог.
```
