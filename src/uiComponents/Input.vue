<template>
    <input class="custom" :placeholder="placeholder" :name="placeholder" :value="modelValue"
        @change="(e) => $emit('update:modelValue', e.target.value)" type="text">
</template>
<script>
export default {
    name: 'Input',
    props: {
        placeholder: String,
        modelValue: [String],
    }
}
</script>
<style>
.custom {
    padding: 7px 12px;
    border: none;
    border-radius: 8px;
}

.custom:focus {
    outline: none;
}

.custom::placeholder {
    color: var(--bs-gray);
}
</style>