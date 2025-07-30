import { defineStore } from "pinia";
import { computed,ref } from "vue";


export const useTaskStore = defineStore('taskStore',()=>{
    const tasks = ref([
      { id: 1, title: "🧼 洗衣服", done: false },
      { id: 2, title: "📝 写报告", done: true },
    ])

    const currentPage = ref(1);
    const pageSize = 3;

    function addTask(title){
        tasks.value.push({
            id:Date.now(),
            title,
            done:false
        })
    }

    function deleteTask(id){
        tasks.value = tasks.value.filter(b=>b.id !== id)
    }

    function toggleDone(id){
        const  task = tasks.value.find(b=>b.id ===id)
        if(task) task.done = !task.done
    }

    function updateTitle(id,newval){
        const task = tasks.value.find((t) => t.id === id);
        if (task) task.title = newval;
    }
    const doneCount = computed(() => tasks.value.filter(t => t.done).length)

    const filter = ref("all");
    const sortBy = ref("created");
    const keyword = ref("");
    const filteredTasks = computed(() => {
        let list = tasks.value;

        if (filter.value === "done") list = list.filter((t) => t.done);
        else if (filter.value === "todo") list = list.filter((t) => !t.done);

        if (keyword.value.trim()) {
            list = list.filter((t) =>
            t.title.toLowerCase().includes(keyword.value.toLowerCase())
            );
        }

        if (sortBy.value === "name") {
            list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy.value === "done") {
            list = [...list].sort((a, b) => Number(b.done) - Number(a.done));
        } else if (sortBy.value === "created") {
            list = [...list].sort((a, b) => a.id - b.id);
        }

        return list;
    });

    const maxPage = computed(() =>
        Math.max(1, Math.ceil(filteredTasks.value.length / pageSize))
    );

    const pagedTasks = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        return filteredTasks.value.slice(start, start + pageSize);
    });

    function checkPage(){
        if(currentPage.value > maxPagevalue.value){
            currentPage.value = maxPage.value
        }
    }

    return{
        toggleDone,
        deleteTask,
        addTask,
        tasks,
        doneCount,
        updateTitle,
        doneCount,

        checkPage,
        maxPage,
        pagedTasks,
        filteredTasks,
        keyword,
        sortBy,
        filter,
        currentPage
    }

})
    
