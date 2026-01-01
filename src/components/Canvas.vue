<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { VueFlow, useVueFlow, useKeyPress } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { useCanvasStore } from "../stores/canvas";
import TriggerNode from "./nodes/TriggerNode.vue";
import DateTimeNode from "./nodes/DateTimeNode.vue";
import ConnectorNode from "./nodes/ConnectorNode.vue";
import AddCommentNode from "./nodes/AddCommentNode.vue";
import SendMessageNode from "./nodes/SendMessageNode.vue";
import ControlPanel from "./ControlPanel.vue";

const store = useCanvasStore();
const { nodes, edges } = storeToRefs(store);
const router = useRouter();
const vueFlowInstance = ref(null);
const { getSelectedNodes, getSelectedEdges } = useVueFlow();

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

const isUp = useKeyPress("ArrowUp");
const isDown = useKeyPress("ArrowDown");
const isLeft = useKeyPress("ArrowLeft");
const isRight = useKeyPress("ArrowRight");

const moveStep = 5;

function moveNodes(xOffset, yOffset) {
  const nodes = getSelectedNodes.value;
  if (!nodes.length) return;

  nodes.forEach((node) => {
    const newPos = {
      x: node.position.x + xOffset * moveStep,
      y: node.position.y + yOffset * moveStep,
    };
    node.position = newPos;
    store.updateNodePosition(node.id, newPos);
  });
  store.addToHistory();
}

watch(isUp, (v) => v && moveNodes(0, -1));
watch(isDown, (v) => v && moveNodes(0, 1));
watch(isLeft, (v) => v && moveNodes(-1, 0));
watch(isRight, (v) => v && moveNodes(1, 0));

function onNodeDragStop({ nodes: draggedNodes }) {
  draggedNodes.forEach((node) => {
    store.updateNodePosition(node.id, node.position);
  });
  store.addToHistory();
}

const isEnter = useKeyPress("Enter");
const isDelete = useKeyPress("Delete");

watch(isEnter, (v) => {
  if (v && getSelectedNodes.value.length > 0) {
    const node = getSelectedNodes.value[0];
    if (node.type !== "dateTimeConnector") {
      router.push({ name: "node-details", params: { id: node.id } });
    }
  }
});

watch(isDelete, (v) => {
  if (v) {
    getSelectedNodes.value.forEach((n) => store.removeNode(n.id));
    getSelectedEdges.value.forEach((e) => store.removeEdge(e.id));
  }
});

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
  <div class="flow-container dotted-background" aria-label="Workflow Diagram">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      @node-click="onNodeClick"
      @connect="onConnect"
      @pane-ready="onPaneReady"
      @node-drag-stop="onNodeDragStop"
      fit-view-on-init
      :keyboard-shortcuts="true"
      :multi-selection-key-code="'Control'"
      aria-live="polite"
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

      <ControlPanel />
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

/* Always provide a clear focus ring for accessibility */
.accessible-node:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
}
</style>
