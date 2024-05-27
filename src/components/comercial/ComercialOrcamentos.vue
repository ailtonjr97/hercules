<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2" @click="refresh()">Atualizar</button>
        </template>
    </table-top>
    <!-- <div class="row mb-2">
        <form-floating :placeholder="'Filial:'" :type="'number'" @keyup.enter="pesquisa()" v-model="filial"></form-floating>
    </div> -->
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Filial</th>
            <th>Número</th>
            <th>Cliente</th>
            <th>Loja</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis">
                <td>{{ api.R_E_C_N_O_ }}</td>
                <td>{{ api.CJ_FILIAL }}</td>
                <td>{{ api.CJ_NUM }}</td>
                <td>{{ api.CJ_CLIENTE }}</td>
                <td>{{ api.CJ_LOJA }}</td>
                <td><button title="Detalhes" class="button-8" @click="abrirOrcamentoModal(api.CJ_FILIAL, api.CJ_NUM, api.CJ_CLIENTE, api.CJ_LOJA)"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button></td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="orcamentoModal" :title="`Detalhes do Orçamento:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <button class="button-8 mb-2">Orçamento</button>
                <button class="button-8 mb-2">Outros</button>
            </div>
        </div>
        <div class="row" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Número:'" :type="'text'" v-model="orcamento.CJ_NUM" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'DT Emissão:'" :type="'text'" v-model="orcamento.CJ_EMISSAO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cliente:'"  :type="'text'" v-model="orcamento.CJ_CLIENTE" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Loja:'"  :type="'text'" v-model="orcamento.CJ_LOJA" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'UF Cliente:'"  :type="'text'" v-model="orcamento.CJ_XESTADO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Pedido Korp::'"  :type="'text'" v-model="orcamento.CJ_XPVKORP" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tabela:'" :type="'text'" v-model="orcamento.CJ_TABELA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tipo Cliente:'"  :type="'text'" v-model="orcamento.CJ_TIPOCLI" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Loja Entrega:'"  :type="'text'" v-model="orcamento.CJ_LOJAENT" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tipo Frete:'"  :type="'text'" v-model="orcamento.CJ_TPFRETE" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Desconto 3:'" :type="'number'" v-model="orcamento.CJ_DESC3" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Desconto 4:'"  :type="'number'" v-model="orcamento.CJ_DESC4" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Desconto 1:'" :type="'number'" v-model="orcamento.CJ_DESC1" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Parcela 1:'" :type="'number'" v-model="orcamento.CJ_PARC1" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vencimento 1:'"  :type="'text'" v-model="orcamento.CJ_DATA1" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Desconto 2:'" :type="'number'" v-model="orcamento.CJ_DESC2" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Parcela 2:'" :type="'number'" v-model="orcamento.CJ_PARC2" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vencimento 2:'" :type="'text'" v-model="orcamento.CJ_DATA2" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Parcela 3:'" :type="'number'" v-model="orcamento.CJ_PARC3" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vencimento 3:'" :type="'number'" v-model="orcamento.CJ_DATA3" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Parcela 4:'" :type="'number'" v-model="orcamento.CJ_PARC4" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vencimento 4:'" :type="'text'" v-model="orcamento.CJ_DATA4" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Status:'" :type="'text'" v-model="orcamento.CJ_STATUS" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Cotacao/Ped.:'" :type="'text'" v-model="orcamento.CJ_COTCLI" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Frete:'" :type="'number'" v-model="orcamento.CJ_FRETE" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Seguro:'" :type="'number'" v-model="orcamento.CJ_SEGURO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Despesa:'" :type="'number'" v-model="orcamento.CJ_DESPESA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Frete Auton.:'" :type="'number'" v-model="orcamento.CJ_FRETAUT" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Dt.Validade:'" :type="'text'" v-model="orcamento.CJ_VALIDA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tipo:'" :type="'text'" v-model="orcamento.CJ_TIPO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Moeda:'" :type="'number'" v-model="orcamento.CJ_MOEDA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tp Liberacao:'" :type="'text'" v-model="orcamento.CJ_TIPLIB" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Carga:'" :type="'text'" v-model="orcamento.CJ_TPCARGA" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Indenizacao:'"  :type="'number'" v-model="orcamento.CJ_DESCONT" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Indenizacao:'" :type="'number'" v-model="orcamento.CJ_PDESCAB" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Proposta No.:'" :type="'text'" v-model="orcamento.CJ_PROPOST" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Oportunidade:'" :type="'text'" v-model="orcamento.CJ_NROPOR" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Revisao Op.:'" :type="'text'" v-model="orcamento.CJ_REVISA" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Taxa Moeda:'"  :type="'number'" v-model="orcamento.CJ_TXMOEDA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Presenca Com:'"  :type="'text'" v-model="orcamento.CJ_INDPRES" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cod. Interme:'"  :type="'text'" v-model="orcamento.CJ_CODA1U" readonly></form-span>
            </div>
        </div>
        
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="orcamentoModal = false;">Fechar</button>
        <button class="button-8 mt-2" @click="salvarOrcamentoModal()">Salvar</button>
    </template>
</modal>

</template>

<script>

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

import FormSpan from '../ui/formSpan.vue'
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
    SelectFloating,
    FormSpan
},
data(){
    return{
        cj_emissao: '',
        nome_cliente: '',
        optionsOrcamentos: true,
        optionsOutros: false,
        orcamento: null,
        titulo: '',
        orcamentoModal: false,
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
    async abrirOrcamentoModal(CJ_FILIAL, CJ_NUM, CJ_CLIENTE, CJ_LOJA){
        try {
            this.orcamentoModal = true;
            this.carregandoinfo = true;
            const response =  await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamento-info?filial=${CJ_FILIAL}&numero=${CJ_NUM}&cliente=${CJ_CLIENTE}&loja=${CJ_LOJA}`, config);
            this.orcamento = response.data
            this.carregandoinfo = false;
        } catch (error) {
            
        }
    },
    async pesquisa(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos?filial=${this.filial}&numero=${this.numero}`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            
        }
    },
    async refresh(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            alert('Falha ao executar ação. Tente novamente mais tarde.')
        }
    },
},
async created(){
        try {
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            }
            const config = {
                headers: {
                'Authorization': `jwt=${getCookie('jwt')}`,
                }
            }
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos`, config);
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