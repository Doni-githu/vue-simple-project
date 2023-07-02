<template>
    <div class="filter">
        <Input :placeholder="'Названия поста'" v-model="termTitle" />
        <div class="relative">
            <div>
                <p @click="isShow = !isShow" style="cursor: pointer; color: var(--bs-gray);">По имени пользователя</p>
            </div>
            <div v-show="isShow" class="absolute">
                <label class="label2" v-for="(item, idx) in userName" :key="idx">
                    <input  type="checkbox" :value="item.txt" class="hid">
                    <span class="fake"></span>
                    <span @click="e => getName(e, item.id)" :class="{ 'active123': filterName.includes(item.txt) }"
                        style="width: 100%; ">{{
                            item.txt
                        }}</span>
                </label>
            </div>
        </div>
        <Input :placeholder="'Его ID'" v-model="termID" />
    </div>
    <div class="un"> </div>
    <div class="navigate">
        <div class="numbers">
            <input type="number" :value="limit" @input="getPosts">
        </div>
        <div>
            <button @click="onRefresh" class="btn btn-primary">
                <span>Обновить</span>
                <i class="fa-solid fa-arrows-rotate"></i>
            </button>
        </div>
        <div v-show="posts.filter(c => c.isSelect).length !== 0">
            <button @click="onDeletePosts" class="btn btn-danger d-flex gap-2 align-items-center">
                <span>Удалить {{ posts.filter(c => c.isSelect).length }}</span>
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
    <template v-if="!isLoading">
        <div class="cards">
            <PostCard
                v-for="post in FilterList(FilterList(FilterListByFilterName(posts), termTitle, 'title'), termID, 'id')"
                :key="post.id" :post="post" @onUpdate="onUpdateHandler" @onComment="onCommentHamdler" @onSelect="onSelect"
                @onDelete="onDeleteHandler" />
        </div>
    </template>
    <template v-else>
        <div class="mt-2">
            <Loader />
        </div>
    </template>
    <div v-show="isSeeComment" class="modal">
        <div class="modal-header d-flex justify-content-between flex">
            <h5>{{ postName }}</h5>
            <button class="btn" @click="isSeeComment = false">
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
        <div class="commnets">
            <div class="comment" v-for="comment in comments" :key="comment.id">
                <div class="top">
                    <img
                        src="https://fastly.picsum.photos/id/331/200/300.jpg?hmac=p5C3371_uSYqznhNsddJ6h1t3gMS35ijqJoWBTuBRIQ">
                    <div>
                        <p>{{ comment.name }}</p>
                        <p>{{ comment.email }}</p>
                    </div>
                </div>
                <p>{{ comment.body }}</p>
            </div>
        </div>
    </div>
    <div v-show="isWantEditPost" class="modal">
        <div class="modal-header" style="display: flex; justify-content: flex-end;">
            <button class="btn" @click="isWantEditPost = false">
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
        <div class="modal-body">
            <form class="modelForm" @submit.prevent>
                <template v-if="error">
                    <Alert :msg="error" />
                </template>
                <Input :placeholder="'Title'" v-model="title" />
                <Input :placeholder="'Body'" v-model="body" />
                <Input :placeholder="'User name'" v-model="name" />
                <div class="button">
                    <button @click="onEndEdit">Сохранить</button>
                </div>
            </form>
        </div>
    </div>
    <div v-show="isWantDeletePost" class="modal2">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Вы, и правда хотите удалить пост</h5>
            </div>
            <div class="modal-footer" style="display: flex; gap: 20px;">
                <button type="button" class="btn btn-success" @click="isWantDeletePost = false">Закрыть</button>
                <button type="button" class="btn btn-danger" @click="Delete">Удалить</button>
            </div>
        </div>
    </div>
