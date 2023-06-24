<template>
    <template v-if="!isLoading">
        <div class="cards">
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>
    </template>
    <template v-else>
        <Loader />
    </template>
</template>
<script>
import User from '@/services/user';
import PostCard from './PostCard.vue';
export default {
    components: {
        PostCard
    },
    data() {
        return {
            posts: [],
            isLoading: false
        }
    },
    mounted() {
        this.isLoading = true
        this.newArray()
            .then((array) => {
                this.isLoading = false
                this.posts = array
            })
    },
    methods: {
        async getUser(id) {
            const user = await User.getUser(id)
                .then((res) => {
                    return res.data
                })

            return user
        },
        async newArray() {
            const newArray = []
            if (await this.$store.state.post.posts) {
                let len = this.$store.state.post.posts.length;
                let arr = this.$store.state.post.posts
                for (let i = 0; i < len; i++) {
                    const element = arr[i];
                    let user = await this.getUser(element.userId).then(res => {
                        return res
                    })
                    newArray.push({
                        title: element.title,
                        body: element.body,
                        id: element.id,
                        user: user
                    })
                }
            }

            return newArray
        }
    },
}
</script>
<style></style>