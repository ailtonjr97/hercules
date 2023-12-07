<template>
        <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
                <button class="button-8 mb-2" to="/qualidade/documentos">Documento Ativos</button>
                <router-link to="/qualidade/documentos/arquivados" class="button-8">Arquivados</router-link>
            </template>
        </table-top>
        <div class="row mb-2">
            <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
            <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Tipo Documento:'"></table-search>
            <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Data:'"></table-search>
            <table-search :id="'procuraBtn3'" :num="3" :placeholder="'Inspetor:'"></table-search>
        </div>
        <div class="table-wrapper table-responsive table-striped">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>ID</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Inspetor</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="documento in documentos" :key="documento.id">
                <td>
                    <p>{{ documento.id }}</p>
                </td>
                <td>
                    <p>{{ documento.tipo_doc }}</p>
                </td>
                <td>
                    <p>{{ documento.data }}</p>
                </td>
                <td>
                    <p>{{ documento.inspetor }}</p>
                </td>
                <td>
                    <button class="button-8" @click="verDocumento(documento.id)">Visualizar</button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';
import TextareaFloating from '../ui/TextareaFloating.vue';
import Topbar from '../navbar/Topbar.vue';
import AnexFloating from '../ui/AnexFloating.vue';

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

export default {
    components: {
        Topbar,
        TableTop,
        TableSearch,
        Modal,
        Loading,
        FormFloating,
        SelectFloating,
        TextareaFloating,
        AnexFloating
    },
    data(){
        return{
            modalNc: false,
            carregando: true,
            documentos: [],
            fullLoad: false,
            modalVerDocumento: false,
            carregandoinfo: false,
            visualizar: {},
        }
    },
    methods: {
        async closeVerDocumento(){
            this.modalVerDocumento = false;
        },
        async verDocumento(id){
            try {
                this.carregandoinfo = true;
                this.modalVerDocumento = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/${id}`, config);
                this.visualizar = response.data[0];
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                alert('Erro ao mostrar documentos. Favor tentar mais tarde.')
                this.carregandoinfo = false
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
            const loggedIn = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/logado`, config);
            this.userSetor = loggedIn.data[0].setor;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/get_all`, config);
            this.documentos = response.data;
            this.resultados = response.data.length;
            this.fullLoad = true;
            this.carregando = false;
        } catch (error) {
            console.log(error)
            alert("Erro ao carregar página. Favor tentar mais tarde.");
            this.carregando = false;
        }
    }
}
</script>