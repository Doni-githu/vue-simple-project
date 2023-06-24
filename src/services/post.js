import axios from "./axios";

const Post = {
    getAll(limit = 10) {
        return axios.get(`/posts?_limit=${limit}`)
    },
    getPost(id) {
        return axios.get(`/posts/${id}`)
    }
}


export default Post