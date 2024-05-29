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
        <div class="col">
            <form-floating :placeholder="'Filial:'" :type="'number'" @keyup.enter="pesquisa()" v-model="filial"></form-floating>
        </div>
        <div class="col">
            <form-floating :placeholder="'Número:'" :type="'number'" @keyup.enter="pesquisa()" v-model="numero"></form-floating>
        </div>
        <div class="col">
            <form-floating :placeholder="'Cliente:'" :type="'text'" @keyup.enter="pesquisa()" v-model="cliente"></form-floating>
        </div>
        <div class="col">
            <form-floating :placeholder="'Loja:'" :type="'number'" @keyup.enter="pesquisa()" v-model="loja"></form-floating>
        </div>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>Filial</th>
            <th>Número</th>
            <th>Cliente</th>
            <th>Loja</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis" :key="api.R_E_C_N_O_">
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
                <button class="button-8 mb-2" @click="mostraOrcamento()">Orçamento</button>
                <button class="button-8 mb-2" @click="mostraOutros()">Outros</button>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Número:'" :type="'text'" v-model="orcamento.CJ_NUM" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'DT Emissão:'" :type="'text'" v-model="orcamento.CJ_EMISSAO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cliente:'" :type="'text'" v-model="orcamento.CJ_CLIENTE" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Loja:'" :type="'text'" v-model="orcamento.CJ_LOJA" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Loja Entr.:'" :type="'text'" v-model="orcamento.CJ_LOJAENT" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cond.Pagto:'" :type="'text'" v-model="orcamento.CJ_CONDPAG" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cliente Entr.:'" :type="'text'" v-model="orcamento.CJ_CLIENT" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tabela:'" :type="'text'" v-model="orcamento.CJ_TABELA" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Tipo Frete:'" :type="'text'" v-model="orcamento.CJ_TPFRETE" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Redespacho:'" :type="'text'" v-model="orcamento.CJ_REDESPACHO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'UF Cliente:'" :type="'text'" v-model="orcamento.CJ_UFCLIENTE" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Pedido Korp:'" :type="'text'" v-model="orcamento.CJ_PEDIDOKORP" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tipo Cliente:'" :type="'text'" v-model="orcamento.CJ_TIPOCLI" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vendedor:'" :type="'text'" v-model="orcamento.CJ_VENDEDOR" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tp Liberação:'" :type="'text'" v-model="orcamento.CJ_TIPLIB" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Nome Vend:'" :type="'text'" v-model="orcamento.CJ_NOMVEN" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Núm. Externo:'" :type="'text'" v-model="orcamento.CJ_NUMEXT" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Frete + Imp.:'" :type="'text'" v-model="orcamento.CJ_FRETEIMP" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Dt. Validade:'" :type="'text'" v-model="orcamento.CJ_VALIDA" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Observacao:'" :type="'textarea'" v-model="orcamento.CJ_OBSERVACAO" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Prazo Real:'" :type="'text'" v-model="orcamento.CJ_PRAZOREAL" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Frete Cot.:'" :type="'text'" v-model="orcamento.CJ_FRETECOT" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vir. Frete:'" :type="'text'" v-model="orcamento.CJ_VIRFRETE" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Transp. Simu:'" :type="'text'" v-model="orcamento.CJ_TRANSSIMU" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Desconto 1:'" :type="'text'" v-model="orcamento.CJ_DESC1" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cotacao/Ped.:'" :type="'text'" v-model="orcamento.CJ_COTCLI" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Simu. Frete:'" :type="'text'" v-model="orcamento.CJ_SIMUFRETE" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Seguro:'" :type="'text'" v-model="orcamento.CJ_SEGURO" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Despesa:'" :type="'text'" v-model="orcamento.CJ_DESPESA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Moeda:'" :type="'text'" v-model="orcamento.CJ_MOEDA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Filial Venda:'" :type="'text'" v-model="orcamento.CJ_FILVEN" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Filial Entr.:'" :type="'text'" v-model="orcamento.CJ_FILENT" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Frete Auton.:'" :type="'text'" v-model="orcamento.CJ_FRETAUT" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Log Usuario:'" :type="'text'" v-model="orcamento.CJ_LOGUSUARIO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Usuário Incl.:'" :type="'text'" v-model="orcamento.CJ_USUARIOINCL" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Percentual:'" :type="'text'" v-model="orcamento.CJ_PERCENTUAL" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Carga:'" :type="'text'" v-model="orcamento.CJ_TPCARGA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Indenizacao:'" :type="'text'" v-model="orcamento.CJ_INDPRES" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Proposta No.:'" :type="'text'" v-model="orcamento.CJ_PROPOST" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Val. Percent:'" :type="'text'" v-model="orcamento.CJ_PDESCAB" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Forma Pgto.:'" :type="'text'" v-model="orcamento.CJ_FORMAPGTO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Mot. Rejeita:'" :type="'text'" v-model="orcamento.CJ_MOTREJEITA" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Oportunidade:'" :type="'text'" v-model="orcamento.CJ_NROPOR" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vendedor 2:'" :type="'text'" v-model="orcamento.CJ_VEND2" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Usuário Lib.:'" :type="'text'" v-model="orcamento.CJ_USR_LIB" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Revisao Op.:'" :type="'text'" v-model="orcamento.CJ_REVISA" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Taxa Moeda:'" :type="'text'" v-model="orcamento.CJ_TXMOEDA" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vendedor 3:'" :type="'text'" v-model="orcamento.CJ_VEND3" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Presença Com:'" :type="'text'" v-model="orcamento.CJ_INDPRES" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vendedor 5:'" :type="'text'" v-model="orcamento.CJ_VEND5" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Perc. Adian.:'" :type="'text'" v-model="orcamento.CJ_PERCADIAN" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vendedor 4:'" :type="'text'" v-model="orcamento.CJ_VEND4" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Loja Prosp.:'" :type="'text'" v-model="orcamento.CJ_LOJPRO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Vir. Adian.:'" :type="'text'" v-model="orcamento.CJ_VIRADIAN" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Prospect:'" :type="'text'" v-model="orcamento.CJ_PROSPE" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cód. Interme.:'" :type="'text'" v-model="orcamento.CJ_CODA1U" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cód Usr Sol.:'" :type="'text'" v-model="orcamento.CJ_CODUSRSOL" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Nome Usr Sol:'" :type="'text'" v-model="orcamento.CJ_NOMEUSRSOL" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Dt. Solic An:'" :type="'text'" v-model="orcamento.CJ_DTSOLICAN" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Hr Solic An:'" :type="'text'" v-model="orcamento.CJ_HRSOLICAN" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cód Usr Resp:'" :type="'text'" v-model="orcamento.CJ_CODUSRRESP" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Nome Usr Res:'" :type="'text'" v-model="orcamento.CJ_NOMEUSRRES" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Dt. Resp An:'" :type="'text'" v-model="orcamento.CJ_DTRESPAN" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Hr Resp An:'" :type="'text'" v-model="orcamento.CJ_HRRESPAN" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cód Usr Sol:'" :type="'text'" v-model="orcamento.CJ_CODUSRSOL" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Nome Usr Sol:'" :type="'text'" v-model="orcamento.CJ_NOMEUSRSOL" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Dt. Solic Pr:'" :type="'text'" v-model="orcamento.CJ_DTSOLICPR" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Hr Solic Pr:'" :type="'text'" v-model="orcamento.CJ_HRSOLICPR" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cód Usr Resp:'" :type="'text'" v-model="orcamento.CJ_CODUSRRESP" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'Nome Usuário:'" :type="'text'" v-model="orcamento.CJ_NOMEUSUARIO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Dt. Resp Praz:'" :type="'text'" v-model="orcamento.CJ_DTRESPPRAZ" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Hr Resp Praz:'" :type="'text'" v-model="orcamento.CJ_HRRESPPRAZ" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tot. Imposto:'" :type="'text'" v-model="orcamento.CJ_TOTIMPOSTO" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'ICMS:'" :type="'text'" v-model="orcamento.CJ_ICMS" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'PIS:'" :type="'text'" v-model="orcamento.CJ_PIS" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'CONFIS:'" :type="'text'" v-model="orcamento.CJ_CONFIS" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'ICMS-ST:'" :type="'text'" v-model="orcamento.CJ_ICMSST" readonly></form-span>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-span :span="'FCP:'" :type="'text'" v-model="orcamento.CJ_FCP" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'ST:'" :type="'text'" v-model="orcamento.CJ_ST" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Tot dos Imp.:'" :type="'text'" v-model="orcamento.CJ_TOTIMPOSTO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'IPI:'" :type="'text'" v-model="orcamento.CJ_IPI" readonly></form-span>
            </div>
        </div>
               
        
        
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="orcamentoModal = false;">Fechar</button>
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
        loja: '',
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
    async mostraOrcamento(){
        try {
            this.optionsOrcamentos = true;
            this.optionsOutros = false;
        } catch (error) {
            
        }
    },
    async mostraOutros(){
        try {
            this.optionsOrcamentos = false;
            this.optionsOutros = true;
        } catch (error) {
            
        }
    },
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