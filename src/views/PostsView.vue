<template>
  <h1>Posts</h1>
  <template v-if="!isLoading">
    <Post />
  </template>
  <template v-else>
    <Loader />
  </template>
</template>
<script>
import Post from '@/components/Post.vue';
export default {
  components: {
    Post,
  },
  data() {
    return {
      isLoading: false
    }
  },
  mounted() {
    this.isLoading = true
    this.$store.dispatch('posts')
      .then(() => {
        this.isLoading = false
      })
  },
}
</script>
<style></style>