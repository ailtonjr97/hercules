<template>
    <div class="form-floating">
        <input :type="type" class="form-control" :id="id" :placeholder="placeholder" :name="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
        <label :for="id">{{ placeholder }}</label>
    </div>
</template>


<script>
    export default {
        props: {
            placeholder: {
                type: String,
                required: false,
                default: 'Inserir Placeholder'
            },
            id: {
                type: String,
                required: true,
                default: 'Inserir ID'
            },
            type: {
                type: String,
                required: true,
                default: "Inserir tipo do input"
            },
            modelValue: {
                type: String,
                required: true,
            }
        }
    }
</script>