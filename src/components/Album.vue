<template>
    <div class="filter">
        <Input :placeholder="'Названия поста'" v-model="termTitle" />
        <div class="relative">
            <div>
                <p @click="isShow = !isShow" style="cursor: pointer; color: var(--bs-gray);">По имени пользователя</p>
            </div>
            <div v-show="isShow" class="absolute">
                <label class="label2" v-for="(item, idx) in userName" :key="idx">
                    <input type="checkbox" :value="item.txt" class="hid">
                    <span class="fake"></span>
                    <span @click="e => getName(e)">{{ item.txt }}</span>
                </label>
            </div>
        </div>
        <Input :placeholder="'Его ID'" v-model="termID" />
    </div>
    <div class="un"> </div>
    <div class="navigate">
        <div class="numbers">
            <input type="number" :value="limit" @input="getAlbums">
        </div>
        <div>
            <button @click="onRefresh" class="btn btn-primary">
                <span>Обновить</span>
                <i class="fa-solid fa-arrows-rotate"></i>
            </button>
        </div>
        <div v-show="albums.filter(c => c.isSelect).length !== 0">
            <button @click="onDeletealbums" class="btn btn-danger d-flex gap-2 align-items-center">
                <span>Удалить {{ albums.filter(c => c.isSelect).length }}</span>
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
    <template v-if="!isLoading">
        <div class="cards">
            <PostCard
                v-for="post in FilterList(FilterList(FilterListByFilterName(albums), termTitle, 'title'), termID, 'id')"
                :key="post.id" :post="post" @onUpdate="onUpdateHandler" @onSelect="onSelect" @onDelete="onDeleteHandler" />
        </div>
    </template>
    <template v-else>
        <Loader />
    </template>
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
import PostCard from './PostCard.vue';
import User from '@/services/user';
import Album from '@/services/album';

export default {
    data() {
        return {
            albums: [],
            isLoading: false,
            isSeeComment: false,
            isWantEditPost: false,
            name: "",
            title: "",
            body: "",
            id: "",
            error: "",
            isWantDeletePost: false,
            limit: 0,
            postName: "",
            isShow: false,
            termTitle: "",
            termID: "",
            userName: [],
            filterName: []
        };
    },
    mounted() {
        if (JSON.parse(localStorage.getItem("albums"))) {
            this.albums = JSON.parse(localStorage.getItem("albums"));
            this.limit = this.albums?.length;
        }
        else {
            this.isLoading = true;
            this.$store.dispatch("albums")
                .then((res) => {
                    this.newArray(res)
                        .then(res2 => {
                            console.log(res2);
                            localStorage.setItem("albums", JSON.stringify(res2));
                            this.isLoading = false;
                            this.albums = res2;
                            this.limit = this.albums?.length;
                        });
                });
        }

        const str = []

        this.albums.forEach((item) => {
            str.push(item.user.name)
        })

        const newSet = new Set(str)
        const getArray = Array.from(newSet)
        const newArray = getArray.map(item => {
            return {
                txt: item,
                isSelect: false
            }
        })
        this.userName = newArray
    },
    methods: {
        getAlbums(e) {
            this.limit = e.target.value;
            const limit = parseInt(e.target.value);
            this.isLoading = true;
            this.$store.dispatch("albums", limit)
                .then((res) => {
                    this.newArray(res)
                        .then(res2 => {
                            this.isLoading = false;
                            localStorage.setItem("albums", JSON.stringify(res2));
                            this.isLoading = false;
                            this.albums = res2;
                        });
                });
        },
        onRefresh() {
            this.isLoading = true;
            this.$store.dispatch("albums")
                .then((res) => {
                    this.newArray(res)
                        .then(res2 => {
                            this.isLoading = false;
                            localStorage.setItem("albums", JSON.stringify(res2));
                            this.isLoading = false;
                            this.albums = res2;
                        });
                });
        },
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
        async getUser(id) {
            const user = await User.getUser(id)
                .then((res) => {
                    return res.data;
                });
            return user;
        },
        async getComment() {
            try {
                const res = await Comment.allComment();
                return res.data;
            }
            catch (error) {
                console.log(error);
            }
        },
        onUpdateHandler(id) {
            const found = this.albums.find(c => c.id === id);
            this.body = found.body;
            this.title = found.title;
            this.name = found.user.name;
            this.id = id;
            this.isWantEditPost = true;
        },
        Delete() {
            const newArray = this.albums.filter(c => c.id !== parseInt(this.id));
            this.albums = newArray;
            localStorage.setItem("albums", JSON.stringify(newArray));
            this.isWantDeletePost = false;
        },
        onDeleteHandler(id) {
            this.id = id;
            this.isWantDeletePost = true;
        },
        async newArray(array) {
            const newArray = [];
            if (array) {
                const len = array.length;
                const arr = array;
                for (let i = 0; i < len; i++) {
                    const element = arr[i];
                    const user = await this.getUser(element.userId)
                        .then(res => {
                            return res;
                        });
                    newArray.push({
                        title: element.title,
                        id: element.id,
                        user: user,
                        isActiveComment: false,
                        isSelect: false,
                        isFavourite: false
                    });
                }
            }
            return newArray;
        },
        FilterList(array, term, type) {
            if (term.length === 0) {
                return array;
            }

            return array.filter(c => c[type].toString().toLowerCase().indexOf(term.toLowerCase()) > -1);
        },
        async onEndEdit() {
            if (!this.title || !this.name) {
                this.error = "Все поля обязательны для заполнения";
                return;
            }
            const updateOne = {
                id: parseInt(this.id),
                title: this.title,
                body: this.body,
                userId: 1
            };
            const newUpdatedArray = this.albums.map((item) => {
                if (item.id === parseInt(this.id)) {
                    return {
                        ...item,
                        title: this.title,
                        body: this.body,
                        user: {
                            ...item.user,
                            name: this.name,
                        }
                    };
                }
                return item;
            });
            this.albums = newUpdatedArray;
            localStorage.setItem("albums", JSON.stringify(newUpdatedArray));
            this.isWantEditPost = false;
            this.error = "";
            await Album.updateOne(updateOne.id, updateOne);
            this.id = "";
        },
        onSelect({ id, prop }) {
            const changedList = this.albums.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        [prop]: !item[prop]
                    };
                }
                return item;
            });
            this.albums = changedList;
            localStorage.setItem("albums", JSON.stringify(changedList));
        },
        async onDeletealbums() {
            this.isLoading = true;
            const newArray = this.albums.filter(c => c.isSelect);
            for (let i = 0; i < newArray.length; i++) {
                const element = newArray[i];
                this.albums = this.albums.filter(c => c.id !== element.id);
                localStorage.setItem("albums", JSON.stringify(this.albums));
                await Album.delete(element.id);
            }
            this.isLoading = false;
        },
        getName(e) {
            let albums = this.userName.find(c => c.txt === e.target.textContent)

            if (this.filterName.includes(albums)) {
                this.filterName.shift()
                return
            }
            this.filterName.push(albums)
        }
    },
    components: { PostCard }
}
</script>
<style scoped>
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
}


.absolute {
    width: 200px;
    position: absolute;
    border: 1px solid var(--bs-primary);
    top: 100%;
    display: flex;
    flex-direction: column;
    left: 0;
}

.absolute .label2 .hid {
    display: none !important;
}



.absolute .label2 {
    width: 100%;
    display: flex;
    padding: 20px 5px;
    gap: 8px;
    align-items: center;
    height: 100%;
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
</style>    