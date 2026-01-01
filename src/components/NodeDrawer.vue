<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCanvasStore } from "../stores/canvas";
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

const route = useRoute();
const router = useRouter();
const store = useCanvasStore();

const nodeId = computed(() => route.params.id);
const node = computed(() => store.nodes.find((n) => n.id === nodeId.value));

const visible = ref(true);

const title = ref("");
const description = ref("");

watch(
  node,
  (newNode) => {
    if (newNode) {
      title.value = newNode.data.title || "";
      description.value = newNode.data.description || "";
    }
  },
  { immediate: true }
);

const update = () => {
  if (node.value) {
    store.updateNodeData(nodeId.value, {
      title: title.value,
      description: description.value,
    });
  }
};

const remove = () => {
  store.removeNode(nodeId.value);
  visible.value = false; // Will trigger watch to navigate
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
        <InputText id="title" v-model="title" @input="update" fluid />
      </div>
      <div class="flex flex-col gap-2">
        <label for="description" class="font-semibold">Description</label>
        <Textarea
          id="description"
          v-model="description"
          rows="5"
          @input="update"
          fluid
        />
      </div>
      <div class="mt-4">
        <Button label="Delete Node" severity="danger" @click="remove" fluid />
      </div>
    </div>
    <div v-else>
      <p>Node not found.</p>
    </div>
  </Drawer>
</template>