</template>
<script>
import User from '@/services/user';
import Comment from "@/services/comments"
import PostCard from './PostCard.vue';
import Post from '@/services/post';
export default {
    components: {
        PostCard,
    },
    data() {
        return {
            posts: [],
            isLoading: false,
            comments: [],
            isSeeComment: false,
            isWantEditPost: false,
            name: '',
            title: '',
            isShow: false,
            userName: [],
            filterName: [],
            body: '',
            id: '',
            error: '',
            isWantDeletePost: false,
            limit: 0,
            postName: '',
            termTitle: '',
            termUserName: '',
            termID: ''
        }
    },
    mounted() {
        if (JSON.parse(localStorage.getItem('posts'))) {
            this.posts = JSON.parse(localStorage.getItem('posts'))
        } else {
            this.isLoading = true
            this.$store.dispatch('posts')
                .then((res) => {
                    this.newArray(res)
                        .then(res2 => {
                            localStorage.setItem('posts', JSON.stringify(res2))
                            this.isLoading = false
                            this.posts = res2
                        })
                })
        }
        this.limit = this.posts.length
        const str = []

        this.posts.forEach((item) => {
            str.push(item.user.name)
        })

        const newSet = new Set(str)
        const getArray = Array.from(newSet)
        const newArray = getArray.map((item, idx) => {
            return {
                txt: item,
                isSelect: false,
                id: idx
            }
        })
        this.userName = newArray
    },
    watch: {
        posts(newPosts) {
            const str = []

            newPosts.forEach((item) => {
                str.push(item.user.name)
            })

            const newSet = new Set(str)
            const getArray = Array.from(newSet)
            const newArray = getArray.map((item, idx) => {
                return {
                    txt: item,
                    isSelect: false,
                    id: idx
                }
            })
            this.userName = newArray
        }
    },
    methods: {
        FilterListByFilterName(array) {
            if (this.filterName.length === 0) {
                return array
            }
            const newArray = []
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                for (let j = 0; j < this.filterName.length; j++) {
                    const el = this.filterName[j];
                    if (el.txt === element.user.name) {
                        console.log(el)
                        newArray.push(element)
                    }
                }
            }
            return newArray
        },
        getPosts(e) {
            this.limit = e.target.value
            const limit = parseInt(e.target.value)
            this.isLoading = true
            this.$store.dispatch('posts', limit)
                .then((res) => {
                    this.newArray(res)
                        .then(res2 => {
                            this.isLoading = false
                            localStorage.setItem('posts', JSON.stringify(res2))
                            this.isLoading = false
                            this.posts = res2
                        })
                })
        },
        onRefresh() {
            this.isLoading = true
            this.$store.dispatch('posts')
                .then((res) => {
                    this.newArray(res)
                        .then(res2 => {
                            this.isLoading = false
                            localStorage.setItem('posts', JSON.stringify(res2))
                            this.isLoading = false
                            this.posts = res2
                        })
                })
        },
        async getUser(id) {
            const user = await User.getUser(id)
                .then((res) => {
                    return res.data
                })

            return user
        },
        async getComment() {
            try {
                const res = await Comment.allComment()
                return res.data
            } catch (error) {
                console.log(error)
            }
        },
        onUpdateHandler(id) {
            const found = this.posts.find(c => c.id === id)
            this.body = found.body
            this.title = found.title
            this.name = found.user.name
            this.id = id
            this.isWantEditPost = true
        },
        Delete() {
            const newArray = this.posts.filter(c => c.id !== parseInt(this.id))
            this.posts = newArray
            localStorage.setItem('posts', JSON.stringify(newArray))
            this.isWantDeletePost = false

        },
        onDeleteHandler(id) {
            this.id = id
            this.isWantDeletePost = true
        },
        onCommentHamdler(id) {
            const found = this.posts.filter(c => c.id === id)[0]
            this.comments = found.comments
            this.postName = found.title
            this.isSeeComment = true
        },
        getName(e, id) {
            let albums = this.userName.find(c => c.txt === e.target.textContent)

            if (!this.filterName.includes(albums)) {
                this.filterName.push(albums)
            } else {
                this.filterName = this.filterName.filter(c => c.id !== id)
            }
        },
        async newArray(array) {
            const newArray = []

            if (array) {
                const len = array.length;
                const arr = array
                for (let i = 0; i < len; i++) {
                    const element = arr[i];
                    const user = await this.getUser(element.userId)
                    const comment = await this.getComment()
                    newArray.push({
                        title: element.title,
                        body: element.body,
                        id: element.id,
                        user: user,
                        comments: comment,
                        isActiveComment: false,
                        isSelect: false,
                        isFavourite: false
                    })
                }
            }

            return newArray
        },
        FilterList(array, term, type) {
            if (term.length === 0) {
                return array
            }

            return array.filter(c => c[type].toString().toLowerCase().indexOf(term.toLowerCase()) > -1);
        },
        async onEndEdit() {
            if (!this.title || !this.body || !this.name) {
                this.error = "Все поля обязательны для заполнения"
                return
            }

            const updateOne = {
                id: parseInt(this.id),
                title: this.title,
                body: this.body,
                userId: 1
            }
            const newUpdatedArray = this.posts.map((item) => {
                if (item.id === parseInt(this.id)) {
                    return {
                        ...item,
                        title: this.title,
                        body: this.body,
                        user: {
                            name: this.name,
                        }
                    }
                }
                return item
            })

            this.posts = newUpdatedArray
            localStorage.setItem('posts', JSON.stringify(newUpdatedArray))
            this.isWantEditPost = false
            await Post.updateOne(this.id, updateOne)
            this.error = ''
            this.id = ''
        },
        onSelect({ id, prop }) {
            const changedList = this.posts.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        [prop]: !item[prop]
                    }
                }
                return item
            })
            this.posts = changedList
            localStorage.setItem('posts', JSON.stringify(changedList))
        },
        async onDeletePosts() {
            this.isLoading = true
            const newArray = this.posts.filter(c => c.isSelect)

            for (let i = 0; i < newArray.length; i++) {
                const element = newArray[i];
                this.posts = this.posts.filter(c => c.id !== element.id)
                localStorage.setItem('posts', JSON.stringify(this.posts))
                await Post.detele(element.id)
            }

            this.isLoading = false
        }
    },
}
</script>
<style>
.commnets {
    display: flex;
    height: 100%;
    overflow: auto;
    gap: 20px;
    flex-direction: column;
}

