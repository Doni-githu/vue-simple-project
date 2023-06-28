<template>
    <div class="todo" :class="{'end': todo.completed}">
        <label>
            <input type="checkbox" class="hid">
            <span @click="$emit('isSelect', todo.id)" class="fake"></span>
        </label>
        <p>{{ todo.title }}</p>
        <div style="display: flex; gap: 10px;">
            <button @click="$emit('onStartEdit', todo.id)" class="btn btn-outline-success">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <template v-if="todo.isSelect">
                <button @click="$emit('onDelete', todo.id)" class="btn btn-outline-danger">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        todo: {
            type: Object,
            required: true
        }
    },
}
</script>
<style scoped>
label input {
    display: none;
}

label .fake {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid var(--bs-gray);
    position: relative;
}

label input:checked+.fake::before {
    opacity: 1 !important;
}

label .fake::before {
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


.todo {
    padding: 8px 16px;
    border: 1px solid var(--bs-gray);
    border-radius: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.end {
    text-decoration: line-through !important;
}
</style>