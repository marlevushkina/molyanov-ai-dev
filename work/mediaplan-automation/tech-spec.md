---
created: 2026-05-07
status: approved
branch: main
size: M
---

# Tech Spec: GetSales → Google Sheets Sync

## Solution

Google Apps Script project (container-bound to EasyStaff spreadsheet) that pulls campaign statistics from GetSales API and writes funnel metrics to Google Sheets media plans. Multi-client support via CLIENTS config array — each client has its own spreadsheetId and sheetName. All spreadsheets use unified ES format (51 columns, A-AY).

Script ID: `1w5rYhOoLWls4wZLGPPOwZzz7OJObP06LHPW0Vltgn2O-0SBUvppXfIwx`

## Architecture

### What we're building

- **Config.gs** — API key, base URL, CLIENTS array, COL mapping, SKIP_STATUSES
- **Main.gs** — Orchestrator: fetches flows once, loops over CLIENTS calling syncClientSheet()
- **ApiClient.gs** — GetSales API wrapper: auth, flows list, flow version, node statistics, flow name matching
- **Parser.gs** — Node classification (invite vs message), ordering by flow graph, metrics extraction
- **Writer.gs** — Writes metrics to sheet row, calculates CR rates, handles 100/200 checkpoints
- **Triggers.gs** — Daily trigger creation, debug functions

### How it works

```
syncGetSalesToSheet()
  → getAllFlows() — GET /flows/api/flows
  → buildFlowMap(flows) — name → flow object, regex matching
  → for each CLIENT:
      → openById(spreadsheetId)
      → getSheetByName(sheetName)
      → for each row (skip Draft/Stop):
          → match hypothesisId → flow
          → getFlowVersion(flow_version_uuid) — GET /flows/api/flow-versions/:uuid
          → classifyNodes(nodes) — separate invite node from message nodes
          → getFlowNodeStatistics(flow_uuid, node_ids) — POST /flows/api/flows/:uuid/statistics/nodes
          → extractMetrics(nodeMap, stats)
          → writeMetricsToRow(sheet, row, metrics)
```

### Shared resources

| Resource | Owner | Consumers | Instance count |
|----------|-------|-----------|----------------|
| GetSales API key | Config.gs | ApiClient.gs | 1 (const) |
| Flow map | Main.gs (syncGetSalesToSheet) | syncClientSheet() | 1 per execution |

## Decisions

### Decision 1: One API key for all clients
**Decision:** Single GetSales API key shared across all clients
**Rationale:** All campaigns live in one GetSales account (smmekalka@gmail.com)
**Alternatives considered:** Separate API keys per client — rejected, unnecessary complexity

### Decision 2: Unified spreadsheet format
**Decision:** All client spreadsheets use ES format (51 columns)
**Rationale:** One COL mapping works for all clients. Core spreadsheet was transformed from old 43-column format to match.
**Alternatives considered:** Per-client COL mapping — rejected, error-prone and harder to maintain

### Decision 3: Regex-based campaign matching
**Decision:** buildFlowMap() matches both short IDs (UAE-01) and long IDs (KZ-SMB-CTO-01) via regex
**Rationale:** Different clients use different ID formats. Exact match + regex fallback covers both.

### Decision 4: Script calculates CR rates (not formulas)
**Decision:** CR metrics computed in Writer.gs, not as spreadsheet formulas
**Rationale:** Formulas break when users manually edit cells. Script-driven values are more reliable.

## Data Models

### GetSales API response structures

**Flow object:** `{ uuid, name, status, flow_version_uuid }`

**Flow version:** `{ nodes: [{ id, type, before, after }] }`
- Node types: `linkedin_send_connection_request`, `linkedin_send_message`

**Node statistics:** `{ "<node_id>": { node_statuses: { closed, in_progress }, node_conversions: { accepted, replied } } }`

### Spreadsheet column mapping (1-based)

