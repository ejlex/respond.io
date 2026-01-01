<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCanvasStore } from "../stores/canvas";
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import SendMessageDetail from "./details/SendMessageDetail.vue";
import AddCommentDetail from "./details/AddCommentDetail.vue";
import DateTimeDetail from "./details/DateTimeDetail.vue";

const route = useRoute();
const router = useRouter();
const store = useCanvasStore();
const confirm = useConfirm();

const nodeId = computed(() => route.params.id);
const node = computed(() => store.findNodeById(nodeId.value));

const visible = ref(true);

const title = ref("");
const description = ref("");
const payload = ref({});
const comment = ref("");
const times = ref([]);
const timezone = ref("");

watch(
  node,
  (newNode) => {
    if (newNode) {
      title.value = newNode.data.title || "";
      description.value = newNode.data.description || "";
      payload.value = newNode.data.payload
        ? JSON.parse(JSON.stringify(newNode.data.payload))
        : [];
      comment.value = newNode.data.comment || "";
      times.value = newNode.data.times
        ? JSON.parse(JSON.stringify(newNode.data.times))
        : [];
      timezone.value = newNode.data.timezone || "UTC";
    }
  },
  { immediate: true }
);

const save = () => {
  if (node.value) {
    store.updateNodeData(nodeId.value, {
      title: title.value,
      description: description.value,
      payload: payload.value,
      comment: comment.value,
      times: times.value,
      timezone: timezone.value,
    });
    visible.value = false;
  }
};

const remove = () => {
  confirm.require({
    message: "Are you sure you want to delete this node?",
    header: "Confirmation",
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
      store.removeNode(nodeId.value);
      visible.value = false; // Will trigger watch to navigate
    },
    reject: () => {},
  });
};

watch(visible, (val) => {
  if (!val) {
    router.push("/");
  }
});
</script>

<template>
  <Drawer
    v-model:visible="visible"
    header="Node Details"
    position="right"
    class="w-96!"
  >
    <div v-if="node" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="title" class="font-semibold">Title</label>
        <InputText id="title" v-model="title" fluid />
      </div>

      <div
        class="flex flex-col gap-2"
        v-if="
          !['dateTimeConnector', 'addComment', 'sendMessage'].includes(
            node.type
          )
        "
      >
        <label for="description" class="font-semibold">Description</label>
        <Textarea id="description" v-model="description" rows="5" fluid />
      </div>

      <!-- Send Message Node Specific Fields -->
      <SendMessageDetail v-if="node.type === 'sendMessage'" v-model="payload" />

      <!-- Add Comment Node Specific Fields -->
      <AddCommentDetail v-if="node.type === 'addComment'" v-model="comment" />

      <!-- Date Time Node Specific Fields -->
      <DateTimeDetail
        v-if="node.type === 'dateTime'"
        v-model:times="times"
        v-model:timezone="timezone"
      />

      <div class="mt-4 flex gap-2">
        <Button label="Save" @click="save" fluid />
        <Button label="Delete" severity="danger" @click="remove" fluid />
      </div>
    </div>
    <div v-else>
      <p>Node not found.</p>
    </div>
  </Drawer>
  <ConfirmDialog />
</template>
