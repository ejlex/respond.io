<script setup>
import { ref, watch } from "vue";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import { X } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: [Object, Array],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const text = ref("");
const attachments = ref([]);
const fileInput = ref(null);

watch(
  () => props.modelValue,
  (newPayload) => {
    const messages = Array.isArray(newPayload) ? newPayload : [];

    text.value = messages
      .filter((m) => m.type === "text")
      .map((m) => m.text)
      .join("\n");

    attachments.value = messages
      .filter((m) => m.type === "attachment")
      .map((m) => {
        const a = m.attachment;
        return typeof a === "string" ? { type: "image", url: a } : a;
      });
  },
  { immediate: true, deep: true }
);

const emitUpdate = () => {
  const newPayload = [];
  if (text.value) {
    newPayload.push({ type: "text", text: text.value });
  }
  attachments.value.forEach((att) => {
    newPayload.push({ type: "attachment", attachment: att });
  });
  emit("update:modelValue", newPayload);
};

const handleFileUpload = (event) => {
  if (attachments.value.length >= 1) {
    event.target.value = "";
    return;
  }
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      attachments.value.push({
        type: file.type.startsWith("image/") ? "image" : "file",
        url: e.target.result,
        name: file.name,
      });
      emitUpdate();
    };
    reader.readAsDataURL(file);
  }
  event.target.value = "";
};

const removeAttachment = (index) => {
  attachments.value.splice(index, 1);
  emitUpdate();
};
</script>

<template>
  <div class="flex flex-col gap-4 border-t pt-4 mt-2">
    <div class="flex flex-col gap-2">
      <label class="font-semibold">Attachments</label>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(att, index) in attachments"
          :key="index"
          class="relative w-24 h-24 border rounded p-1 bg-gray-50 group"
        >
          <img
            v-if="att.type === 'image'"
            :src="att.url"
            class="w-full h-full object-cover rounded"
          />
          <div
            v-else
            class="flex items-center justify-center w-full h-full text-gray-500"
          >
            <i class="pi pi-file text-2xl"></i>
          </div>
          <button
            class="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full text-gray-500 border border-gray-200 flex items-center justify-center shadow-sm hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
            @click="removeAttachment(index)"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
        <div
          v-if="attachments.length < 1"
          class="w-24 h-24 border border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50"
          @click="$refs.fileInput.click()"
        >
          <i class="pi pi-plus text-xl text-gray-400"></i>
        </div>
      </div>
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        class="hidden"
        accept="image/*"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="messageText" class="font-semibold">Message Text</label>
      <Textarea
        id="messageText"
        v-model="text"
        rows="3"
        @input="emitUpdate"
        fluid
      />
    </div>
  </div>
</template>
