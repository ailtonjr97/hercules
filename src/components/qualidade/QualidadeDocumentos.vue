<template>
<div v-if="carregando" id="loading"></div>
<div v-if="fullLoad">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2">Novo Documento</button>
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
<modal v-if="modalVerDocumento" :title="'Visualizar documento'">
  <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div class="row" v-if="!carregandoinfo">
        <h3>Qualidade:</h3>
        <form-floating :placeholder="'Data:'" :id="'name'" :type="'date'" v-model="visualizar.data"></form-floating>
        <form-floating :placeholder="'Inspetor:'" :id="'name'" :type="'text'" v-model="visualizar.inspetor"></form-floating>
        <form-floating :placeholder="'Código Produto:'" :id="'name'" :type="'text'" v-model="visualizar.cod_prod"></form-floating>
        <form-floating :placeholder="'Descrição:'" :id="'name'" :type="'text'" v-model="visualizar.descri"></form-floating>
    </div>
    <div class="row mt-2" v-if="!carregandoinfo">
        <form-floating :placeholder="'Lote/ODF:'" :id="'name'" :type="'text'" v-model="visualizar.lote_odf"></form-floating>
        <form-floating :placeholder="'Lance:'" :id="'name'" :type="'text'" v-model="visualizar.lance"></form-floating>
        <form-floating :placeholder="'Quantidade Metragem:'" :id="'name'" :type="'text'" v-model="visualizar.quantidade_metragem"></form-floating>
        <form-floating :placeholder="'CPNC Número:'" :id="'name'" :type="'text'" v-model="visualizar.cpnc_numero"></form-floating>
    </div>
  </template>
  <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="verDocumento()">Fechar</button>
  </template>
</modal>

</template>

<script>
import axios from 'axios';

import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';

const config = {
    headers: {
    'Authorization': document.cookie.replace('jwt=', ''),
    }
}

export default {
    components: {
        TableTop,
        TableSearch,
        Modal,
        Loading,
        FormFloating,
        SelectFloating
    },
    data(){
        return{
            carregando: true,
            documentos: [],
            fullLoad: false,
            modalVerDocumento: false,
            carregandoinfo: false,
            visualizar: {
                data: '',
                inspetor: '',
                cod_prod: '',
                descri: '',
                lote_odf: '',
                lance: '',
                quantidade_metragem: '',
                cpnc_numero: '',
            },
        }
    },
    methods: {
        async verDocumento(id){
            try {
                this.carregandoinfo = true;
                this.modalVerDocumento ? this.modalVerDocumento = false : this.modalVerDocumento = true;
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
                'Authorization': document.cookie.replace('jwt=', ''),
                }
            }
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/get_all`, config);
            this.documentos = response.data;
            this.resultados = response.data.length
            this.fullLoad = true;
            this.carregando = false;
        } catch (error) {
            alert("Erro ao carregar página. Favor tentar mais tarde.")
            this.carregando = false;
        }
    }
}
</script>