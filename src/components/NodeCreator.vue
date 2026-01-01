<script setup>
import { ref } from "vue";
import { Panel, useVueFlow } from "@vue-flow/core";
import { useCanvasStore } from "../stores/canvas";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Drawer from "primevue/drawer";
import SendMessageDetail from "./details/SendMessageDetail.vue";
import AddCommentDetail from "./details/AddCommentDetail.vue";
import DateTimeDetail from "./details/DateTimeDetail.vue";
import { Plus, RotateCcw, Trash2 } from "lucide-vue-next";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";

const { viewport, getSelectedElements, fitView } = useVueFlow();
const store = useCanvasStore();
const confirm = useConfirm();

const visible = ref(false);
const type = ref("addComment");
const title = ref("");
const description = ref("");
const payload = ref([]);
const comment = ref("");
const times = ref([]);
const timezone = ref("UTC");

const nodeTypes = [
  { label: "Add Comment", value: "addComment" },
  { label: "Send Message", value: "sendMessage" },
  { label: "Business Hours", value: "dateTime" },
];

const openDrawer = () => {
  visible.value = true;
  // Reset fields
  type.value = "addComment";
  title.value = "";
  description.value = "";
  payload.value = [];
  comment.value = "";
  times.value = [];
  timezone.value = "UTC";
};

const add = () => {
  const id = Date.now().toString();

  const newNode = {
    id,
    type: type.value,
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: {
      title: title.value,
      description: description.value,
      payload: JSON.parse(JSON.stringify(payload.value)),
      times: JSON.parse(JSON.stringify(times.value)),
      timezone: timezone.value,
      comment: comment.value,
    },
  };

  store.addNode(newNode);
  visible.value = false;
};

const reset = () => {
  confirm.require({
    message:
      "Are you sure you want to reset the canvas? All unsaved changes will be lost.",
    header: "Reset Confirmation",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Reset",
      severity: "danger",
    },
    accept: () => {
      store.reset();
      fitView();
    },
  });
};

const deleteSelected = () => {
  const selected = getSelectedElements.value;
  if (!selected || selected.length === 0) return;

  confirm.require({
    message: `Are you sure you want to delete ${selected.length} selected item(s)?`,
    header: "Delete Confirmation",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      selected.forEach((el) => {
        if (el.source && el.target) {
          store.removeEdge(el.id);
        } else {
          store.removeNode(el.id);
        }
      });
    },
  });
};
</script>

<template>
  <Panel position="top-left" class="p-2 rounded shadow-md border flex gap-2">
    <Button @click="reset" severity="contrast" size="small">
      <RotateCcw class="w-5 h-5" /> Reset
    </Button>
    <Button @click="deleteSelected" severity="danger" size="small">
      <Trash2 class="w-5 h-5" /> Delete
    </Button>
    <Button @click="openDrawer" size="small">
      <Plus class="w-5 h-5" /> Add New Node
    </Button>
  </Panel>

  <Drawer
    v-model:visible="visible"
    header="Add New Node"
    position="right"
    class="w-96!"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="font-semibold">Type</label>
        <Select
          v-model="type"
          :options="nodeTypes"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-semibold">Title</label>
        <InputText v-model="title" fluid />
      </div>

      <div
        class="flex flex-col gap-2"
        v-if="!['dateTime', 'addComment', 'sendMessage'].includes(type)"
      >
        <label class="font-semibold">Description</label>
        <Textarea v-model="description" rows="3" fluid />
      </div>

      <!-- Specific Details -->
      <SendMessageDetail v-if="type === 'sendMessage'" v-model="payload" />
      <AddCommentDetail v-if="type === 'addComment'" v-model="comment" />
      <DateTimeDetail
        v-if="type === 'dateTime'"
        v-model:times="times"
        v-model:timezone="timezone"
      />

      <div class="mt-4">
        <Button label="Create Node" @click="add" fluid />
      </div>
    </div>
  </Drawer>
  <ConfirmDialog />
</template>
