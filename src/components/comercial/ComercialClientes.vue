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
        <form-floating :placeholder="'Código:'" :id="'codigo'" :type="'text'" v-model="codigo" v-on:keyup.enter="pesquisa(codigo, nome, results)"></form-floating>
        <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="nome" v-on:keyup.enter="pesquisa(codigo, nome, results)"></form-floating>
        <form-floating :placeholder="'Resultados:'" :id="'resultado'" :type="'number'" v-model="results" v-on:keyup.enter="pesquisa(codigo, nome, results)"></form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Código</th>
            <th>Nome</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="dado in dados" :key="dado.id">
            <td>
                <p>{{ dado.id }}</p>
            </td>
            <td>
                <p>{{ dado.cod }}</p>
            </td>
            <td>
                <p>{{ dado.nome }}</p>
            </td>
            <td>
                <button title="Ver" class="button-8" @click="abrirClienteModal(dado.cod)"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="clienteModal" :title="`${clienteInfo.nreduz}`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row mb-2">
            <div class="col-sm-1"><form-floating :placeholder="'ID:'" :id="'id'" :type="'text'" v-model="clienteInfo.cod" readonly></form-floating></div>
            <div class="col"><form-floating v-bind:style= "[clienteInfo.nome.toString().length > 80 || clienteInfo.nome.toString().length < 3 ? {'color': 'red'} : {'color': 'inherit'}]" :placeholder="`(${clienteInfo.nome.toString().length}) Nome:`" :id="'cod'" :type="'text'" v-model="clienteInfo.nome"></form-floating></div>
        </div>
        <div class="row mb-2">
            <div class="col-sm-2"><form-floating :placeholder="'Código Municipal:'" :id="'cod_mun'" :type="'text'" v-model="clienteInfo.cod_mun" ></form-floating></div>
            <div class="col"><form-floating :placeholder="'Endereço:'" :id="'end'" :type="'text'" v-model="clienteInfo.end" ></form-floating></div>
            <div class="col-sm-2"><form-floating :placeholder="'Município:'" :id="'mun'" :type="'text'" v-model="clienteInfo.mun" ></form-floating></div>
            <div class="col-sm-1"><form-floating :placeholder="'Estado:'" :id="'est'" :type="'text'" v-model="clienteInfo.est" ></form-floating></div>
            <div class="col-sm-1"><form-floating :placeholder="'CEP:'" :id="'cep'" :type="'text'" v-model="clienteInfo.cep" ></form-floating></div>
            <div class="col-sm-1"><form-floating :placeholder="'Cod. País:'" :id="'codpais'" :type="'text'" v-model="clienteInfo.codpais" ></form-floating></div>
        </div>
        <div class="row">
            <div class="col-sm-2"><form-floating :placeholder="'Grupo de venda:'" :id="'grpven'" :type="'text'" v-model="clienteInfo.grpven" ></form-floating></div>
            <div class="col-sm-1"><form-floating :placeholder="'Loja:'" :id="'loja'" :type="'text'" v-model="clienteInfo.loja" ></form-floating></div>
            <div class="col-sm-1"><form-floating :placeholder="'Tipo:'" :id="'tipo'" :type="'text'" v-model="clienteInfo.tipo" ></form-floating></div>
            <div class="col-sm-2"><form-floating :placeholder="'CGC:'" :id="'cgc'" :type="'text'" v-model="clienteInfo.cgc" ></form-floating></div>
            <div class="col-sm-1"><form-floating :placeholder="'Filial:'" :id="'filial'" :type="'text'" v-model="clienteInfo.filial" ></form-floating></div>
            <div class="col"><form-floating :placeholder="'Nome Reduzido:'" :id="'nreduz'" :type="'text'" v-model="clienteInfo.nreduz"></form-floating></div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharClienteModal()">Fechar</button>
        <button class="button-8 mt-2" @click="editarCliente()">Salvar</button>
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
        clienteModal: false,
        codigo: '',
        nome: '',
        results: '',
        popup: false,
        carregandoinfo: false,
        modalRelatorio: false,
        resultados: 0,
        dados: [],
        carregando: true,
        visualizar: {},
        clienteInfo: {
            nreduz: 'Carregando'
        }
    }
},
methods: {
    async editarCliente(){
        try {
            //console.log(this.clienteInfo.nome.toString().length)
            if(this.clienteInfo.nome.toString().length > 80 || this.clienteInfo.nome.toString().length < 3 || this.clienteInfo.cod_mun.toString().length){
                alert("Campo 'Nome' não pode ter mais de 80 caracteres e nem menos de 3 caracteres.");
                return null;
            }else{
                this.clienteModal = false;
                this.carregando = true;
                let jsonCliente = {};
                jsonCliente = {"A1_COD": this.clienteInfo.cod, "A1_NOME": this.clienteInfo.nome.toString().toUpperCase()};
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa1/api/update`, jsonCliente, config);
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa1/api/update-local`, jsonCliente, config);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa1`, config);
                this.dados = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
            }
        } catch (error) {
            console.log(error)
            this.carregando = false;
            alert("Erro ao alterar cadastro do cliente. Favor tentar novamente mais tarde")
        }
    },
    async fecharClienteModal(){
        this.clienteModal = false;
        this.carregandoinfo = false;
        this.clienteInfo = {};
        this.clienteInfo.nreduz = 'Carregando';
    },
    async abrirClienteModal(cod){
        try {
            this.carregandoinfo = true;
            this.clienteModal = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa1/${cod}`, config);
            this.clienteInfo = response.data;
            this.carregandoinfo = false;
        } catch (error) {
            console.log(error)
            this.carregandoinfo = false;
            alert("Falha ao abrir modal. Tente novamente mais tarde")
        }
    },
    async pesquisa(codigo, nome, results){
        try {
            this.carregando = true;
            if(!codigo){
                codigo = ''
            }
            if(!nome){
                nome = ''
            }
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa1-pesquisa?codigo=${codigo}&nome=${nome}&resultados=${results}`, config);
            this.dados = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            alert("Falha ao pesquisar. Favor tentar mais tarde.");
            this.carregando = false;
        }
    },
    async refresh(){
        try {
            this.carregando = true;
            await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa1-update`, config);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa1`, config);
            this.dados = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sa1`, config);
        this.dados = response.data;
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