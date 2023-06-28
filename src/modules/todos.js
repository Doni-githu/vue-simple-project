import Todos from "@/services/todos"

const state = {
    isLoading: false,
    todos: null
}

const mutations = {
    startGetTodos(state) {
        state.isLoading = true
    },
    successGetTodos(state, payload) {
        state.isLoading = false
        state.todos = payload
    },
    failurGetTodos(state) {
        state.isLoading = false
    }
}

const actions = {
    todos(context, limit = 10) {
        return new Promise((resolve) => {
            context.commit('startGetTodos')
            Todos.getTodos(limit).then((res) => {
                context.commit('successGetTodos', res.data)
                resolve(res.data)
            }).catch(err => {
                console.log(err)
                context.commit('failurGetTodos')
            })
        })
    }
}

export default {
    state,
    actions,
    mutations
}