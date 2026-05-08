# Mediaplan Automation: GetSales → Google Sheets

Автоматическое заполнение метрик воронки LinkedIn-аутрича из GetSales API в Google Sheets медиаплан.

## Статус

| Этап | Статус |
|------|--------|
| Код скрипта | ✅ Done |
| Трансформация Core таблицы | ✅ Done |
| Деплой скрипта в Apps Script | ⏳ In Progress |
| Ручное тестирование | ⏳ Ожидает запуска |
| Переименование кампаний в GetSales | 📋 TODO |
| Ежедневный триггер | 📋 TODO |

## Архитектура

```
GetSales API (amazing.getsales.io)
    ↓ Bearer token auth
Google Apps Script (container-bound)
    ↓ SpreadsheetApp.openById()
┌─────────────────┐    ┌─────────────────┐
│ EasyStaff Sheet  │    │ Core 24/7 Sheet │
│ "Гипотезы"       │    │ "Гипотезы (uni)"│
└─────────────────┘    └─────────────────┘
```

## Файлы

| Файл | Назначение |
|------|------------|
| `src/Config.gs` | API key, clients, column mapping |
| `src/Main.gs` | Orchestrator: fetch flows → loop clients |
| `src/ApiClient.gs` | GetSales API wrapper |
| `src/Parser.gs` | Node classification + metrics extraction |
| `src/Writer.gs` | Sheet writing + CR rates + checkpoints |
| `src/Triggers.gs` | Daily trigger + debug functions |

## Ресурсы

- **Apps Script Project ID:** `1w5rYhOoLWls4wZLGPPOwZzz7OJObP06LHPW0Vltgn2O-0SBUvppXfIwx`
- **EasyStaff Spreadsheet:** `1Il40O_qhxnYZyEGk0-ht1fobUnIy7MmpWC8GQGfPDQg`
- **Core Spreadsheet:** `1MBuXc2d_ueM3tO7uFqGZCD84b2_-ZnyJCxEct3GMI4o`
- **GetSales Account:** smmekalka@gmail.com
- **Spreadsheets Owner:** klevrs.project@gmail.com

## Следующие шаги

1. Открыть скрипт из Apps Script Editor (klevrs.project@gmail.com)
2. Запустить `debugFlowMapping()` — проверить маппинг
3. Запустить `syncGetSalesToSheet()` на тестовом листе
4. Переименовать кампании в GetSales по ID гипотез
5. Переключить на основной лист, запустить `createDailyTrigger()`
