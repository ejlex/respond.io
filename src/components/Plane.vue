<script setup>
import { ref, watch } from "vue";
import { VueFlow } from "@vue-flow/core";
import { useQuery } from "@tanstack/vue-query";
import SpecialNode from "./SpecialNode.vue";
import SpecialEdge from "./SpecialEdge.vue";

const { data } = useQuery({
  queryKey: ["assessments"],
  queryFn: () =>
    fetch("/api/candidate-assessments/payload.json")
      .then((response) => response.json())
      .catch((error) => console.error(error)),
});

watch(data, () => {
  console.log(data.value);
});

// these are our nodes
const nodes = ref([
  // an input node, specified by using `type: 'input'`
  {
    id: "1",
    type: "special",
    position: { x: 250, y: 5 },
    // all nodes can have a data object containing any data you want to pass to the node
    // a label can property can be used for default nodes
    data: {
      label: "Node 1",
      title: "Input Node",
      description: "This is an input node",
    },
  },

  // default node, you can omit `type: 'default'` as it's the fallback type
  {
    id: "2",
    type: "special",
    position: { x: 100, y: 100 },
    data: {
      label: "Node 2",
      title: "Default Node",
      description: "This is a default node",
    },
  },

  // An output node, specified by using `type: 'output'`
  {
    id: "3",
    type: "output",
    position: { x: 400, y: 200 },
    data: {
      label: "Node 3",
      title: "Output Node",
      description: "This is an output node",
    },
  },

  // this is a custom node
  // we set it by using a custom type name we choose, in this example `special`
  // the name can be freely chosen, there are no restrictions as long as it's a string
  {
    id: "4",
    type: "special", // <-- this is the custom node type name
    title: "Special Node",
    description: "This is a special node",
    position: { x: 400, y: 100 },
    data: {
      label: "Node 4",
      hello: "world",
      title: "Special Node",
      description: "This is a special node",
    },
  },
]);

// these are our edges
const edges = ref([
  // default bezier edge
  // consists of an edge id, source node id and target node id
  {
    id: "e1->2",
    source: "1",
    target: "2",
  },

  // set `animated: true` to create an animated edge path
  {
    id: "e2->3",
    source: "2",
    target: "3",
    animated: true,
  },

  // a custom edge, specified by using a custom type name
  // we choose `type: 'special'` for this example
  {
    id: "e3->4",
    type: "special",
    source: "3",
    target: "4",

    // all edges can have a data object containing any data you want to pass to the edge
    data: {
      hello: "world",
    },
  },
]);
</script>

<template>
  <div class="flow-container">
    <VueFlow :nodes="nodes" :edges="edges">
      <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
      <template #node-special="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" />
      </template>

      <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
      <template #edge-special="specialEdgeProps">
        <SpecialEdge v-bind="specialEdgeProps" />
      </template>
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
