<template>
    <div class="card-container" :class="{ 'active-card': post.isFavourite }">
        <div class="left">
            <div class="label">
                <input :id="post.id" :checked="post.isSelect" type="checkbox" class="hid">
                <span @click="() => change({ id: post.id, prop: 'isSelect' })" :class="{ 'active2': post.isFavourite }"
                    class="fake"></span>
            </div>
            <div class="my-card">
                <div class="txt">
                    <template v-if="post.body">
                        <div>
                            <p class="my-card-title">{{ post.title }}</p>
                        </div>
                        <div class="body">
                            <p>{{ post.body }}</p>
                        </div>
                    </template>
                    <template v-else>
                        <div >
                            <p class="my-card-title" @click="$router.push({name: 'album', params: {id: post.id}})">{{ post.title }}</p>
                        </div>
                    </template>
                </div>
                <div class="profile">
                    <img src="https://fastly.picsum.photos/id/331/200/300.jpg?hmac=p5C3371_uSYqznhNsddJ6h1t3gMS35ijqJoWBTuBRIQ"
                        :alt="post.user.name">
                    <p>{{ post.user.name }}</p>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="right-container">
                <button @click="$emit('onUpdate', post.id)" class="btn btn-outline-success">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button @click="$emit('onComment', post.id)" class="btn btn-outline-primary">
                    <i class="fa-solid fa-comment"></i>
                </button>
                <template v-if="post.isSelect">
                    <button @click="$emit('onSelect', { id: post.id, prop: 'isFavourite' })"
                        class="btn btn-outline-warning">
                        <i class="fa-solid fa-star"></i>
                    </button>
                    <button @click="$emit('onDelete', post.id)" class="btn btn-outline-danger">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import post from '@/modules/post';

export default {
    props: {
        post: {
            type: Object,
            require: true
        }
    },
    methods: {
        change({ id, prop }) {
            this.$emit('onSelect', { id, prop })
        },
    },
}
</script>
<style>
.card-container .label {
    display: inline-block;
    position: relative;
    cursor: pointer;
    font-size: 16px;
}

.card-container .label input {
    display: none;
    cursor: pointer;
    position: absolute;
}

.btn-outline-warning:hover {
    color: #fff !important;
}

.active-card {
    background-color: rgba(200, 200, 200, 0.1);
}

.right {
    width: 50px;
    right: -50px;
}

.right.active-right {
    width: 50px;
    visibility: visible;
}

.card-container {
    display: flex;
    transition: all 0.2s;
    align-items: flex-end;
    position: relative;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
}



.right-container {
    display: flex;
    gap: 7px;
    flex-direction: column;
}

.card-container .label .fake {
    display: inline-block;
    width: 25px;
    height: 25px;
    border: 1px solid gainsboro;
    border-radius: 5px;
    position: relative;
}

.card-container .label input:checked+.fake::before {
    opacity: 1 !important;
}


.card-container .label .fake::before {
    display: block;
    content: "";
    background-image: url(../../public/img/checkbox.png);
    background-size: cover;
    opacity: 0;
    transition: all 0.2s;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    width: 25px;
    height: 25px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.my-card {
    width: 450px;
    height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://fastly.picsum.photos/id/1052/500/700.jpg?hmac=Kucmieo1fI1Doj10eSl6nYPaGbxPrk7XzznGUhzcTuk');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    padding: 10px;
    border-radius: 10px;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
    justify-content: flex-end;
    color: #fff;
}



.my-card .txt {
    width: 100%;

}

.my-card .profile {
    width: 100%;
    display: flex;
    gap: 20px;
    align-items: center;
}

.my-card .profile p {
    margin: 0;
}

.my-card .profile img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
}

.my-card-title {
    display: block;
    font-size: 20px;
    color: whitesmoke;
    width: 100%;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif !important;
    font-weight: 700;
}

.body {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: whitesmoke;
}

@media only screen and (max-width:527px) {
    .my-card{
        width: 200px;
    }
}
</style>