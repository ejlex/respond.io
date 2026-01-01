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
console.log(props.data);
</script>

<template>
  <div class="vue-flow__node-default p-0! pt-2! pb-2!">
    <div class="flex items-center font-bold pb-1 border-b border-gray-500">
      <Zap class="w-4 h-4 ml-2 mr-2" />
      {{ data?.title || "Trigger Node" }}
    </div>
    <div class="text-gray-500 pt-2">
      {{ data?.description || "Conversation Opened" }}
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
