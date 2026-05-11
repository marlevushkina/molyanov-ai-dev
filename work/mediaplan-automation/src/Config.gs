// ============================================================
// КОНФИГУРАЦИЯ
// ============================================================

const CONFIG = {
  GETSALES_API_KEY: '<REDACTED>',
  GETSALES_BASE_URL: 'https://amazing.getsales.io',
  HEADER_ROW: 2,
  DATA_START_ROW: 3,
};

const CLIENTS = [
  {
    name: 'EasyStaff',
    spreadsheetId: '18PmuuSAj9Lj7VwHa1HvGs5uDt0g5QilZKzT0CwUNwe4',
    sheetName: 'Гипотезы (копия)',
  },
  {
    name: 'Core 24/7',
    spreadsheetId: '1MBuXc2d_ueM3tO7uFqGZCD84b2_-ZnyJCxEct3GMI4o',
    sheetName: 'Гипотезы (unified)',
  },
];

// Маппинг названий заголовков → ключи COL
const HEADER_MAP = {
  'ID гипотезы': 'HYPOTHESIS_ID',
  'Статус': 'STATUS',
  'Invites planned': 'INVITES_PLANNED',
  'Дата старта': 'START_DATE',
  'Дата 100': 'DATE_100',
  'Connects 100': 'CONNECTS_100',
  'Replies 100': 'REPLIES_100',
  'Positive 100': 'POSITIVE_100',
  'Лиды 100': 'LEADS_100',
  'Дата 200': 'DATE_200',
  'Connects 200': 'CONNECTS_200',
  'Replies 200': 'REPLIES_200',
  'Positive 200': 'POSITIVE_200',
  'Лиды 200': 'LEADS_200',
  'Invites sent (факт)': 'INVITES_SENT',
  'Connects': 'CONNECTS',
  'Msg 1 sent': 'MSG1_SENT',
  'Msg 1 replies (all)': 'MSG1_REPLIES',
  'Msg 1 replies (positive)': 'MSG1_POSITIVE',
  'Msg 2 sent': 'MSG2_SENT',
  'Msg 2 replies (all)': 'MSG2_REPLIES',
  'Msg 2 replies (positive)': 'MSG2_POSITIVE',
  'Msg 3 sent': 'MSG3_SENT',
  'Msg 3 replies (all)': 'MSG3_REPLIES',
  'Msg 3 replies (positive)': 'MSG3_POSITIVE',
  'Total replies': 'TOTAL_REPLIES',
  'Total positive replies': 'TOTAL_POSITIVE',
  'MQL count': 'MQL',
  'Лиды (Calendly)': 'LEADS_CALENDLY',
  'CR (Connects/Invites)': 'CR_CONNECTS',
  'Reply Rate (Replies/Connects)': 'REPLY_RATE',
  'Positive Reply Rate': 'POSITIVE_RATE',
  'Lead Rate (Leads/Invites)': 'LEAD_RATE',
  'Last update': 'LAST_UPDATE',
};

const SKIP_STATUSES = ['Stop', 'Draft'];
