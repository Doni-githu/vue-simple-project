import Post from "@/services/post";
const state = {
    posts: null,
    isLoading: false
}

const mutations = {
    startGetPosts(state) {
        state.isLoading = true
    },
    successGetPosts(state, payload){
        state.isLoading = false
        state.posts = payload
    },
    failurGetPosts(state){
        state.isLoading = false
    },
    startUpdatePost(state){
        state.isLoading = true
    },
    successUpdatePost(state){
        state.isLoading = false
    },
}

const actions = {
    posts(context, limit=10){
        return new Promise((resolve, reject) => {
            context.commit('startGetPosts')
            Post.getAll(limit)
                .then((res) => {
                    resolve(res.data)
                    context.commit('successGetPosts', res.data)
                }).catch(err => {
                    reject(err)
                    context.commit('failurGetPosts')
                })
        })
    },
    update(context, {id, post}){
        return new Promise((resolve, reject) => {
            context.commit('startUpdatePost')
            Post.updateOne(id, post)
                .then((res) => {
                    console.log(res)
                })
        })
    }
}


export default {
    state,
    actions,
    mutations
}