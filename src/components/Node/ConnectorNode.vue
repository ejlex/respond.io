<script setup>
import { Position, Handle, useVueFlow } from "@vue-flow/core";

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
const { addSelectedNodes } = useVueFlow();

function onFocus() {
  addSelectedNodes([props.id]);
}

function onDelete() {
  store.removeNode(props.id);
}
</script>

<template>
  <div
    class="vue-flow__node-default pr-4! pl-4! pt-1! pb-1! rounded-2xl! bg-sky-200! border-sky-200! text-blue-900! border-[3px]! accessible-node"
    tabindex="0"
    @focus="onFocus"
    @keydown.delete.stop="onDelete"
    @keydown.backspace.stop="onDelete"
  >
    <Handle type="target" :position="Position.Top" />
    <div class="text-center font-bold">
      {{ data?.title }}
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
