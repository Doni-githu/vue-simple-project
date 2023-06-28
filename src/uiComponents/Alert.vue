<template>
    <div class="alert alert-danger" role="alert">
        {{ msg }}
    </div>
</template>
<script>
export default {
    props: {
        msg: String
    },
    name: 'Alert'
}
</script>
<style></style>