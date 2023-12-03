<template>
<div class="row mt-2">
    <div class="col-md-4">
        <slot name="tableButtons"></slot>
    </div>
    <div class="col-lg-6">
    </div>
    <div class="col-sm-2">
        <button type="button" class="button-8" id="result" style="float: right; margin-right: 0;">
        <span class="counter-value">{{ resultados }}</span>
        resultados
        </button>
    </div>
    </div>
</template>

<script>
    export default {
        props: {
            resultados: {
                type: Number,
                required: true,
                default: 0
            }
        }
    }
</script>

<!-- <div class="col-md-4">
    <button class="button-8 mb-2" @click="openNewUserModal">Novo Usuário</button>
    <router-link class="button-8 mb-2" to="/usuarios/inativos">Inativos</router-link>
</div> -->