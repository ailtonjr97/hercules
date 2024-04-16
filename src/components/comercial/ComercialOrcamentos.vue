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
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="filial"     :id="'procuraBtn0'" :num="0" :placeholder="'Filial:'"          :type="'number'"> </form-floating>
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="numero"     :id="'procuraBtn1'" :num="1" :placeholder="'Número:'"          :type="'number'"> </form-floating>
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="dt_emissao" :id="'procuraBtn2'" :num="2" :placeholder="'Data de emissão:'" :type="'date'">   </form-floating>
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="cliente"    :id="'procuraBtn3'" :num="3" :placeholder="'Cliente:'"         :type="'text'">   </form-floating>
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="limit"      :id="'procuraBtn4'" :num="4" :placeholder="'Limite:'"          :type="'number'">   </form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Filial</th>
            <th>Número</th>
            <th>Data de Emissão</th>
            <th>Cliente</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis">
                <td>{{ api.R_E_C_N_O_ }}</td>
                <td>{{ api.CJ_FILIAL }}</td>
                <td>{{ api.CJ_NUM }}</td>
                <td>{{ api.CJ_EMISSAO }}</td>
                <td>{{ api.CJ_CLIENTE }}</td>
                <td><button title="Detalhes" class="button-8" @click="abrirClienteModal(dado.cod)"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button></td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="mostraErro" :title="`Erro:`" :textoPadrao="textoPad">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="this.mostraErro = false">Fechar</button>
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
        mostraErro: false,
        textoPad: '',
        filial: '',
        numero: '',
        dt_emissao: '',
        cliente: '',
        limit: null,
        mostraErro: false,
        novoModal: false,
        popup: false,
        disableBtn: false,
        carregandoinfo: false,
        resultados: 0,
        carregando: true,
        apis: [],
    }
},
methods: {
    async mostraModal(erro){
        this.mostraErro = true;
        this.textoPad = erro;
        this.carregando = false;
    },
    async refresh(){
        try {
            this.carregando = true;
            const token = document.cookie.replace('jwt=', '');
            let config = {
                headers: {
                    'Authorization': token
                }
            };
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos/created?filial=&numero=&dt_emissao=&cliente=&limit=100`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            this.mostraModal("Falha ao recarregar página.")
        }
    },
    async pesquisa(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos/created?filial=${this.filial}&numero=${this.numero}&dt_emissao=${this.dt_emissao}&cliente=${this.cliente}&limit=${this.limit}`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            console.log(error.response.status)
            if(error.response.status == 404){
                this.carregando = false;
                this.apis = [];
                this.resultados = 0;
            }else{
                this.mostraModal("Falha ao buscar resultados.");
            }
        }
    },
},
async created(){
        try {
            const token = document.cookie.replace('jwt=', '');
            let config = {
                headers: {
                    'Authorization': token
                }
            };
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos/created?filial=&numero=&dt_emissao=&cliente=&limit=100`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            alert("Erro ao carregar página. Favor tentar mais tarde.");
            this.carregando = false;
        }
    }
}
</script>