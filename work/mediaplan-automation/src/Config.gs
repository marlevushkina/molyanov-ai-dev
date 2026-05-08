// ============================================================
// КОНФИГУРАЦИЯ
// ============================================================

const CONFIG = {
  GETSALES_API_KEY: 'YOUR_API_KEY_HERE', // Set in Apps Script project
  GETSALES_BASE_URL: 'https://amazing.getsales.io',
  HEADER_ROW: 2,
  DATA_START_ROW: 3,
};

const CLIENTS = [
  {
    name: 'EasyStaff',
    spreadsheetId: '1Il40O_qhxnYZyEGk0-ht1fobUnIy7MmpWC8GQGfPDQg',
    sheetName: 'Гипотезы',
  },
  {
    name: 'Core 24/7',
    spreadsheetId: '1MBuXc2d_ueM3tO7uFqGZCD84b2_-ZnyJCxEct3GMI4o',
    sheetName: 'Гипотезы (unified)',
  },
];

const COL = {
  HYPOTHESIS_ID: 2,
  STATUS: 4,
  INVITES_PLANNED: 14,
  START_DATE: 15,
  DATE_100: 16,
  CONNECTS_100: 17,
  REPLIES_100: 18,
  POSITIVE_100: 19,
  LEADS_100: 20,
  DATE_200: 21,
  CONNECTS_200: 22,
  REPLIES_200: 23,
  POSITIVE_200: 24,
  LEADS_200: 25,
  INVITES_SENT: 26,
  CONNECTS: 27,
  MSG1_SENT: 28,
  MSG1_REPLIES: 29,
  MSG1_POSITIVE: 30,
  MSG2_SENT: 31,
  MSG2_REPLIES: 32,
  MSG2_POSITIVE: 33,
  MSG3_SENT: 34,
  MSG3_REPLIES: 35,
  MSG3_POSITIVE: 36,
  TOTAL_REPLIES: 37,
  TOTAL_POSITIVE: 38,
  MQL: 39,
  LEADS_CALENDLY: 40,
  CR_CONNECTS: 41,
  REPLY_RATE: 42,
  POSITIVE_RATE: 43,
  LEAD_RATE: 44,
  LAST_UPDATE: 50,
};

const SKIP_STATUSES = ['Stop', 'Draft'];
