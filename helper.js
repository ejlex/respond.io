export const transformData = (rawData) => {
  const nodesById = {};
  const childrenMap = {};
  let rootId = null;

  // 1. Map data & identify root
  rawData.forEach((item) => {
    const id = item.id.toString();
    nodesById[id] = item;
    if (item.parentId === -1 || item.parentId === null) rootId = id;

    if (item.parentId && item.parentId !== -1) {
      const pid = item.parentId.toString();
      childrenMap[pid] = childrenMap[pid] || [];
      if (!childrenMap[pid].includes(id)) childrenMap[pid].push(id);
    }

    // Support for explicit connectors/dateTime nodes
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
  const levelNextX = {}; // Prevents different branches from overlapping

  const positionNode = (id, level = 0, preferredX = 0) => {
    const children = childrenMap[id] || [];

    // 2. Logic: Attempt to use the preferredX (from parent),
    // but ensure we don't overlap existing nodes at this depth.
    let x = Math.max(preferredX, levelNextX[level] || 0);

    // 3. Commit this position to the tracker for this level
    levelNextX[level] = x + 350; // 400px spacing for clarity

    // 4. Place Node & Edges
    const rawNode = nodesById[id];
    finalNodes.push({
      id,
      type: rawNode.type,
      position: { x, y: level * 180 },
      data: { title: rawNode.name, ...rawNode.data },
    });

    // 5. Recursive child placement
    if (children.length === 1) {
      // SINGLE CHILD: Force the child to use the exact same X as this parent
      positionNode(children[0], level + 1, x);
    } else if (children.length > 1) {
      // MULTIPLE CHILDREN: Spread them out centered under the parent
      const totalWidth = (children.length - 1) * 350;
      const startX = x - totalWidth / 2;

      children.forEach((childId, index) => {
        const childTargetX = startX + index * 350;
        positionNode(childId, level + 1, childTargetX);
      });
    }

    children.forEach((childId) => {
      finalEdges.push({
        id: `e${id}->${childId}`,
        source: id,
        target: childId,
        type: "smoothstep",
      });
    });
  };

  if (rootId) positionNode(rootId, 0, 350); // Start root at a comfortable X
  return { nodes: finalNodes, edges: finalEdges };
};
