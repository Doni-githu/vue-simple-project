<template>
    <div class="filter-todo">
        <div class="search">
            <input type="text" placeholder="Введите текст для поиска из названих задач" class="custo" @input="e => searchOfTerm(e)">
            <select @change="e => changeOfStatus(e)">
                <option value="no">сначала невыполненные задачи, затем выполненные</option>
                <option value="yes">сначала выполненные задачи, затем невыполненные</option>
            </select>
        </div>
        <div class="navigate-2">
            <div v-show="todos.filter(c => c.isSelect).length !== 0">
                <button @click="() => DeleteTodos()" class="btn btn-danger d-flex gap-1 align-items-center">
                    <span>Удалить {{ todos.filter(c => c.isSelect).length }}</span>
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="numbers">
                <input placeholder="Число задач" type="number" :value="limit" @input="getPosts">
            </div>
            <div>
                <button @click="onRefresh" class="btn btn-primary">
                    <span>Обновить</span>
                    <i class="fa-solid fa-arrows-rotate"></i>
                </button>
            </div>
        </div>
    </div>
    <div v-show="isWantEditPost" class="modal">
        <div class="modal-header" style="display: flex; justify-content: flex-end;">
            <button class="btn" @click="isWantEditPost = false">
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
        <div class="modal-body">
            <form class="modelForm" @submit.prevent>
                <template v-if="error">
                    <Alert :msg="error" />
                </template>
                <Input :placeholder="'Title'" v-model="title" />
                <p>Вы хотите сделать задачу выполненным</p>
                <label style="display: flex; gap: 10px;">
                    <input value="true" @click="checked = true" :checked="checked" name="progress" type="radio">
                    <span>Да</span>
                </label>
                <label style="display: flex; gap: 10px;">
                    <input value="false" @click="checked = false" :checked="checked === false" name="progress" type="radio">
                    <span>Нет</span>
                </label>
                <div class="button">
                    <button @click="onEndEdit">Сохранить</button>
                </div>
            </form>
        </div>
    </div>
    <div class="modal2" v-if="isWantDeletePost">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Вы, и правда хотите удалить пост</h5>
            </div>
            <div class="modal-footer" style="display: flex; gap: 20px;">
                <button type="button" class="btn btn-success" @click="isWantDeletePost = false">Закрыть</button>
                <button type="button" class="btn btn-danger" @click="Delete">Удалить</button>
            </div>
        </div>
    </div>
    <template v-if="!isLoading">
        <div class="todos-container">
            <Todo v-for="todo in FilterArray(sorted(todos), term)" :key="todo.id" :todo="todo"
                @onStartEdit="onStartEditHandler" @isSelect="onSelectHandler" @onDelete="onDeleteHandler" />
        </div>
    </template>
    <template v-else>
        <Loader />
    </template>
</template>
<script>
import User from '@/services/user'
import Todo from './Todo.vue'
import Todos from '@/services/todos';

