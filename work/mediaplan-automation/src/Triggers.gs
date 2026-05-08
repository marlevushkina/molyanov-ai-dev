// ============================================================
// ТРИГГЕР + ОТЛАДКА
// ============================================================

function createDailyTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'syncGetSalesToSheet') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  ScriptApp.newTrigger('syncGetSalesToSheet')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  Logger.log('Ежедневный триггер создан: syncGetSalesToSheet в 08:00');
}

function debugGetSalesResponse() {
  Logger.log('=== Тест подключения к GetSales ===');

  var flows = getAllFlows();
  if (!flows || flows.length === 0) {
    Logger.log('ОШИБКА: Не удалось получить кампании. Проверьте API-ключ.');
    return;
  }

  Logger.log('Найдено кампаний: ' + flows.length);
  for (var f = 0; f < flows.length; f++) {
    Logger.log('  ' + flows[f].name + ' (status: ' + flows[f].status + ', uuid: ' + flows[f].uuid + ')');
  }

  var activeFlow = null;
  for (var i = 0; i < flows.length; i++) {
    if (flows[i].status === 'on') {
      activeFlow = flows[i];
      break;
    }
  }
  if (!activeFlow) activeFlow = flows[0];

  Logger.log('\nДетали для: ' + activeFlow.name);

  var version = getFlowVersion(activeFlow.flow_version_uuid);
  if (!version) {
    Logger.log('Не удалось получить flow version');
    return;
  }

  Logger.log('Ноды:');
  for (var j = 0; j < version.nodes.length; j++) {
    var n = version.nodes[j];
    Logger.log('  id=' + n.id + ' type=' + n.type);
  }

  var nodeMap = classifyNodes(version.nodes);
  Logger.log('\nInvite node: ' + nodeMap.inviteNodeId);
  Logger.log('Message nodes: ' + JSON.stringify(nodeMap.messageNodeIds));

  var allNodeIds = version.nodes.map(function(n) { return n.id; });
  var stats = getFlowNodeStatistics(activeFlow.uuid, allNodeIds);
  Logger.log('\nСтатистика: ' + JSON.stringify(stats, null, 2));

  var metrics = extractMetrics(nodeMap, stats);
  Logger.log('\nИтоговые метрики:');
  Logger.log('  Invites sent: ' + metrics.invitesSent);
  Logger.log('  Connects: ' + metrics.connects);
  Logger.log('  Total replies: ' + metrics.totalReplies);
  for (var m = 0; m < metrics.messages.length; m++) {
    Logger.log('  Msg ' + (m + 1) + ': sent=' + metrics.messages[m].sent + ', replied=' + metrics.messages[m].replied);
  }
}

function debugFlowMapping() {
  Logger.log('=== Маппинг кампаний по всем клиентам ===');

  var flows = getAllFlows();
  var flowMap = buildFlowMap(flows);

  Logger.log('\nКампании в GetSales:');
  for (var f = 0; f < flows.length; f++) {
    Logger.log('  ' + flows[f].name + ' (status: ' + flows[f].status + ')');
  }

  for (var c = 0; c < CLIENTS.length; c++) {
    var client = CLIENTS[c];
    Logger.log('\n--- ' + client.name + ' ---');

    var ss;
    try {
      ss = SpreadsheetApp.openById(client.spreadsheetId);
    } catch (e) {
      Logger.log('Не удалось открыть таблицу: ' + e.message);
      continue;
    }

    var sheet = ss.getSheetByName(client.sheetName);
    if (!sheet) {
      Logger.log('Лист "' + client.sheetName + '" не найден');
      continue;
    }

    var lastRow = sheet.getLastRow();
    if (lastRow < CONFIG.DATA_START_ROW) {
      Logger.log('Нет данных');
      continue;
    }

    var ids = sheet.getRange(CONFIG.DATA_START_ROW, COL.HYPOTHESIS_ID, lastRow - CONFIG.DATA_START_ROW + 1, 1).getValues();
    var statuses = sheet.getRange(CONFIG.DATA_START_ROW, COL.STATUS, lastRow - CONFIG.DATA_START_ROW + 1, 1).getValues();

    for (var i = 0; i < ids.length; i++) {
      var hypothesisId = String(ids[i][0]).trim();
      var status = String(statuses[i][0]).trim();
      if (!hypothesisId) continue;
      var flow = flowMap[hypothesisId];
      var skip = SKIP_STATUSES.includes(status) ? ' [SKIP: ' + status + ']' : '';
      Logger.log(hypothesisId + ' → ' + (flow ? flow.name + ' (' + flow.status + ')' : 'НЕ НАЙДЕНА') + skip);
    }
  }
}
