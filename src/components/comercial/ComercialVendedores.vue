<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados" :class="'mb-2'">
        <template v-slot:tableButtons>
            <!-- <button class="button-8 mb-2" @click="refresh()">Atualizar</button> -->
        </template>
    </table-top>
    <div class="row mb-2">
        <form-floating :placeholder="'Código:'" :id="'cod'" :type="'text'" v-model="codigo" v-on:keyup.enter="pesquisa(codigo, nome, email)"></form-floating>
        <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="nome" v-on:keyup.enter="pesquisa(codigo, nome, email)"></form-floating>
        <form-floating :placeholder="'E-mail:'" :id="'email'" :type="'text'" v-model="email" v-on:keyup.enter="pesquisa(codigo, nome, email)"></form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>Filial</th>
            <th>Código</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis">
            <td><p>{{ api.filial }}</p></td>
            <td><p>{{ api.cod }}</p></td>
            <td><p>{{ api.nome }}</p></td>
            <td><p>{{ api.email }}</p></td>
            <td>
                <button title="Editar" class="button-8" @click="openEditarModal(api.cod)"><i style="font-size: 14px;" class="fa-solid fa-pen"></i></button>
                <button title="Excluir" class="button-8" @click="openExcluirModal(api.filial, api.cod, api.nome)"><i style="font-size: 14px;" class="fa-solid fa-trash"></i></button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="vendedorModal" :title="`${vendedor[0].nreduz}`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row mb-2">
            <div class="col-sm-1">
                <form-floating :placeholder="'Filial:'" :id="'filial'" :type="'text'" v-model="vendedor[0].filial" readonly></form-floating>
            </div>
            <div class="col-sm-1">
                <form-floating :placeholder="'Código:'" :id="'cod'" :type="'text'" v-model="vendedor[0].cod" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating v-bind:style= "[vendedor[0].nome.toString().length > 40 || vendedor[0].nome.toString().length < 3 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].nome.toString().length}) Nome:`" :id="'nome'" :type="'text'" v-model="vendedor[0].nome"></form-floating>
            </div>
            <div class="col-sm-3">
                <form-floating v-bind:style= "[vendedor[0].email.toString().length > 100 || vendedor[0].email.toString().length < 3 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].email.toString().length}) E-mail:`" :id="'email'" :type="'text'" v-model="vendedor[0].email"></form-floating>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-2">
                <form-floating v-bind:style= "[vendedor[0].end.toString().length > 40 || vendedor[0].end.toString().length < 3 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].end.toString().length}) Endereço:`" :id="'end'" :type="'text'" v-model="vendedor[0].end"></form-floating>
            </div>
            <div class="col-sm-2">
                <form-floating v-bind:style= "[vendedor[0].bairro.toString().length > 20 || vendedor[0].bairro.toString().length < 3 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].bairro.toString().length}) Bairro:`" :id="'bairro'" :type="'text'" v-model="vendedor[0].bairro"></form-floating>
            </div>
            <div class="col-sm-2">
                <form-floating v-bind:style= "[vendedor[0].mun.toString().length > 15 || vendedor[0].mun.toString().length < 3 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].mun.toString().length}) Município:`" :id="'mun'" :type="'text'" v-model="vendedor[0].mun"></form-floating>
            </div>
            <div class="col-sm-1">
                <form-floating v-bind:style= "[vendedor[0].est.toString().length > 2 || vendedor[0].est.toString().length <= 1 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].est.toString().length}) UF:`" :id="'est'" :type="'text'" v-model="vendedor[0].est"></form-floating>
            </div>
            <div class="col">
                <form-floating v-bind:style= "[vendedor[0].cep.toString().length > 8 || vendedor[0].cep.toString().length < 3 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].cep.toString().length}) CEP:`" :id="'cep'" :type="'number'" v-model="vendedor[0].cep"></form-floating>
            </div>
            <div class="col-sm-2">
                <form-floating v-bind:style= "[vendedor[0].dddtel.toString().length > 3 || vendedor[0].dddtel.toString().length < 1 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].dddtel.toString().length}) DDD:`" :id="'dddtel'" :type="'text'" v-model="vendedor[0].dddtel"></form-floating>
            </div>
            <div class="col">
                <form-floating v-bind:style= "[vendedor[0].tel.toString().length > 15 || vendedor[0].tel.toString().length < 7 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${vendedor[0].tel.toString().length}) Telefone:`" :id="'tel'" :type="'text'" v-model="vendedor[0].tel"></form-floating>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharVendedorModal()">Fechar</button>
        <button class="button-8 mt-2" @click="salvarVendedorModal()">Salvar</button>
    </template>
</modal>

<modal v-if="excluirModal" :title="`Excluir`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row mb-2">
            <h1 style="text-align: center;">{{ excluir.nome }}</h1>
            <h4 style="text-align: center;">Deseja realmente excluir esse usuário?</h4>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="excluirModal = false">Não</button>
        <button class="button-8 mt-2" @click="excluirVendedor()">Sim</button>
    </template>
</modal>

</template>

<script>
const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

import axios from 'axios';

import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';
import TextareaFloating from '../ui/TextareaFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';
import Popup from '../ui/Popup.vue';

