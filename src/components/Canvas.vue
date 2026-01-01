<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { VueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { useCanvasStore } from "../stores/canvas";
import TriggerNode from "./Node/TriggerNode.vue";
import DateTimeNode from "./Node/DateTimeNode.vue";
import ConnectorNode from "./Node/ConnectorNode.vue";
import AddCommentNode from "./Node/AddCommentNode.vue";
import SendMessageNode from "./Node/SendMessageNode.vue";
import NodeCreator from "./NodeCreator.vue";

const store = useCanvasStore();
const { nodes, edges } = storeToRefs(store);
const router = useRouter();
const vueFlowInstance = ref(null);

function onNodeClick({ node }) {
  if (node.type === "dateTimeConnector") return;
  router.push({ name: "node-details", params: { id: node.id } });
}

function onConnect(params) {
  const findEdge = edges.value.find(
    (e) =>
      e.source === params.source &&
      e.target === params.target &&
      e.sourceHandle === params.sourceHandle &&
      e.targetHandle === params.targetHandle
  );

  if (findEdge) return;

  store.addEdge({ ...params, type: "smoothstep" });
}

function onPaneReady(instance) {
  vueFlowInstance.value = instance;
  if (nodes.value.length > 0) {
    instance.fitView();
  }
}

watch(
  () => nodes.value.length,
  (count) => {
    if (count > 0 && vueFlowInstance.value) {
      setTimeout(() => {
        vueFlowInstance.value.fitView();
      }, 50);
    }
  },
  { once: true }
);
</script>

<template>
  <div class="flow-container dotted-background">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      @node-click="onNodeClick"
      @connect="onConnect"
      @pane-ready="onPaneReady"
      fit-view-on-init
    >
      <Background :gap="16" />

      <template #node-trigger="triggerNodeProps">
        <TriggerNode v-bind="triggerNodeProps" />
      </template>

      <template #node-dateTime="dateTimeNodeProps">
        <DateTimeNode v-bind="dateTimeNodeProps" />
      </template>

      <template #node-dateTimeConnector="dateTimeConnectorNodeProps">
        <ConnectorNode v-bind="dateTimeConnectorNodeProps" />
      </template>

      <template #node-sendMessage="sendMessageNodeProps">
        <SendMessageNode v-bind="sendMessageNodeProps" />
      </template>

      <template #node-addComment="addCommentNodeProps">
        <AddCommentNode v-bind="addCommentNodeProps" />
      </template>

      <NodeCreator />
    </VueFlow>
    <RouterView />
  </div>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.flow-container {
  width: 100%;
  height: 100%;
}
</style>
