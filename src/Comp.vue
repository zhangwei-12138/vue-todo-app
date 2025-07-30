<template>
  <div class="task-row">
    <span class="drag-handle">⠿</span>
    <input
      type="checkbox"
      v-model="localTask.done"
      @change="toggleDone"
    />
    <input
      v-if="isEditing"
      v-model="localTask.title"
      @keyup.enter="save"
      @blur="save"
      ref="editInput"
      style="width: 200px;"
    />
    <span v-else @click="edit">{{ task.title }}</span>
    <button @click="emit('delete', task.id)" style="margin-left: 10px;">
      删除
    </button>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({ task: Object });
const emit = defineEmits(["delete", "change", "updateTitles"]);

const isEditing = ref(false);
const editInput = ref(null);
const localTask = ref({ ...props.task });

watch(() => props.task, (newTask) => {
  localTask.value = { ...newTask };
});

function edit() {
  isEditing.value = true;
  nextTick(() => {
    editInput.value?.focus();
  });
}

function toggleDone() {
  emit('change', props.task.id);
}

function save() {
    const t = localTask.value.title.trim()
    if (t) {
        emit("updateTitles", {
        id: props.task.id,
        title: localTask.value.title.trim()
        });
    }
    isEditing.value = false;
}

defineExpose( { edit ,save } )
</script>

<style scoped>
.task-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.drag-handle {
  cursor: grab;
}
</style>

