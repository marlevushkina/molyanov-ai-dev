// ============================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================

function buildColMap(sheet) {
  var headers = sheet.getRange(CONFIG.HEADER_ROW, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = {};
  for (var i = 0; i < headers.length; i++) {
    var header = String(headers[i]).trim();
    var key = HEADER_MAP[header];
    if (key) {
      col[key] = i + 1; // 1-based
    }
  }
  return col;
}

function syncGetSalesToSheet() {
  const flows = getAllFlows();
  if (!flows || flows.length === 0) {
    Logger.log('Не удалось получить кампании из GetSales');
    return;
  }

  const flowMap = buildFlowMap(flows);
  Logger.log('Найдено кампаний в GetSales: ' + Object.keys(flowMap).length);

  let totalUpdated = 0;
  for (const client of CLIENTS) {
    Logger.log('\n=== Клиент: ' + client.name + ' ===');
    const updated = syncClientSheet(client, flowMap);
    totalUpdated += updated;
  }

  Logger.log('\nСинхронизация завершена. Всего обновлено строк: ' + totalUpdated);
}

function syncClientSheet(client, flowMap) {
  let ss;
  try {
    ss = SpreadsheetApp.openById(client.spreadsheetId);
  } catch (e) {
    Logger.log('Не удалось открыть таблицу ' + client.name + ': ' + e.message);
    return 0;
  }

  const sheet = ss.getSheetByName(client.sheetName);
  if (!sheet) {
    Logger.log('Лист "' + client.sheetName + '" не найден в таблице ' + client.name);
    return 0;
  }

  const col = buildColMap(sheet);
  if (!col.HYPOTHESIS_ID || !col.INVITES_SENT) {
    Logger.log('Не удалось определить колонки в ' + client.name + '. Проверьте заголовки.');
    return 0;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < CONFIG.DATA_START_ROW) {
    Logger.log('Нет данных для обновления в ' + client.name);
    return 0;
  }

  const totalCols = sheet.getLastColumn();
  const dataRange = sheet.getRange(CONFIG.DATA_START_ROW, 1, lastRow - CONFIG.DATA_START_ROW + 1, totalCols);
  const data = dataRange.getValues();

  let updatedCount = 0;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const hypothesisId = String(row[col.HYPOTHESIS_ID - 1]).trim();
    const status = String(row[col.STATUS - 1]).trim();

    if (!hypothesisId || SKIP_STATUSES.includes(status)) {
      continue;
    }

    const flow = flowMap[hypothesisId];
    if (!flow) {
      Logger.log('Кампания не найдена для гипотезы: ' + hypothesisId);
      continue;
    }

    const flowVersion = getFlowVersion(flow.flow_version_uuid);
    if (!flowVersion || !flowVersion.nodes) {
      Logger.log('Не удалось получить версию воронки для: ' + hypothesisId);
      continue;
    }

    const nodeMap = classifyNodes(flowVersion.nodes);

    const allNodeIds = flowVersion.nodes.map(function(n) { return n.id; });
    const stats = getFlowNodeStatistics(flow.uuid, allNodeIds);
    if (!stats) {
      Logger.log('Не удалось получить статистику для: ' + hypothesisId);
      continue;
    }

    const metrics = extractMetrics(nodeMap, stats);
    Logger.log(hypothesisId + ': invites=' + metrics.invitesSent + ', connects=' + metrics.connects + ', totalReplies=' + metrics.totalReplies);

    const rowNum = CONFIG.DATA_START_ROW + i;
    writeMetricsToRow(sheet, rowNum, row, metrics, col);
    updatedCount++;
  }

  Logger.log(client.name + ': обновлено строк: ' + updatedCount);
  return updatedCount;
}
