---
description: Decompose approved tech-spec into tasks with validation
allowed-tools:
  - Skill
---

# Instructions

Use the `task-decomposition` skill.

## Next Step Hint

After tasks are created and validated, always end with:

```
Задачи созданы! Вот что дальше:

  /do-feature {path}  — выполнить ВСЕ задачи автономно (Agent Team, можно уйти)
  /do-task {path}     — выполнить одну задачу за раз (с ревью)

Задачи лежат в work/{feature}/tasks/ — можете посмотреть перед запуском.
Совет: /do-feature подходит когда задач много. /do-task — когда хотите контролировать каждый шаг.
```
