import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { transformData } from "../../helper";

export const useCanvasStore = defineStore("canvas", () => {
  const nodes = ref([]);
  const edges = ref([]);

  const { data } = useQuery({
    queryKey: ["assessments"],
    queryFn: () =>
      fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/candidate-assessments/payload.json"
      )
        .then((response) => response.json())
        .catch((error) => console.error(error)),
  });

  // History Management
  const history = ref([]);
  const historyIndex = ref(-1);

  function addToHistory() {
    // Remove any future history if we are in the middle of the stack
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }

    // Create a snapshot
    const snapshot = {
      nodes: JSON.parse(JSON.stringify(nodes.value)),
      edges: JSON.parse(JSON.stringify(edges.value)),
    };

    history.value.push(snapshot);
    historyIndex.value++;
  }

  function undo() {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      const snapshot = history.value[historyIndex.value];
      nodes.value = JSON.parse(JSON.stringify(snapshot.nodes));
      edges.value = JSON.parse(JSON.stringify(snapshot.edges));
    }
  }

  function redo() {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++;
      const snapshot = history.value[historyIndex.value];
      nodes.value = JSON.parse(JSON.stringify(snapshot.nodes));
      edges.value = JSON.parse(JSON.stringify(snapshot.edges));
    }
  }

  function addNode(node) {
    nodes.value = [...nodes.value, node];
    addToHistory();
  }

  function addEdge(edge) {
    edges.value = [
      ...edges.value,
      {
        id: `e${edge.source}->${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
      },
    ];
    addToHistory();
  }

  function reset(newData) {
    const sourceData = newData || data.value;
    if (sourceData) {
      const transformed = transformData(sourceData);
      nodes.value = transformed.nodes;
      edges.value = transformed.edges;

      // Reset history
      history.value = [];
      historyIndex.value = -1;
      addToHistory();
    }
  }

  function updateNodeData(id, newData) {
    const node = nodes.value.find((n) => n.id === id);
    if (node) {
      node.data = { ...node.data, ...newData };
      nodes.value = [...nodes.value];
      addToHistory();
    }
  }

  function removeNode(id) {
    nodes.value = nodes.value.filter((n) => n.id !== id);
    edges.value = edges.value.filter((e) => e.source !== id && e.target !== id);
    addToHistory();
  }

  function removeEdge(id) {
    edges.value = edges.value.filter((e) => e.id !== id);
    addToHistory();
  }

  function updateNodePosition(id, position) {
    const node = nodes.value.find((n) => n.id === id);
    if (node) {
      node.position = { ...position };
    }
  }

  function log() {
    console.log({
      nodes: nodes.value,
      edges: edges.value,
      history: history.value,
      index: historyIndex.value,
    });
  }

  watch(data, (newData) => {
    if (newData) {
      reset(newData);
    }
  });

  function findNodeById(id) {
    return nodes.value.find((n) => n.id === id);
  }

  return {
    nodes,
    edges,
    reset,
    updateNodeData,
    removeNode,
    removeEdge,
    findNodeById,
    addNode,
    addEdge,
    log,
    undo,
    redo,
    addToHistory,
    historyIndex,
    history,
    updateNodePosition,
  };
});
