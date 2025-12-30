export const transformData = (rawData) => {
  const nodesById = {};
  const childrenMap = {};
  let rootId = null;

  // 1. Map data for quick access
  rawData.forEach((item) => {
    const id = item.id.toString();
    nodesById[id] = item;
    if (item.parentId === -1) rootId = id;

    // Direct parent relationship
    if (item.parentId && item.parentId !== -1) {
      const pid = item.parentId.toString();
      childrenMap[pid] = childrenMap[pid] || [];
      if (!childrenMap[pid].includes(id)) childrenMap[pid].push(id);
    }

    // Explicit connectors (for dateTime nodes)
    if (item.data?.connectors) {
      childrenMap[id] = childrenMap[id] || [];
      item.data.connectors.forEach((cId) => {
        if (!childrenMap[id].includes(cId.toString()))
          childrenMap[id].push(cId.toString());
      });
    }
  });

  const finalNodes = [];
  const finalEdges = [];
  const levelNextX = {}; // Tracks the next available X for each level to avoid overlaps

  // 2. Recursive function to calculate positions
  const positionNode = (id, level = 0) => {
    const children = childrenMap[id] || [];
    let x;

    if (children.length === 0) {
      // Leaf node: Place at the next available horizontal slot for this level
      x = levelNextX[level] || 0;
      levelNextX[level] = x + 300;
    } else {
      // Internal node: Position children first
      const childPositions = children.map((childId) =>
        positionNode(childId, level + 1)
      );

      // ALIGN MIDDLE: Average of first and last child's X position
      const firstChildX = childPositions[0];
      const lastChildX = childPositions[childPositions.length - 1];
      x = (firstChildX + lastChildX) / 2;

      // Safety check: Ensure parent doesn't overlap with existing nodes at its own level
      const minX = levelNextX[level] || 0;
      if (x < minX) {
        // Shift all children to maintain center alignment
        // (Simplified for this logic: just push the parent to the available slot)
        x = minX;
      }
      levelNextX[level] = Math.max(levelNextX[level] || 0, x + 300);
    }

    // Add Edges
    children.forEach((childId) => {
      finalEdges.push({
        id: `e${id}->${childId}`,
        source: id,
        target: childId,
      });
    });

    // Add Node
    const rawNode = nodesById[id];
    finalNodes.push({
      id,
      type: rawNode.type,
      position: { x, y: level * 150 },
      data: { title: rawNode.name || id, ...rawNode.data },
    });

    return x;
  };

  positionNode(rootId);
  console.log(finalEdges);
  return { nodes: finalNodes, edges: finalEdges };
};
