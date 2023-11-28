<template>
    <h2 class="mt-2" style="text-align: center;">Cadastrar novo usuário</h2>

    <div class="row mt-3" style="width: 99.8%; margin-left: 0.2%;">
        <div class="col">
            <div class="form-floating">
                <input type="text" class="form-control" :id="colunaNoBanco[0]" :placeholder="placeholder[0]" v-model="form.name" required>
                <label :for="colunaNoBanco[0]">{{ placeholder[0] }}</label>
            </div>
        </div>
        <div class="col">
            <div class="form-floating">
                <input type="text" class="form-control" :id="colunaNoBanco[1]" :placeholder="placeholder[1]" v-model="form.email" required>
                <label :for="colunaNoBanco[1]">{{ placeholder[1] }}</label>
            </div>
        </div>
        <div class="col">
            <div class="form-floating">
                <select class="form-select" :id="colunaNoBanco[2]" v-model="form.admin" required>
                    <option v-for="option in optionsAdmin" v-bind:value="option.valor" >{{ option.descri }}</option>
                </select>
                <label :for="placeholder[2]">{{ placeholder[2] }}</label>
            </div>
        </div>
    </div>
    <div class="row mt-2" style="width: 99.8%; margin-left: 0.2%;">
        <div class="col">
            <div class="form-floating">
                <input type="password" class="form-control" :id="colunaNoBanco[3]" :placeholder="placeholder[3]" v-model="form.password" required>
                <label :for="colunaNoBanco[3]">{{ placeholder[3] }}</label>
            </div>
        </div>
        <div class="col">
            <div class="form-floating">
                <select class="form-select" :id="colunaNoBanco[4]" v-model="form.setor" required>
                    <option v-for="option in optionsSetores" v-bind:value="option.valor" >{{ option.descri }}</option>
                </select>
                <label :for="colunaNoBanco[4]">{{ placeholder[4] }}</label>
            </div>
        </div>
    </div>
    <div class="row mt-3" style="width: 99.8%; margin-left: 0.2%; text-align: center;">
        <div class="col">
            <button class="button-8" @click="submit">Enviar</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
    export default {
        data(){
            return{
                form: {
                    name: '',
                    email: '',
                    admin: '',
                    password: '',
                    setor: ''
                }
            }
        },
        computed: {
            placeholder(){
                return ["Nome:", "E-mail:", "É admin?", "Senha:", "Setor:"];
            },
            colunaNoBanco(){
                return ["name", "email", "admin", "password", "setor"];
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
            },
        },
        methods: {
            async submit(){
                try {
                    await axios.post(`${import.meta.env.VITE_DOTNET_IP}/auth/register`, this.form);
                    this.$router.push({path: '/usuarios'})
                } catch (error) {
                    if(error.response.data == 'This user already exists'){
                        alert("Esse usuário já existe.")
                    }
                    else{
                        alert("Erro ao cadastrar usuário. Favor tentar mais tarde.")
                    }
                }
            }
        }
    }
</script>