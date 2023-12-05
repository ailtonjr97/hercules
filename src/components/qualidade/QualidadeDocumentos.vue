<template>
<div v-if="carregando" id="loading"></div>
<div v-if="fullLoad">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2" @click="abrirModalNovoDocumento">Novo Documento</button>
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
                <button class="button-8" @click="openModalEdp(documento.id)" v-if="documento.edp_preenchido == 0 && userSetor == 'Engenharia de Processos'">Preencher EDP</button>
                <button class="button-8" @click="openModalEdp(documento.id)" v-if="documento.edp_preenchido == 1 && userSetor == 'PCP'">Preencher PCP</button>
                <button class="button-8" @click="openModalEdp(documento.id)" v-if="documento.pcp_preenchido == 1 && userSetor == 'Producao'">Preencher Produção</button>
                <button class="button-8" @click="openModalEdp(documento.id)" v-if="documento.producao_preenchido == 1 && userSetor == 'Qualidade'">Preencher Qualidade</button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="modalVerDocumento" :title="'Visualizar documento'">
  <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <h3>Qualidade:</h3>
            <form-floating :placeholder="'Data:'" :id="'data'" :type="'date'" v-model="visualizar.data" ></form-floating>
            <form-floating :placeholder="'Inspetor:'" :id="'inspetor'" :type="'text'" v-model="visualizar.inspetor" ></form-floating>
            <form-floating :placeholder="'Código Produto:'" :id="'cod_prod'" :type="'text'" v-model="visualizar.cod_prod" ></form-floating>
            <form-floating :placeholder="'Descrição:'" :id="'descri'" :type="'text'" v-model="visualizar.descri" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'Lote/ODF:'" :id="'lote_odf'" :type="'text'" v-model="visualizar.lote_odf" ></form-floating>
            <form-floating :placeholder="'Lance:'" :id="'lance'" :type="'text'" v-model="visualizar.lance" ></form-floating>
            <form-floating :placeholder="'Quantidade Metragem:'" :id="'quantidade_metragem'" :type="'text'" v-model="visualizar.quantidade_metragem" ></form-floating>
            <form-floating :placeholder="'CPNC Número:'" :id="'cpnc_numero'" :type="'text'" v-model="visualizar.cpnc_numero" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <textarea-floating :placeholder="'Motivo da NC:'" :id="'motivo_nc'" v-model="visualizar.motivo_nc" ></textarea-floating>
            <hr class="mt-2">
        </div>
        <div class="row">
            <h3>EDP:</h3>
            <form-floating :placeholder="'Responsável:'" :id="'edp_responsavel'" :type="'text'" v-model="visualizar.edp_responsavel" ></form-floating>
            <form-floating :placeholder="'Data:'" :id="'edp_data'" :type="'date'" v-model="visualizar.edp_data" ></form-floating>
            <form-floating :placeholder="'Tempo Previsto:'" :id="'tempo_previsto'" :type="'text'" v-model="visualizar.tempo_previsto" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <textarea-floating :placeholder="'Motivo da NC:'" :id="'instrucao_reprocesso'" v-model="visualizar.instrucao_reprocesso" ></textarea-floating>
            <hr class="mt-2">
        </div>
        <div class="row">
            <h3>PCP:</h3>
            <form-floating :placeholder="'Responsável:'" :id="'pcp_responsavel'" :type="'text'" v-model="visualizar.pcp_responsavel" ></form-floating>
            <form-floating :placeholder="'Data:'" :id="'pcp_data'" :type="'date'" v-model="visualizar.pcp_data" ></form-floating>
            <form-floating :placeholder="'ODF Retrabalho:'" :id="'pcp_odf_retrabalho'" :type="'text'" v-model="visualizar.pcp_odf_retrabalho" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <textarea-floating :placeholder="'Motivo da NC:'" :id="'instrucao_reprocesso'" v-model="visualizar.instrucao_reprocesso" ></textarea-floating>
            <hr class="mt-2">
        </div>
        <div class="row">
            <h3>Produção:</h3>
            <form-floating :placeholder="'Tempo Realizado:'" :id="'prod_tempo_realizado'" :type="'text'" v-model="visualizar.prod_tempo_realizado" ></form-floating>
            <form-floating :placeholder="'Insumos:'" :id="'prod_insumos'" :type="'text'" v-model="visualizar.prod_insumos" ></form-floating>
            <form-floating :placeholder="'Sucata:'" :id="'prod_sucata'" :type="'text'" v-model="visualizar.prod_sucata" ></form-floating>
        </div>
        <div class="row mt-2">
            <form-floating :placeholder="'Responsável:'" :id="'prod_responsavel'" :type="'text'" v-model="visualizar.prod_responsavel" ></form-floating>
            <form-floating :placeholder="'Data:'" :id="'prod_data'" :type="'date'" v-model="visualizar.prod_data" ></form-floating>
            <form-floating :placeholder="'Status:'" :id="'prod_status'" :type="'text'" v-model="visualizar.prod_status" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <textarea-floating :placeholder="'Observações da Produção:'" :id="'prod_obs'" v-model="visualizar.prod_obs" ></textarea-floating>
            <hr class="mt-2">
        </div>
        <div class="row">
            <h3>Qualidade:</h3>
            <form-floating :placeholder="'Responsável:'" :id="'quali_responsavel'" :type="'text'" v-model="visualizar.quali_responsavel" ></form-floating>
            <form-floating :placeholder="'Data:'" :id="'quali_data'" :type="'date'" v-model="visualizar.quali_data" ></form-floating>
            <form-floating :placeholder="'Status:'" :id="'quali_status'" :type="'text'" v-model="visualizar.quali_status" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <textarea-floating :placeholder="'Observações da Qualidade:'" :id="'quali_parecer'" v-model="visualizar.quali_parecer" ></textarea-floating>
            <hr class="mt-2">
        </div>
    </div>
  </template>
  <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="closeVerDocumento()">Fechar</button>
  </template>
