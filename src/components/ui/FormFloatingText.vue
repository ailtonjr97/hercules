<template>
    <div class="col">
        <div class="form-floating">
            <input type="text" class="form-control" :id="id" :placeholder="placeholder" :name="name" :value="value">
            <label :for="id">{{ placeholder }}</label>
        </div>
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
                default: 'Inserir ID aqui'
            },
            name: {
                type: String,
                required: true,
                default: 'Inserir Name aqui'
            },
            value: {
                type: String,
                required: true,
                default: ''
            }
        }
    }
</script>