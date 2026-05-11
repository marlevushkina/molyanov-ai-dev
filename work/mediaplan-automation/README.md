# GetSales → Google Sheets Mediaplan Sync

Автоматическая синхронизация метрик LinkedIn-аутрича из GetSales в таблицы медиаплана.

## Архитектура

- **Standalone Google Apps Script** (ID: `1pBqxNoCgnL15hZkE417mVyzNhFBktRKUBtQIrA4KsgGXVe_5U1eJTkFB`)
- **Мульти-клиент**: один API-ключ GetSales, несколько таблиц
- **Динамический маппинг колонок**: скрипт читает заголовки и сам определяет позиции — работает с таблицами разной структуры

## Клиенты

| Клиент | Таблица | Лист |
|---|---|---|
| EasyStaff | `18PmuuSAj9Lj7VwHa1HvGs5uDt0g5QilZKzT0CwUNwe4` | Гипотезы (копия) — тест |
| Core 24/7 | `1MBuXc2d_ueM3tO7uFqGZCD84b2_-ZnyJCxEct3GMI4o` | Гипотезы (unified) |

## Что заполняется автоматически

- Invites sent, Connects
- Msg 1/2/3 sent, Msg 1/2/3 replies (all)
- Total replies (из API, учитывает все message-ноды)
- Checkpoints на 100 и 200 инвайтах (дата, connects, replies)
- Last update

## Что заполняется вручную

- Msg 1/2/3 replies (positive)
- Total positive replies, MQL, Лиды (Calendly)

## Формулы в таблице (скрипт НЕ трогает)

- CR (Connects/Invites)
- Reply Rate (Total replies / Connects)
- Positive Reply Rate (Total positive / Connects)
- Lead Rate (Leads / Invites)

## Файлы

- `Config.gs` — API-ключ, список клиентов, HEADER_MAP для динамического маппинга
- `Main.gs` — buildColMap(), syncGetSalesToSheet(), syncClientSheet()
- `ApiClient.gs` — обёртка GetSales API
- `Parser.gs` — классификация нод, извлечение метрик
- `Writer.gs` — запись в таблицу, checkpoints
- `Triggers.gs` — ежедневный триггер 08:00, debug-функции

## Триггер

Ежедневный запуск в 08:00 (Dubai timezone). Создаётся через `createDailyTrigger()` в Triggers.gs.

## Статус

- Тестирование на тестовых листах — данные верифицированы
- Ожидает проверки аутрич-менеджером перед переключением на продакшн
