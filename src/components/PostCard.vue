<template>
    <div class="my-card">
        <img src="https://picsum.photos/300/150">
        <p class="my-card-title">{{ post.title }}</p>
        <div class="body">
            <p>{{ post.body }}</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        post: {
            type: Object,
            require: true
        }
    }
}
</script>
<style></style>