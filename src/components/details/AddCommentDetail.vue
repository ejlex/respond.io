<script setup>
import Textarea from "primevue/textarea";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col gap-2 border-t pt-4 mt-2">
    <label for="comment" class="font-semibold">Comment</label>
    <Textarea
      id="comment"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      rows="5"
      fluid
    />
  </div>
</template>
