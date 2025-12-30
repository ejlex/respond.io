<script setup>
import { storeToRefs } from "pinia";
import { VueFlow } from "@vue-flow/core";
import { useCanvasStore } from "../stores/canvas";
import TriggerNode from "./Node/TriggerNode.vue";
import DateTimeNode from "./Node/DateTimeNode.vue";
import ConnectorNode from "./Node/ConnectorNode.vue";
import AddCommentNode from "./Node/AddCommentNode.vue";
import SendMessageNode from "./Node/SendMessageNode.vue";

const store = useCanvasStore();
const { nodes, edges } = storeToRefs(store);
</script>

<template>
  <div class="flow-container">
    <VueFlow :nodes="nodes" :edges="edges">
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
    </VueFlow>
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
