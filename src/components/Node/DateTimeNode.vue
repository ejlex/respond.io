<script setup>
import { Position, Handle } from "@vue-flow/core";
import { Calendar1 } from "lucide-vue-next";

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

const tempDescription =
  props.data?.description || `${props.data?.title} ${props.data?.timezone}`;
</script>

<template>
  <div class="vue-flow__node-default p-0! pt-2! pb-2!">
    <Handle type="target" :position="Position.Top" />
    <div class="flex items-center font-bold pb-1 border-b border-gray-500">
      <Calendar1 class="w-4 h-4 ml-2 mr-2" />
      {{ data?.title }}
    </div>
    <div class="text-gray-500 pt-1">
      {{ data?.description || tempDescription }}
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
