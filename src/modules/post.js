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
    }
}

const actions = {
    posts(context){
        return new Promise((resolve, reject) => {
            context.commit('startGetPosts')
            Post.getAll()
                .then((res) => {
                    resolve(res.data)
                    context.commit('successGetPosts', res.data)
                }).catch(err => {
                    reject(err)
                    context.commit('failurGetPosts')
                })
        })
    }
}


export default {
    state,
    actions,
    mutations
}