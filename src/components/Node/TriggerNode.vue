<script setup>
import { Position, Handle } from "@vue-flow/core";
import { Zap } from "lucide-vue-next";

const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: false,
  },
});
</script>

<template>
  <div class="vue-flow__node-default p-0! pt-2! pb-2! border-blue-500!">
    <div class="flex items-center font-bold pb-1 border-b border-blue-500">
      <Zap class="w-4 h-4 ml-2 mr-2 text-blue-500" />
      <span class="text-blue-500">{{ data?.title || "Trigger Node" }}</span>
    </div>
    <div class="text-gray-500 pt-2">
      {{ data?.description || "Conversation Opened" }}
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
