<script setup>
import { Position, Handle, useVueFlow } from "@vue-flow/core";
import { MessageSquareMore } from "lucide-vue-next";

import { useCanvasStore } from "../../stores/canvas";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  position: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: false,
  },
});

const store = useCanvasStore();
const { addSelectedNodes, resetSelectedNodes } = useVueFlow();

function onFocus() {
  resetSelectedNodes();
  addSelectedNodes([props.id]);
}

function onDelete() {
  store.removeNode(props.id);
}
</script>

<template>
  <div
    class="vue-flow__node-default p-0! pt-2! pb-2! border-green-500! accessible-node"
    tabindex="0"
    @focus="onFocus"
    @keydown.delete.stop="onDelete"
    @keydown.backspace.stop="onDelete"
  >
    <Handle type="target" :position="Position.Top" />
    <div class="flex items-center font-bold pb-1 border-b border-green-500">
      <MessageSquareMore class="w-4 h-4 ml-2 mr-2 text-green-500" />
      <span class="text-green-500">{{ data?.title }}</span>
    </div>
    <div class="text-gray-500 line-clamp-3 pt-1">{{ data?.comment }}</div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