export default {
    mounted() {
        if (JSON.parse(localStorage.getItem("todos"))) {
            this.todos = JSON.parse(localStorage.getItem("todos"));
        }
        else {
            this.isLoading = true;
            this.$store.dispatch("todos")
                .then((res) => {
                    this.newArray(res)
                        .then((res2) => {
                            localStorage.setItem("todos", JSON.stringify(res2));
                            this.todos = res2;
                            this.isLoading = false;
                        });
                });
        }

        this.limit = this.todos.length
    },
    data() {
        return {
            todos: [],
            checked: false,
            isLoading: false,
            isSeeComment: false,
            isWantEditPost: false,
            name: "",
            title: "",
            body: "",
            id: "",
            error: "",
            isWantDeletePost: false,
            limit: 0,
            postName: "",
            term: '',
            status: 'no'
        };
    },
    methods: {
        changeOfStatus(e) {
            this.status = e.target.value
        },
        onStartEditHandler(id) {
            const found = this.todos.find(c => c.id === id)
            this.title = found.title
            this.id = id
            this.checked = found.completed
            this.isWantEditPost = true
        },
        onDeleteHandler(id) {
            this.id = id
            this.isWantDeletePost = true
        },
        async DeleteTodos() {
            this.isLoading = true
            const newArray = this.todos.filter(c => c.isSelect)
            for (let i = 0; i < newArray.length; i++) {
                const element = newArray[i];
                this.todos = this.todos.filter(c => c.id !== element.id)
                localStorage.setItem('todos', JSON.stringify(this.todos))
                await Todos.delete(element.id)
            }
            this.isLoading = false
        },
        async onEndEdit() {
            const updateOne = {
                id: parseInt(this.id),
                title: this.title,
                userId: 1
            }
            const newUpdatedArray = this.todos.map((item) => {
                if (item.id === parseInt(this.id)) {
                    return {
                        ...item,
                        title: this.title,
                        completed: this.checked
                    }
                }
                return item
            })

            this.todos = newUpdatedArray
            localStorage.setItem('todos', JSON.stringify(newUpdatedArray))
            this.isWantEditPost = false
            await Todos.update(this.id, updateOne)
            this.error = ''
            this.id = ''
        },
        FilterArray(array, term) {
            if (term.length === 0) {
                return array
            }
            return array.filter(c => c.title.toLowerCase().indexOf(term.toLowerCase()) > -1)
        },
        async newArray(array) {
            const newArray = [];
            const length = array.length;
            for (let i = 0; i < length; i++) {
                const element = array[i];
                const user = await this.getUser(element.userId);
                newArray.push({
                    ...element,
                    user: user,
                    isSelect: false,
                });
            }
            return newArray;
        },
        async Delete() {
            const newArray = this.todos.filter(c => c.id !== parseInt(this.id))
            this.todos = newArray
            localStorage.setItem('todos', JSON.stringify(newArray))
            await Todos.delete(parseInt(this.id))
            this.isWantDeletePost = false
        },
        async getUser(id) {
            const user = await User.getUser(id)
                .then((res) => {
                    return res.data;
                });
            return user;
        },
        sorted(array) {
            if (this.status === 'yes') {
                return array.sort((a, b) => b.completed - a.completed)
            }else{
                return array.sort((a, b) => a.completed - b.completed)
            }
        },
        onRefresh() {
            this.isLoading = true
            this.$store.dispatch('todos')
                .then((res) => {
                    this.newArray(res)
                        .then(res2 => {
                            this.isLoading = false
                            localStorage.setItem('todos', JSON.stringify(res2))
                            this.isLoading = false
                            this.todos = res2
                        })
                })
        },
        changeSelect(id) {
            const newTodos = this.todos.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        isSelect: !item.isSelect
                    };
                }
                return item;
            });
            this.todos = newTodos;
        },
        searchOfTerm(e) {
            this.term = e.target.value
        },
        onSelectHandler(id) {
            const found = this.todos.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        isSelect: !item.isSelect
                    }
                }
                return item
            })
            this.todos = found
        },
        getPosts(e) {
            this.limit = e.target.value
            const limit = parseInt(e.target.value)
            this.isLoading = true
            this.$store.dispatch('todos', limit)
                .then((res) => {
                    this.newArray(res)
                        .then(res2 => {
                            this.isLoading = false
                            localStorage.setItem('todos', JSON.stringify(res2))
                            this.isLoading = false
                            this.todos = res2
                        })
                })
        }
    },
    components: { Todo }
}
</script>
<style scoped>
.filter-todo{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.filter-todo .search input{
    border: none;
    color: #000;
    border-bottom: 1px solid var(--bs-primary);
}
.filter-todo .search input:focus{
    outline: none;
}
.filter-todo .search input::placeholder{
    color:var(--bs-primary);
    font-family: sans-serif;
}

.search{
    display: flex;
    gap: 20px;
}

.search select{
    border: none;
    background-color: #fff;
    border: 1px solid var(--bs-primary);
    border-radius: 5px;
    color: var(--bs-primary);
}

.todos-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
}


.navigate-2 {
    display: flex;
    align-items: center;
    gap: 20px;
}


.navigate-2 .numbers input {
    width: 100%;
    border: none;
    background-color: transparent;
    border-radius: 5px;
    outline: 2px solid #3a86ff;
    color: #3a86ff;
    -moz-appearance: textfield;
}

.navigate-2 .numbers input::-webkit-inner-spin-button,
.navigate-2 .numbers input::-webkit-outer-spin-button {
    -webkit-appearance: none;
}
</style>