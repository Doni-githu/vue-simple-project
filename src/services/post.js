import axios from "./axios";

const Post = {
    getAll(limit) {
        return axios.get(`/posts?_limit=${limit}`)
    },
    getPost(id) {
        return axios.get(`/posts/${id}`)
    },
    updateOne(id, post){
        return axios.put(`/posts/${id}`, post)
    },
    detele(id){
        return axios.delete(`/posts/${id}`)
    }
}


export default Post