<script setup>
import { computed } from "vue";
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

console.log(props);

const x = computed(() => `${Math.round(props.position.x)}px`);
const y = computed(() => `${Math.round(props.position.y)}px`);
</script>

<template>
  <div class="vue-flow__node-default">
    <div class="font-bold pb-1 border-b border-gray-500">
      {{ data?.title }}
    </div>
    <div class="text-gray-500">{{ data?.description }}</div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
