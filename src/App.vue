<template>
  <div>
    <input
      v-model="userTitle"
      @keyup.enter="addTask"
      placeholder="输入任务名称，回车添加"
      ref="inputRef"
    />
    <button @click="addTask">添加任务</button>

    <div style="margin: 10px 0;">
      <button @click="store.filter = 'all'" :class="{active: filter === 'all'}">全部</button>
      <button @click="store.filter = 'done'" :class="{active: filter === 'done'}">已完成</button>
      <button @click="store.filter = 'todo'" :class="{active: filter === 'todo'}">未完成</button>
    </div>

    <div style="margin: 10px 0;">
      <button @click="store.sortBy = 'created'" :class="{active: sortBy === 'created'}">按创建时间排序</button>
      <button @click="store.sortBy = 'name'" :class="{active: sortBy === 'name'}">按名称排序</button>
      <button @click="store.sortBy = 'done'" :class="{active: sortBy === 'done'}">按完成状态排序</button>
    </div>

    <div v-for="(task,index) in store.pagedTasks" :key="task.id" style="margin-bottom: 6px;">
      <Comp
        :task="task"
        :ref="setTaskRef(task.id)"
        @delete="deleteDo"
        @change="changeDo"
        @updateTitles="updateTitles"
      />
    </div>

    <div style="margin-top: 10px;">
      <button @click="store.currentPage--" :disabled="store.currentPage === 1">上一页</button>
      <span>{{ store.currentPage }} / {{ store.maxPage }} 页</span>
      <button @click="store.currentPage++" :disabled="store.currentPage === store.maxPage">下一页</button>
    </div>

    <div style="margin-top: 10px;">
      <input v-model="store.keyword" placeholder="搜索任务名..." />
    </div>

    <div style="margin-top: 10px;">
      <span style="color:red">总任务: {{ store.tasks.length }}</span> |
      <span style="color:green">已完成: {{ store.tasks.filter(t => t.done).length }}</span>
    </div>
  </div>
  <button @click="statEdit">父亲启动子编辑</button>
  <button @click="statAllEdit">父亲启动子All of编辑</button>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import Comp from "./Comp.vue";
import { useTaskStore } from './stores/taskStore.js'

const store = useTaskStore()

const LOCAL_KEY = "my-tasks";

const userTitle = ref("");

const inputRef = ref(null);

const compRefs = ref({})

function setTaskRef(id) {
  return (el)=>{
    if (el){ compRefs.value[id] = el;
    }else { delete compRefs.value[id] };
  }
}

function statEdit(){
  const f = Object.keys(compRefs.value)[0]
  compRefs.value[f]?.edit?.()
}

function statAllEdit(){
  store.pagedTasks.forEach(t=>{
    compRefs.value[t.id]?.edit?.();
  });
}
onMounted(() => {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    store.tasks = JSON.parse(saved);
  } 
  nextTick(() => {
    inputRef.value?.focus();
  });
});

watch([()=>store.filter,()=>store.keyword],()=>{
  store.checkPage()
})

watch(store.tasks, (val) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(val));
}, { deep: true });

watch(store.filteredTasks, () => {
  if (currentPage.value > maxPage.value) {
    currentPage.value = maxPage.value;
  }
});

function addTask() {
  const title = userTitle.value.trim();
  if (!title) return;
  store.addTask(title)
  userTitle.value = "";
  inputRef.value?.focus();
}

function deleteDo(id) {
  store.deleteTask(id)
}

function changeDo(id) {
  store.toggleDone(id)
}

function updateTitles({ id, title }) {
  store.updateTitle(id,title)
}


</script>

<style scoped>
.active {
  font-weight: bold;
  color: red;
}
</style>
