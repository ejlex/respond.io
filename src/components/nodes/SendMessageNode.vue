<script setup>
import { Position, Handle, useVueFlow } from "@vue-flow/core";
import { SendHorizontal } from "lucide-vue-next";

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
    class="vue-flow__node-default p-0! pt-2! pb-2! h-auto! border-purple-500! accessible-node"
    tabindex="0"
    @focus="onFocus"
    @keydown.delete.stop="onDelete"
    @keydown.backspace.stop="onDelete"
  >
    <Handle type="target" :position="Position.Top" />
    <div class="flex items-center font-bold pb-1 border-b border-purple-500">
      <SendHorizontal class="w-4 h-4 ml-2 mr-2 text-purple-500" />
      <span class="text-purple-500">{{ data?.title }}</span>
    </div>
    <div class="text-gray-500 overflow-hidden line-clamp-3">
      <div class="p-1.5" v-for="message in data?.payload">
        <div class="text-left" v-if="message?.type === 'text'">
          <p>Message:</p>
          <p>{{ message?.text }}</p>
        </div>
        <div class="text-left" v-if="message?.type === 'attachment'">
          <p>Message:</p>
          <p>{{ message?.attachment }}</p>
        </div>
      </div>
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