.filter {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-25%);
    background-color: #fff;
    z-index: 999;
    display: flex;
    gap: 20px;
    padding: 10px;
    width: 100%;
}

::-webkit-scrollbar {
    width: 2px;
    height: 5px;
}

.active123 {
    border: 1px solid var(--bs-primary) !important;
}

.commnets .comment {
    padding: 10px;
}

.un {
    height: 150px;
}

.commnets .comment .top {
    display: flex;
    gap: 10px;
}

.commnets .comment .top img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.modal2 {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9999;
    background-color: #d90429;
    padding: 20px;
    transform: translate(-50%, -50%);
}

.flex h5 {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.btn-primary {
    display: flex;
    gap: 8px;
    align-items: center;
}

.modal2 .modal-header {
    margin-bottom: 2rem;
    border-bottom: 2px solid #fff;
    color: #fff;
}

.modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.button {
    margin-top: 5px;
    text-align: center;
}

.button button {
    padding: 5px 1rem;
    border-radius: 7px;
    color: #000;
    border: none;
    background-color: #fff;
    transition: all 0.1s;
}

.button button:hover {
    opacity: .7;
}

.relative {
    border: 1px solid transparent;
    position: relative;
    top: 8px;
    padding: 10px;
    width: 200px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.relative:hover {
    border-color: var(--bs-primary);
    background-color: #fff;
}


.absolute {
    width: 200px;
    position: absolute;
    background-color: #fff;
    border: 1px solid var(--bs-primary);
    top: 100%;
    display: flex;
    flex-direction: column;
    left: 0;
}


.absolute .label2 {
    width: 100%;
    display: flex;
    padding: 20px 5px;
    gap: 8px;
    align-items: center;
    height: 100%;
}




.absolute .label2 .hid {
    display: none !important;
}

.absolute .label2 .fake {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid var(--bs-gray);
    position: relative;
}

.absolute .label2 .hid:checked+.fake::before {
    opacity: 1;
}

.absolute .label2 .fake::before {
    content: "";
    width: 20px;
    height: 20px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all .1s;
    background-image: url(../../public/img/checkbox.png);
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0;
}
.navigate {
    position: fixed;
    padding: 10px;
    left: 8%;
    z-index: 999;
    padding: 20px;
    top: 35%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #3a86ff;
}

.navigate .numbers input {
    width: 100%;
    border: none;
    background-color: transparent;
    border-radius: 5px;
    outline: 2px solid #3a86ff;
    color: #3a86ff;
    -moz-appearance: textfield;
}

.navigate .numbers input::-webkit-inner-spin-button,
.navigate .numbers input::-webkit-outer-spin-button {
    -webkit-appearance: none;
}

.modelForm {
    width: 50%;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 17px;
}

.cards {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    gap: 10px;
    align-items: center;
}

#app {
    position: relative;
}

p {
    margin: 0;
}

.modal {
    width: 650px;
    border-radius: 12px;
    background-color: #3a86ff;
    height: 500px;
    position: fixed;
    top: 50%;
    left: 50%;
    display: block;
    transform: translate(-50%, -50%);
    border: 2px solid rgba(255, 225, 225, 0.2);
    color: #fff;
}

.fa-x {
    color: white;
}

@media only screen and (max-width:1232px) {
    .navigate {
        left: 0;
    }
}

@media only screen and (max-width:1000px) {
    .navigate {
        top: 10%;
    }
}

@media only screen and (max-width: 976px) {
    .filter {
        display: grid;
        left: 470px;
        grid-template-columns: auto;
    }

    .un {
        height: 200px;
    }
}

@media only screen and (max-width:681px) {
    .modal {
        width: 80%;
    }

    .modelForm {
        width: 100%;
    }
}

@media only screen and (max-width:554px) {
    .navigate {
        left: 30% !important;
    }

    .filter {
        top: 350px;
        left: 50%;
    }

    .un {
        height: 400px;
    }
}
</style>