</modal>

<modal v-if="modalNovoDocumento" :title="'Novo Documento:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row" v-if="!carregandoinfo">
            <form-floating :placeholder="'Data:'" :id="'data'" :type="'date'" v-model="criar.data"></form-floating>
            <select-floating :placeholder="'Inspetores'" :id="'inspetor'" :options="inspetores" v-model="criar.inspetor"></select-floating>
            <form-floating :placeholder="'Código Produto:'" :id="'cod_prod'" :type="'text'" v-model="criar.cod_prod" ></form-floating>
            <form-floating :placeholder="'Descrição:'" :id="'descri'" :type="'text'" v-model="criar.descri" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'Lote/ODF:'" :id="'lote_odf'" :type="'text'" v-model="criar.lote_odf" ></form-floating>
            <form-floating :placeholder="'Lance:'" :id="'lance'" :type="'text'" v-model="criar.lance" ></form-floating>
            <form-floating :placeholder="'Quantidade Metragem:'" :id="'quantidade_metragem'" :type="'text'" v-model="criar.quantidade_metragem" ></form-floating>
            <form-floating :placeholder="'CPNC Número:'" :id="'cpnc_numero'" :type="'text'" v-model="criar.cpnc_numero" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <textarea-floating :placeholder="'Motivo da NC:'" :id="'motivo_nc'" v-model="criar.motivo_nc" ></textarea-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="closeModalNovoDocumento">Fechar</button>
        <button class="button-8" @click="enviarNovoDocumento">Executar</button>
    </template>
</modal>

<modal v-if="modalEdp" :title="'EDP:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row" v-if="!carregandoinfo">
            <select-floating :placeholder="'Responsável:'" :id="'edp_responsavel'" :options="edp_responsaveis" v-model="modalEdpBody.edp_responsavel"></select-floating>
            <form-floating :placeholder="'Data:'" :id="'edp_data'" :type="'date'" v-model="modalEdpBody.edp_data"></form-floating>
            <form-floating :placeholder="'Tempo Previsto:'" :id="'tempo_previsto'" :type="'text'" v-model="modalEdpBody.tempo_previsto"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <textarea-floating :placeholder="'Instrução de Reprocesso:'" :id="'instrucao_reprocesso'" v-model="modalEdpBody.instrucao_reprocesso"></textarea-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="closeModalEdp">Fechar</button>
        <button class="button-8" @click="enviarEdp">Executar</button>
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
import TextareaFloating from '../ui/TextareaFloating.vue';

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

export default {
    components: {
        TableTop,
        TableSearch,
        Modal,
        Loading,
        FormFloating,
        SelectFloating,
        TextareaFloating
    },
    data(){
        return{
            userSetor: null,
            whereId: null,
            modalEdp: false,
            modalNovoDocumento: false,
            carregando: true,
            documentos: [],
            fullLoad: false,
            modalVerDocumento: false,
            carregandoinfo: false,
            visualizar: {},
            inspetores: [],
            edp_responsaveis: [],
            criar: {
                data: '',
                inspetor: '',
                cod_prod: '',
                descri: '',
                lote_odf: '',
                lance: '',
                quantidade_metragem: '',
                cpnc_numero: '',
                motivo_nc: '',
            },
            modalEdpBody: {
                tempo_previsto: '',
                instrucao_reprocesso: '',
                edp_responsavel: '',
                edp_data: ''
            },
        }
    },
    methods: {
        async enviarEdp(){
            try {
                this.closeModalEdp();
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/editarEdp/${this.whereId}`, this.modalEdpBody, config);
                this.pageRefresh();
            } catch (error) {
                console.log(error)
                alert("Falha ao preenchar campos do EDP.");
                this.carregando = false;
            }
        },
        async openModalEdp(id){
            this.whereId = id;
            this.carregandoinfo = true;
            this.modalEdp = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/inspetores/${'Engenharia de Processos'}`, config);
            response.data.forEach(element => {
                this.edp_responsaveis.push({descri: element.name, valor: element.name})
            });
            this.carregandoinfo = false;
        },
        async closeModalEdp(){
            this.modalEdp = false;
            this.edp_responsaveis = [];
        },
        async pageRefresh(){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/get_all`, config);
                this.documentos = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
                var self = this;
                Object.keys(this.criar).forEach(function(key, index) {
                    self.criar[key] = '';
                });
                Object.keys(this.modalEdpBody).forEach(function(key, index) {
                    self.modalEdpBody[key] = '';
                });
            } catch (error) {
               console.log(error)
               alert("Falha ao carregar página.");
               this.carregando = false;
            }
        },
        async closeVerDocumento(){
            this.modalVerDocumento = false;
        },
        async closeModalNovoDocumento(){
            this.modalNovoDocumento = false;
            this.inspetores = [];
        },
        async enviarNovoDocumento(){
            try {
                this.carregando = true;
                this.closeModalNovoDocumento();
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/create`, this.criar, config);
                this.pageRefresh();
            } catch (error) {
                console.log(error)
                alert('Erro ao criar documento. Favor tentar mais tarde.')
                this.carregando = false;
            }
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
        async abrirModalNovoDocumento(){
            try {
                this.carregandoinfo = true;
                this.modalNovoDocumento ? this.modalNovoDocumento = false : this.modalNovoDocumento = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/inspetores/${'Qualidade'}`, config);
                response.data.forEach(element => {
                    this.inspetores.push({descri: element.name})
                });
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                alert('Erro ao procurar inspetores. Favor tentar mais tarde.')
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