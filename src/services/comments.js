import axios from "./axios"

const Comments = {
    getComment(id) {
        return axios.get(`/comments/${id}`)
    },
    allComment(){
        return axios.get('/comments?_limit=5')
    }
}

export default Comments 