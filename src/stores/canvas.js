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

  function setNodes(newNodes) {
    nodes.value = newNodes;
  }

  function addNode(node) {
    nodes.value = [...nodes.value, node];
  }

  function setEdges(newEdges) {
    edges.value = newEdges;
  }

  function addEdge(edge) {
    edges.value = [...edges.value, edge];
  }

  function reset(newData) {
    const sourceData = newData || data.value;
    if (sourceData) {
      const transformed = transformData(sourceData);
      nodes.value = transformed.nodes;
      edges.value = transformed.edges;
    }
  }

  function updateNodeData(id, newData) {
    const node = nodes.value.find((n) => n.id === id);
    if (node) {
      node.data = { ...node.data, ...newData };
      nodes.value = [...nodes.value];
    }
  }

  function removeNode(id) {
    nodes.value = nodes.value.filter((n) => n.id !== id);
    edges.value = edges.value.filter((e) => e.source !== id && e.target !== id);
  }

  function removeEdge(id) {
    edges.value = edges.value.filter((e) => e.id !== id);
  }

  function log() {
    console.log({ nodes: nodes.value, edges: edges.value });
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
    setNodes,
    setEdges,
    reset,
    updateNodeData,
    removeNode,
    removeEdge,
    findNodeById,
    addNode,
    addEdge,
    log,
  };
});
