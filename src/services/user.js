import axios from "./axios";


const User = {
    getUser(id){
        return axios.get(`/users/${id}`)
    }
}

export default User