| Column | Index | Field | Auto/Manual |
|--------|-------|-------|-------------|
| B | 2 | Hypothesis ID | Manual |
| D | 4 | Status | Manual |
| N | 14 | Invites planned | Manual |
| O | 15 | Start date | Manual |
| P-T | 16-20 | Checkpoint 100 | Auto (date, connects, replies) + Manual (positive, leads) |
| U-Y | 21-25 | Checkpoint 200 | Auto + Manual |
| Z | 26 | Invites sent | Auto |
| AA | 27 | Connects | Auto |
| AB-AJ | 28-36 | Msg 1-3 sent/replies/positive | Auto (sent, replies) + Manual (positive) |
| AK | 37 | Total replies | Auto |
| AL | 38 | Total positive | Manual |
| AM | 39 | MQL | Manual |
| AN | 40 | Leads Calendly | Manual |
| AO-AR | 41-44 | CR metrics | Auto |
| AX | 50 | Last update | Auto |

## Dependencies

### Built-in (Google Apps Script)
- `SpreadsheetApp` — read/write Google Sheets
- `UrlFetchApp` — HTTP requests to GetSales API
- `ScriptApp` — trigger management
- `Utilities` — date formatting
- `Logger` — logging

### External APIs
- GetSales API — `https://amazing.getsales.io` — Bearer token auth

## Testing Strategy

**Feature size:** M

### Debug functions (manual testing)
- `debugGetSalesResponse()` — API connectivity + response format verification
- `debugFlowMapping()` — hypothesis → campaign matching across all clients
- `syncGetSalesToSheet()` with test sheet ("Гипотезы (копия)") — full end-to-end with safe rollback

## Risks

| Risk | Mitigation |
|------|------------|
| Apps Script 6-min execution limit | Flows fetched once, reused for all clients. Batch reads. |
| GetSales API changes | Debug functions for quick diagnosis. API responses logged. |
| Wrong Google account context | New script created under klevrs.project@gmail.com |
| Campaign names don't match hypothesis IDs | Regex matching + debug function to verify mapping |

## User-Spec Deviations

None

## Acceptance Criteria

- [ ] GetSales API returns flow list with correct auth
- [ ] Flow map correctly matches hypothesis IDs to campaigns
- [ ] Metrics extracted from node_statuses and node_conversions
- [ ] Message nodes ordered by flow graph topology
- [ ] Spreadsheet cells updated only for auto-fill columns
- [ ] Checkpoints are one-time captures (don't overwrite)
- [ ] Daily trigger fires at 08:00 Asia/Dubai
- [ ] Both client spreadsheets accessible via openById()

## Implementation Tasks

### Wave 1 (независимые)

#### Task 1: Config + API Client
- **Description:** Config.gs с credentials и маппингом колонок. ApiClient.gs с обёрткой GetSales API (auth, flows, flow versions, node statistics, flow map builder).
- **Status:** Done
- **Files:** Config.gs, ApiClient.gs

#### Task 2: Parser (node classification + metrics extraction)
- **Description:** Parser.gs — классификация нод (invite vs message), топологическая сортировка message nodes по flow graph, извлечение метрик из статистики.
- **Status:** Done
- **Files:** Parser.gs

#### Task 3: Writer (spreadsheet output + checkpoints)
- **Description:** Writer.gs — запись метрик в строку, расчёт CR rates, обработка checkpoints 100/200.
- **Status:** Done
- **Files:** Writer.gs

### Wave 2 (зависит от Wave 1)

#### Task 4: Main orchestrator + multi-client
- **Description:** Main.gs — syncGetSalesToSheet() получает flows один раз, итерирует CLIENTS, вызывает syncClientSheet() для каждого.
- **Status:** Done
- **Files:** Main.gs

#### Task 5: Triggers + debug functions
- **Description:** Triggers.gs — createDailyTrigger(), debugGetSalesResponse(), debugFlowMapping() для отладки.
- **Status:** Done
- **Files:** Triggers.gs

### Wave 3 (зависит от Wave 2)

#### Task 6: Core spreadsheet data transformation
- **Description:** Трансформация 22 гипотез из старого 43-колоночного формата Core в формат ES (51 колонка). Создан лист "Гипотезы (unified)".
- **Status:** Done

#### Task 7: Script deployment + manual testing
- **Description:** Запуск debugFlowMapping() и syncGetSalesToSheet() на тестовом листе. Создание ежедневного триггера.
- **Status:** In Progress — скрипт загружен, ожидает ручного запуска пользователем

#### Task 8: Campaign renaming in GetSales
- **Description:** Переименование кампаний из старого формата (ES_UAE_T_1) в ID гипотез (UAE-01, KZ-SMB-CTO-01).
- **Status:** TODO — на стороне пользователя
