// ============================================================
// ЗАПИСЬ В ТАБЛИЦУ
// ============================================================

function writeMetricsToRow(sheet, rowNum, existingRow, metrics) {
  const msg1 = metrics.messages[0] || { sent: 0, replied: 0 };
  const msg2 = metrics.messages[1] || { sent: 0, replied: 0 };
  const msg3 = metrics.messages[2] || { sent: 0, replied: 0 };

  sheet.getRange(rowNum, COL.INVITES_SENT).setValue(metrics.invitesSent);
  sheet.getRange(rowNum, COL.CONNECTS).setValue(metrics.connects);
  sheet.getRange(rowNum, COL.MSG1_SENT).setValue(msg1.sent);
  sheet.getRange(rowNum, COL.MSG1_REPLIES).setValue(msg1.replied);
  sheet.getRange(rowNum, COL.MSG2_SENT).setValue(msg2.sent);
  sheet.getRange(rowNum, COL.MSG2_REPLIES).setValue(msg2.replied);
  sheet.getRange(rowNum, COL.MSG3_SENT).setValue(msg3.sent);
  sheet.getRange(rowNum, COL.MSG3_REPLIES).setValue(msg3.replied);
  sheet.getRange(rowNum, COL.TOTAL_REPLIES).setValue(metrics.totalReplies);

  const invSent = metrics.invitesSent;
  const connects = metrics.connects;
  if (invSent > 0) {
    sheet.getRange(rowNum, COL.CR_CONNECTS).setValue(connects / invSent);
    sheet.getRange(rowNum, COL.REPLY_RATE).setValue(connects > 0 ? metrics.totalReplies / connects : 0);
  }

  const totalPositive = existingRow[COL.TOTAL_POSITIVE - 1] || 0;
  const leads = existingRow[COL.LEADS_CALENDLY - 1] || 0;
  if (connects > 0) {
    sheet.getRange(rowNum, COL.POSITIVE_RATE).setValue(totalPositive / connects);
  }
  if (invSent > 0) {
    sheet.getRange(rowNum, COL.LEAD_RATE).setValue(leads / invSent);
  }

  handleCheckpoints(sheet, rowNum, existingRow, metrics);

  sheet.getRange(rowNum, COL.LAST_UPDATE).setValue(
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy')
  );
}

function handleCheckpoints(sheet, rowNum, existingRow, metrics) {
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy');

  const date100 = existingRow[COL.DATE_100 - 1];
  if (!date100 && metrics.invitesSent >= 100) {
    sheet.getRange(rowNum, COL.DATE_100).setValue(today);
    sheet.getRange(rowNum, COL.CONNECTS_100).setValue(metrics.connects);
    sheet.getRange(rowNum, COL.REPLIES_100).setValue(metrics.totalReplies);
  }

  const date200 = existingRow[COL.DATE_200 - 1];
  if (!date200 && metrics.invitesSent >= 200) {
    sheet.getRange(rowNum, COL.DATE_200).setValue(today);
    sheet.getRange(rowNum, COL.CONNECTS_200).setValue(metrics.connects);
    sheet.getRange(rowNum, COL.REPLIES_200).setValue(metrics.totalReplies);
  }
}
