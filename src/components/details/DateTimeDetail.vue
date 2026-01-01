<script setup>
import { ref, watch } from "vue";
import Select from "primevue/select";

const props = defineProps({
  times: {
    type: Array,
    default: () => [],
  },
  timezone: {
    type: String,
    default: "UTC",
  },
});

const emit = defineEmits(["update:times", "update:timezone"]);

const localTimes = ref([]);
const localTimezone = ref("");

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const dayLabels = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const timezones = ["UTC", "GMT", "EST", "PST", "CST", "MST", "DST"];

watch(
  () => props.times,
  (newTimes) => {
    localTimes.value = days.map((day) => {
      const existing = newTimes?.find((t) => t.day === day);
      return existing
        ? { ...existing }
        : { day, startTime: "09:00", endTime: "17:00" };
    });
  },
  { immediate: true, deep: true }
);

watch(
  () => props.timezone,
  (newTz) => {
    localTimezone.value = newTz || "UTC";
  },
  { immediate: true }
);

const emitUpdate = () => {
  emit("update:times", localTimes.value);
  emit("update:timezone", localTimezone.value);
};
</script>

<template>
  <div class="flex flex-col gap-4 border-t pt-4 mt-2">
    <p class="text-sm text-gray-500">
      Allows a branch to be created based on date & time conditions.
    </p>

    <div class="grid grid-cols-[50px_1fr] gap-y-2 items-center ml-2">
      <div class="font-semibold text-gray-500 text-sm">Day</div>
      <div class="font-semibold text-gray-500 text-sm pl-2">Time</div>

      <template v-for="day in days" :key="day">
        <div class="font-bold text-sm">{{ dayLabels[day] }}</div>
        <div class="flex items-center gap-2">
          <input
            type="time"
            v-model="localTimes.find((t) => t.day === day).startTime"
            @change="emitUpdate"
            class="border rounded px-2 py-1 text-sm w-24"
          />
          <span class="text-gray-400 text-xs">to</span>
          <input
            type="time"
            v-model="localTimes.find((t) => t.day === day).endTime"
            @change="emitUpdate"
            class="border rounded px-2 py-1 text-sm w-24"
          />
        </div>
      </template>
    </div>

    <div class="flex flex-col gap-2 mt-2">
      <label class="font-semibold text-sm text-gray-600">Time Zone</label>
      <Select
        v-model="localTimezone"
        :options="timezones"
        @change="emitUpdate"
        class="w-full"
      />
    </div>
  </div>
</template>
