<template>
    <h2 class="mt-2" style="text-align: center;">Cadastrar novo usuário</h2>
    <div class="row mt-3">
        <form-floating-text :placeholder="placeholder[0]" :id="colunaNoBanco[0]" :name="colunaNoBanco[0]" :value="value"></form-floating-text>
        <form-floating-text :placeholder="placeholder[1]" :id="colunaNoBanco[1]" :name="colunaNoBanco[1]" :value="value"></form-floating-text>
        <select-floating :placeholder="placeholder[2]" :id="colunaNoBanco[2]" :name="colunaNoBanco[2]" :options="options"></select-floating>
    </div>
</template>

<script>
    export default {
        computed: {
            placeholder(){
                return ["Nome:", "E-mail:", "É admin?"];
            },
            colunaNoBanco(){
                return ["name", "email", "admin"];
            },
            value(){
                return "";
            },
            options(){
                const options = [{valor: 0, descri: 'Não'}, {valor: 1, descri: 'Sim'}];
                return options
            }
        }
    }
</script>