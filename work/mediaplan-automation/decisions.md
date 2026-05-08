# Decisions Log: Mediaplan Automation (GetSales → Sheets)

---

## Task 1-5: Full script implementation

**Status:** Done
**Agent:** Claude Code (main agent)
**Summary:** Создан Google Apps Script из 7 файлов (appsscript.json + 6 .gs). Мульти-клиентская архитектура: один API-ключ GetSales, конфиг CLIENTS с spreadsheetId/sheetName для каждого клиента. Flows забираются один раз за запуск, затем реиспользуются для всех клиентов.
**Deviations:** None

## Task 6: Core spreadsheet transformation

**Status:** Done
**Agent:** Claude Code (main agent)
**Summary:** Трансформированы 22 гипотезы из старого 43-колоночного формата Core в ES-формат (51 колонка). Создан лист "Гипотезы (unified)". CR_KZ_L_1 (Active) перенесён с метриками, 21 Draft-гипотеза — с текстами сообщений.
**Deviations:** None

## Task 7: Script deployment

**Status:** In Progress
**Agent:** Claude Code (main agent)
**Summary:** Первый скрипт создан под smmekalka@gmail.com — недоступен из klevrs.project. Создан новый скрипт-проект (ID: 1w5rYhOoLWls4wZLGPPOwZzz7OJObP06LHPW0Vltgn2O-0SBUvppXfIwx) привязанный к ES-таблице. Код загружен через Apps Script API. Ожидает ручного запуска пользователем для тестирования.
**Deviations:** Планировалось запустить через API (run_script_function) — не сработало (404, ограничение container-bound scripts). Переключились на ручной запуск.

## Решения по ходу разработки

### 1. Один API-ключ на всех клиентов
- **Контекст:** Все кампании (EasyStaff + Core) живут в одном аккаунте GetSales
- **Решение:** Один Bearer token, flows фетчатся один раз
- **Альтернатива:** Отдельные ключи — отклонена, нет необходимости

### 2. Унификация формата таблиц
- **Контекст:** Core использовал 43-колоночный формат, ES — 51-колоночный
- **Решение:** Создать в Core новый лист "Гипотезы (unified)" в формате ES
- **Альтернатива:** Поддерживать два маппинга колонок — отклонена, усложняет код

### 3. Regex маппинг кампаний
- **Контекст:** Короткие ID (UAE-01) и длинные (KZ-SMB-CTO-01)
- **Решение:** buildFlowMap() матчит оба формата через два regex паттерна
- **Альтернатива:** Только exact match — отклонена, не покрывает оба формата

### 4. Container-bound vs standalone script
- **Контекст:** Скрипт изначально планировался как container-bound (привязан к ES-таблице)
- **Решение:** Оставляем container-bound, но при проблемах доступа — альтернатива standalone
- **Проблема:** Скрипт не открывался из-за multi-account конфликта в браузере
