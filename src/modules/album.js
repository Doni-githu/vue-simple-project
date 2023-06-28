import Album from "@/services/album";

const state = {
    isLoading: false,
    albums: null
}

const mutations = {
    startGetAlbums(state) {
        state.isLoading = true
    },
    successGetAlbums(state, payload) {
        state.isLoading = false
        state.albums = payload
    },
    failurGetAlbums(state) {
        state.isLoading = false
    }
}

const actions = {
    albums(context, limit = 10) {
        return new Promise((resolve) => {
            context.commit('startGetAlbums')
            Album.getAlbums(limit)
                .then((res) => {
                    context.commit('successGetAlbums', res.data)
                    resolve(res.data)
                }).catch((error) => {
                    console.log(error)
                    context.commit('failurGetAlbums')
                })
        })
    }
}




export default {
    state,
    actions,
    mutations
}