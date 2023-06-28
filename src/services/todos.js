import axios from "./axios"

const Todos = {
    getTodos(limit){
        return axios.get(`/todos?_limit=${limit}`)
    },
    delete(id){
        return axios.delete(`/todos/${id}`)
    },
    update(id, todo){
        return axios.patch(`/todos/${id}`, todo)
    }
}

export default Todos