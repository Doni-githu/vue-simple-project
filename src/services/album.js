import axios from "axios"

const Album = {
    getAlbums(limit){
        return axios.get(`/albums?_limit=${limit}`)
    },
    delete(id){
        return axios.delete(`/albums/${id}`)
    },
    updateOne(id, album){
        return axios.patch(`/albums/${id}`, album)
    },
    getPhoto(){
        return axios.get(`/photos`)
    }
}

export default Album