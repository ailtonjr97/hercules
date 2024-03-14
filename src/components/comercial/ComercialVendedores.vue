<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2" @click="refresh()">Atualizar</button>
        </template>
    </table-top>
    <div class="row mb-2">
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Filial:'"></table-search>
        <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Código:'"></table-search>
        <table-search :id="'procuraBtn3'" :num="3" :placeholder="'Nome:'"></table-search>
        <table-search :id="'procuraBtn4'" :num="4" :placeholder="'E-mail:'"></table-search>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Filial</th>
            <th>Código</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis">
            <td><p>{{ api.id }}</p></td>
            <td><p>{{ api.filial }}</p></td>
            <td><p>{{ api.cod }}</p></td>
            <td><p>{{ api.nome }}</p></td>
            <td><p>{{ api.email }}</p></td>
            <td>
                <button title="Editar" class="button-8" @click="openEditarModal(api.id)"><i style="font-size: 14px;" class="fa-solid fa-pen"></i></button>
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
                <form-floating :placeholder="'Endereço:'" :id="'end'" :type="'text'" v-model="vendedor[0].end"></form-floating>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'Bairro:'" :id="'bairro'" :type="'text'" v-model="vendedor[0].bairro"></form-floating>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'Município:'" :id="'mun'" :type="'text'" v-model="vendedor[0].mun"></form-floating>
            </div>
            <div class="col-sm-1">
                <form-floating :placeholder="'Estado:'" :id="'est'" :type="'text'" v-model="vendedor[0].est"></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'CEP:'" :id="'cep'" :type="'text'" v-model="vendedor[0].cep"></form-floating>
            </div>
            <div class="col-sm-1">
                <form-floating :placeholder="'DDD:'" :id="'dddtel'" :type="'text'" v-model="vendedor[0].dddtel"></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Telefone:'" :id="'tel'" :type="'text'" v-model="vendedor[0].tel"></form-floating>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharVendedorModal()">Fechar</button>
        <button class="button-8 mt-2" @click="salvarVendedorModal()">Salvar</button>
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
    async salvarVendedorModal(){
        try {
            if(this.vendedor[0].nome.toString().length > 40 || this.vendedor[0].nome.toString().length < 3 ||
            this.vendedor[0].email.toString().length > 100 || this.vendedor[0].email.toString().length < 3){
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
                    "A3_EMAIL": this.vendedor[0].email
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
    async openEditarModal(id){
        try {
            this.vendedorModal = true;
            this.carregandoinfo = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa3/vendedor/${id}`, config);
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa3`, config);
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