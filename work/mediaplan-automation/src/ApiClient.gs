// ============================================================
// РАБОТА С GETSALES API
// ============================================================

function getsalesRequest(method, path, payload) {
  const url = CONFIG.GETSALES_BASE_URL + path;
  const options = {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + CONFIG.GETSALES_API_KEY,
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
  };
  if (payload) {
    options.payload = JSON.stringify(payload);
  }

  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();

  if (code !== 200) {
    Logger.log('API error ' + code + ' for ' + path + ': ' + response.getContentText().substring(0, 300));
    return null;
  }

  return JSON.parse(response.getContentText());
}

function getAllFlows() {
  const result = getsalesRequest('GET', '/flows/api/flows?limit=100&offset=0');
  if (!result) return [];
  return result.data || [];
}

function getFlowVersion(flowVersionUuid) {
  return getsalesRequest('GET', '/flows/api/flow-versions/' + flowVersionUuid);
}

function getFlowNodeStatistics(flowUuid, nodeIds) {
  return getsalesRequest('POST', '/flows/api/flows/' + flowUuid + '/statistics/nodes', {
    node_ids: nodeIds
  });
}

function buildFlowMap(flows) {
  const map = {};
  for (const flow of flows) {
    const name = (flow.name || '').trim();
    map[name] = flow;
    const shortMatch = name.match(/^([A-Z]{2,4}-\d{2})$/);
    if (shortMatch) {
      map[shortMatch[1]] = flow;
    }
    const longMatch = name.match(/^([A-Z]{2,4}(?:-[A-Z]{2,5}){1,3}-\d{2})$/);
    if (longMatch) {
      map[longMatch[1]] = flow;
    }
  }
  return map;
}
