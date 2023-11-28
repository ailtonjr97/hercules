<template>
    <h2 class="mt-2" style="text-align: center;">Cadastrar novo usuário</h2>
    <div class="row mt-3" style="width: 99.8%; margin-left: 0.2%;">
        <form-floating-text :placeholder="placeholder[0]" :id="colunaNoBanco[0]" :name="colunaNoBanco[0]" :value="value"></form-floating-text>
        <form-floating-text :placeholder="placeholder[1]" :id="colunaNoBanco[1]" :name="colunaNoBanco[1]" :value="value"></form-floating-text>
        <select-floating :placeholder="placeholder[2]" :id="colunaNoBanco[2]" :name="colunaNoBanco[2]" :options="optionsAdmin"></select-floating>
    </div>
    <div class="row mt-2" style="width: 99.8%; margin-left: 0.2%;">
        <select-floating :placeholder="placeholder[4]" :id="colunaNoBanco[4]" :name="colunaNoBanco[4]" :options="optionsSetores"></select-floating>
        <form-floating-password :placeholder="placeholder[3]" :id="colunaNoBanco[2]" :name="colunaNoBanco[2]" :value="value"></form-floating-password>
    </div>
</template>

<script>
import FormFloatingText from '../ui/FormFloatingText.vue';
import SelectFloating from '../ui/SelectFloating.vue';
import FormFloatingPassword from '../ui/FormFloatingPassword.vue';

    export default {
        components:{
            FormFloatingText,
            SelectFloating,
            FormFloatingPassword
        },
        computed: {
            placeholder(){
                return ["Nome:", "E-mail:", "É admin?", "Senha:", "Setor:"];
            },
            colunaNoBanco(){
                return ["name", "email", "admin", "password", "setor"];
            },
            value(){
                return "";
            },
            optionsAdmin(){
                return [{valor: 0, descri: 'Não'}, {valor: 1, descri: 'Sim'}];
            },
            optionsSetores(){
                return [
                    {valor: "ti", descri: 'Tecnologia da Informação'},
                    {valor: "edp", descri: 'Engenharia de Processos'},
                    {valor: "controladoria", descri: 'Controladoria'},
                    {valor: "qualidade", descri: 'Qualidade'},
                    {valor: "pcp", descri: 'PCP'},
                    {valor: "produção", descri: 'Produção'},
                ];
            }
        }
    }
</script>