<template>
    <div class="d-flex flex-column flex-md-row align-items-center pt-3 pb-3 mb-4 border-bottom">
        <router-link to="/" class="d-flex gap-2 align-items-center link-body-emphasis text-decoration-none">
            <span class="fs-1">Brand</span>
        </router-link>

        <nav class="d-inline-flex gap-3 mt-2 mt-md-0 ms-md-auto">
            <router-link to="/" class="py-2 link-body-emphasis text-decoration-none">Посты</router-link>
            <router-link to="/albums" class="py-2 link-body-emphasis text-decoration-none">Альбомы</router-link>
            <router-link to="/todos" class="py-2 link-body-emphasis text-decoration-none">Задачи</router-link>
        </nav>
    </div>
</template>
<script>
export default {

}
</script>
<style scoped></style>