export default {
components: {
    Popup,
    TableTop,
    TableSearch,
    Modal,
    Loading,
    FormFloating,
    TextareaFloating,
    SelectFloating
},
data(){
    return{
        codigo: '',
        nome: '',
        email: '',
        excluir: {
            "filial": '',
            "cod": '',
            "nome": ''
        },
        excluirModal: false,
        vendedorModal: false,
        popup: false,
        carregandoinfo: false,
        resultados: 0,
        carregando: true,
        apis: [],
        carregandoinfo: false,
        vendedor: {}
    }
},
methods: {
    async pesquisa(codigo, nome, email){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa3/pesquisa?codigo=${codigo}&nome=${nome}&email=${email}`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            this.carregando = false;
            alert("Falha ao pesquisar. Favor tentar mais tarde.");
            this.carregando = false;
        }
    },
    async excluirVendedor(){
        try {
            this.carregandoinfo = false;
            this.excluirModal = false;
            this.carregando = true;
            let jsonCliente = {};
            jsonCliente = {
                "A3_FILIAL": this.excluir.filial, 
                "A3_COD": this.excluir.cod,
            };
            await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa3/api/delete`, jsonCliente, config);
            this.refresh()
        } catch (error) {
            this.carregandoinfo = false;
            this.excluirModal = false;
            this.carregando = false;
            alert("Erro ao executar ação. Favor tente novamente mais tarde.")
        }
    },
    async openExcluirModal(filial, cod, nome){
        try {
            this.excluir.filial = filial;
            this.excluir.cod = cod;
            this.excluir.nome = nome;
            this.carregandoinfo = true;
            this.excluirModal = true;
            this.carregandoinfo = false;
        } catch (error) {
            this.carregandoinfo = false;
            this.excluirModal = false;
            alert("Erro ao executar ação. Favor tente novamente mais tarde.")
        }
    },
    async salvarVendedorModal(){
        try {
            if(this.vendedor[0].nome.toString().length > 40 || this.vendedor[0].nome.toString().length < 3 ||
            this.vendedor[0].email.toString().length > 100 || this.vendedor[0].email.toString().length < 3 ||
            this.vendedor[0].end.toString().length > 40 || this.vendedor[0].end.toString().length < 3 ||
            this.vendedor[0].bairro.toString().length > 20 || this.vendedor[0].bairro.toString().length < 3 ||
            this.vendedor[0].mun.toString().length > 15 || this.vendedor[0].mun.toString().length < 3 ||
            this.vendedor[0].est.toString().length > 2 || this.vendedor[0].est.toString().length <= 1 ||
            this.vendedor[0].cep.toString().length > 8 || this.vendedor[0].cep.toString().length < 3 ||
            this.vendedor[0].dddtel.toString().length > 3 || this.vendedor[0].dddtel.toString().length < 1 ||
            this.vendedor[0].tel.toString().length > 15 || this.vendedor[0].tel.toString().length < 7
            ){
                alert("Favor preencher de forma correta os campos em vermelho.");
                return null;
            }else{
                this.vendedorModal = false;
                this.carregando = true;
                let jsonCliente = {};
                jsonCliente = {
                    "A3_FILIAL": this.vendedor[0].filial, 
                    "A3_COD": this.vendedor[0].cod, 
                    "A3_NOME": this.vendedor[0].nome,
                    "A3_EMAIL": this.vendedor[0].email,
                    "A3_END": this.vendedor[0].end,
                    "A3_BAIRRO": this.vendedor[0].bairro,
                    "A3_MUN": this.vendedor[0].mun,
                    "A3_EST": this.vendedor[0].est,
                    "A3_CEP": this.vendedor[0].cep,
                    "A3_DDDTEL": this.vendedor[0].dddtel,
                    "A3_TEL": this.vendedor[0].tel,
                };
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa3/api/update`, jsonCliente, config);
                jsonCliente = {};
                this.refresh()
            }
        } catch (error) {
            jsonCliente = {};
            this.carregando = false;
            this.carregandoinfo = false;
            alert("Erro ao alterar cadastro do cliente. Favor tentar novamente mais tarde");
        }
    },
    async openEditarModal(cod){
        try {
            this.carregandoinfo = true;
            this.vendedorModal = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa3/pesquisa?codigo=${cod}`, config);
            this.vendedor = response.data;
            this.carregandoinfo = false;
        } catch (error) {
            alert("Falha ao mostrar informações. Favor tentar novamente mais tarde.");
        }
    },
    async fecharVendedorModal(){
        this.carregandoinfo = false;
        this.vendedorModal = false;
        this.vendedor = {};
    },
    async refresh(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa3/update`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
            this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
            }, 2000);
        } catch (error) {
            alert("Falha ao recarregar página.");
            this.carregando = false;
        }
    },
},
async created(){
    try {
        const config = {
            headers: {
            'Authorization': document.cookie,
            }
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa3/pesquisa`, config);
        console.log(response.data)
        this.apis = response.data;
        this.resultados = response.data.length;
        this.carregando = false;
    } catch (error) {
        console.log(error)
        alert("Erro ao carregar página. Favor tentar mais tarde.");
        this.carregando = false;
    }
}
}
</script>