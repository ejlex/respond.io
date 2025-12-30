<script setup>
import { ref, watch } from "vue";
import { VueFlow } from "@vue-flow/core";
import { useQuery } from "@tanstack/vue-query";
import SpecialNode from "./SpecialNode.vue";
// import SpecialEdge from "./SpecialEdge.vue";
import TriggerNode from "./Node/TriggerNode.vue";
import { transformData } from "../../helper";

const nodes = ref([]);
const edges = ref([]);

const { data } = useQuery({
  queryKey: ["assessments"],
  queryFn: () =>
    fetch("/api/candidate-assessments/payload.json")
      .then((response) => response.json())
      .catch((error) => console.error(error)),
});

watch(data, () => {
  nodes.value = transformData(data.value).nodes;
  edges.value = transformData(data.value).edges;
});
</script>

<template>
  <div class="flow-container">
    <VueFlow :nodes="nodes" :edges="edges">
      <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
      <template #node-trigger="triggerNodeProps">
        <TriggerNode v-bind="triggerNodeProps" />
      </template>
      <template #node-dateTime="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" />
      </template>
      <template #node-dateTimeConnector="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" />
      </template>
      <template #node-sendMessage="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" />
      </template>
      <template #node-addComment="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" />
      </template>
      <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
      <!-- <template #edge-special="specialEdgeProps">
        <SpecialEdge v-bind="specialEdgeProps" />
      </template> -->
    </VueFlow>
  </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";

.flow-container {
  width: 100%;
  height: 100%;
}
</style>
