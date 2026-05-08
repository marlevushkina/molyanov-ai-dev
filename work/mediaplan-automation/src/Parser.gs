// ============================================================
// КЛАССИФИКАЦИЯ НОД И ИЗВЛЕЧЕНИЕ МЕТРИК
// ============================================================

function classifyNodes(nodes) {
  const result = {
    inviteNodeId: null,
    messageNodeIds: [],
  };

  const sorted = nodes.slice().sort(function(a, b) { return a.id - b.id; });

  for (const node of sorted) {
    switch (node.type) {
      case 'linkedin_send_connection_request':
        result.inviteNodeId = node.id;
        break;
      case 'linkedin_send_message':
        result.messageNodeIds.push(node.id);
        break;
    }
  }

  result.messageNodeIds = sortMessageNodes(nodes, result.messageNodeIds);

  return result;
}

function sortMessageNodes(allNodes, messageIds) {
  if (messageIds.length <= 1) return messageIds;

  const nextMap = {};
  for (const node of allNodes) {
    if (node.after && node.after.length > 0) {
      for (const link of node.after) {
        if (messageIds.includes(link.node_id)) {
          nextMap[node.id] = link.node_id;
        }
      }
    }
  }

  const messageSet = new Set(messageIds);
  let firstId = null;
  for (const id of messageIds) {
    const node = allNodes.find(function(n) { return n.id === id; });
    const hasMsgBefore = node.before && node.before.some(function(b) { return messageSet.has(b.node_id); });
    if (!hasMsgBefore) {
      firstId = id;
      break;
    }
  }

  if (!firstId) return messageIds;

  const ordered = [firstId];
  let current = firstId;
  const visited = new Set([firstId]);
  while (true) {
    const node = allNodes.find(function(n) { return n.id === current; });
    if (!node || !node.after) break;
    let nextMsgId = null;
    for (const link of node.after) {
      if (messageSet.has(link.node_id) && !visited.has(link.node_id)) {
        nextMsgId = link.node_id;
        break;
      }
    }
    if (!nextMsgId) break;
    ordered.push(nextMsgId);
    visited.add(nextMsgId);
    current = nextMsgId;
  }

  for (const id of messageIds) {
    if (!visited.has(id)) {
      ordered.push(id);
    }
  }

  return ordered;
}

function extractMetrics(nodeMap, stats) {
  const metrics = {
    invitesSent: 0,
    connects: 0,
    messages: [],
    totalReplies: 0,
  };

  if (nodeMap.inviteNodeId) {
    const inviteStats = stats[String(nodeMap.inviteNodeId)];
    if (inviteStats) {
      metrics.invitesSent = sumStatuses(inviteStats.node_statuses);
      metrics.connects = getConversion(inviteStats.node_conversions, 'accepted');
    }
  }

  for (const msgNodeId of nodeMap.messageNodeIds) {
    const msgStats = stats[String(msgNodeId)];
    if (msgStats) {
      const sent = sumStatuses(msgStats.node_statuses);
      const replied = getConversion(msgStats.node_conversions, 'replied');
      metrics.messages.push({ sent: sent, replied: replied });
      metrics.totalReplies += replied;
    } else {
      metrics.messages.push({ sent: 0, replied: 0 });
    }
  }

  return metrics;
}

function sumStatuses(statuses) {
  if (!statuses || Array.isArray(statuses)) return 0;
  return (statuses.closed || 0) + (statuses.in_progress || 0);
}

function getConversion(conversions, key) {
  if (!conversions || Array.isArray(conversions)) return 0;
  return conversions[key] || 0;
}
