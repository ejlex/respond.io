<script setup>
import { Position, Handle } from "@vue-flow/core";

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
  <div
    class="vue-flow__node-default pr-4! pl-4! pt-1! pb-1! rounded-2xl! bg-sky-200! border-sky-200! text-blue-900! border-[3px]!"
  >
    <Handle type="target" :position="Position.Top" />
    <div class="text-center font-bold">
      {{ data?.title }}
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
