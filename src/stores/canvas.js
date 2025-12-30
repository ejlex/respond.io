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
      fetch("/api/candidate-assessments/payload.json")
        .then((response) => response.json())
        .catch((error) => console.error(error)),
  });

  function setNodes(newNodes) {
    nodes.value = newNodes;
  }

  function setEdges(newEdges) {
    edges.value = newEdges;
  }

  function reset(newData) {
    const sourceData = newData || data.value;
    if (sourceData) {
      const transformed = transformData(sourceData);
      nodes.value = transformed.nodes;
      edges.value = transformed.edges;
    }
  }

  watch(data, (newData) => {
    if (newData) {
      reset(newData);
    }
  });

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    reset,
  };
});
