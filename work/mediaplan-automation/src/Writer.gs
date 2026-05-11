// ============================================================
// ЗАПИСЬ В ТАБЛИЦУ
// ============================================================

function isEmptyValue(val) {
  if (!val) return true;
  var s = String(val).trim();
  return s === '' || s === '-' || s === '0';
}

function writeMetricsToRow(sheet, rowNum, existingRow, metrics, col) {
  const msg1 = metrics.messages[0] || { sent: 0, replied: 0 };
  const msg2 = metrics.messages[1] || { sent: 0, replied: 0 };
  const msg3 = metrics.messages[2] || { sent: 0, replied: 0 };

  sheet.getRange(rowNum, col.INVITES_SENT).setValue(metrics.invitesSent);
  sheet.getRange(rowNum, col.CONNECTS).setValue(metrics.connects);
  sheet.getRange(rowNum, col.MSG1_SENT).setValue(msg1.sent);
  sheet.getRange(rowNum, col.MSG1_REPLIES).setValue(msg1.replied);
  sheet.getRange(rowNum, col.MSG2_SENT).setValue(msg2.sent);
  sheet.getRange(rowNum, col.MSG2_REPLIES).setValue(msg2.replied);
  sheet.getRange(rowNum, col.MSG3_SENT).setValue(msg3.sent);
  sheet.getRange(rowNum, col.MSG3_REPLIES).setValue(msg3.replied);

  // Total replies — пишем из API (учитывает все message-ноды, не только msg1/2/3)
  sheet.getRange(rowNum, col.TOTAL_REPLIES).setValue(metrics.totalReplies);

  // CR, Reply Rate, Positive Rate, Lead Rate — формулы в таблице, скрипт НЕ трогает

  handleCheckpoints(sheet, rowNum, existingRow, metrics, col);

  sheet.getRange(rowNum, col.LAST_UPDATE).setValue(
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy')
  );
}

function handleCheckpoints(sheet, rowNum, existingRow, metrics, col) {
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy');

  var date100 = existingRow[col.DATE_100 - 1];
  if (isEmptyValue(date100) && metrics.invitesSent >= 100) {
    sheet.getRange(rowNum, col.DATE_100).setValue(today);
    sheet.getRange(rowNum, col.CONNECTS_100).setValue(metrics.connects);
    sheet.getRange(rowNum, col.REPLIES_100).setValue(metrics.totalReplies);
  }

  var date200 = existingRow[col.DATE_200 - 1];
  if (isEmptyValue(date200) && metrics.invitesSent >= 200) {
    sheet.getRange(rowNum, col.DATE_200).setValue(today);
    sheet.getRange(rowNum, col.CONNECTS_200).setValue(metrics.connects);
    sheet.getRange(rowNum, col.REPLIES_200).setValue(metrics.totalReplies);
  }
}
