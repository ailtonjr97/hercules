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
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="filial"     :id="'procuraBtn0'" :num="0" :placeholder="'Filial:'"          :type="'number'"></form-floating>
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="numero"     :id="'procuraBtn1'" :num="1" :placeholder="'Número:'"          :type="'number'"></form-floating>
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="dt_emissao" :id="'procuraBtn2'" :num="2" :placeholder="'Data de emissão:'" :type="'date'"  ></form-floating>
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="cliente"    :id="'procuraBtn3'" :num="3" :placeholder="'Cliente:'"         :type="'text'"  ></form-floating>
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="limit"      :id="'procuraBtn4'" :num="4" :placeholder="'Limite:'"          :type="'number'"></form-floating>
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
            <th>Loja</th>
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
                <td>{{ api.CJ_LOJA }}</td>
                <td><button title="Detalhes" class="button-8" @click="abrirOrcamentoModal(api.CJ_FILIAL, api.CJ_NUM, api.CJ_CLIENTE, api.CJ_LOJA)"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button></td>
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

<modal v-if="orcamentoModal" :title="`Orçamento ${this.titulo}`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <button class="button-8 mb-2" @click="mostraOrcamento()">Orçamento</button>
                <button class="button-8 mb-2" @click="mostraOutros()">Outros</button>
            </div>
        </div>
        <div class="row" v-if="optionsOrcamentos">
            <div class="col">
                <form-floating :placeholder="'Filial:'" :id="'CJ_FILIAL'" :type="'text'" v-model="orcamento.CJ_FILIAL" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Número:'" :id="'CJ_NUM'" :type="'text'" v-model="orcamento.CJ_NUM" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Data de emissão:'" :id="'CJ_EMISSAO'" :type="'text'" v-model="orcamento.CJ_EMISSAO" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Cliente:'" :id="'CJ_CLIENTE'" :type="'text'" v-model="orcamento.CJ_CLIENTE" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Loja:'" :id="'CJ_LOJA'" :type="'text'" v-model="orcamento.CJ_LOJA" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col-lg-6">
                <form-floating :placeholder="'Nome:'" :id="'CJ_NOMCLI'" :type="'text'" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Cliente Entr:'" :id="'CJ_CLIENT'" :type="'text'" v-model="orcamento.CJ_CLIENT" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Loja Entrega:'" :id="'CJ_LOJAENT'" :type="'text'" v-model="orcamento.CJ_LOJAENT" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Cond. Pagto:'" :id="'CJ_CONDPAG'" :type="'text'" v-model="orcamento.CJ_CONDPAG" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-floating :placeholder="'UF Cliente:'" :id="'CJ_XESTADO'" :type="'text'" v-model="orcamento.CJ_XESTADO" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Pedido Korp:'" :id="'CJ_XPVKORP'" :type="'text'" v-model="orcamento.CJ_XPVKORP" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Tabela:'" :id="'CJ_TABELA'" :type="'text'" v-model="orcamento.CJ_TABELA" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Tipo Cliente:'" :id="'CJ_TIPOCLI'" :type="'text'" v-model="orcamento.CJ_TIPOCLI" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Tipo Frete:'" :id="'CJ_TPFRETE'" :type="'text'" v-model="orcamento.CJ_TPFRETE" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-floating :placeholder="'DESC TABELA:'" :id="''" :type="'text'" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Nome Vend:'" :id="''" :type="'text'" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Frete + Imp:'" :id="'CJ_XFREIMP'" :type="'text'" v-model="orcamento.CJ_XFREIMP" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Tp Liberação:'" :id="'CJ_TIPLIB'" :type="'text'" v-model="orcamento.CJ_TIPLIB" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <TextareaFloating :placeholder="'Observação:'" :id="'CJ_XOBS'" v-model="orcamento.CJ_XOBS" readonly></TextareaFloating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Prospect:'" :id="'CJ_PROSPE'" :type="'text'" v-model="orcamento.CJ_PROSPE"  readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Loja Prosp.:'" :id="'CJ_LOJPRO'" :type="'text'" v-model="orcamento.CJ_LOJPRO"  readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Frete Cot.:'" :id="'CJ_CST_FTS'" :type="'text'" v-model="orcamento.CJ_CST_FTS"  readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Vlr. Frete:'" :id="'CJ_XFREMA'" :type="'text'" v-model="orcamento.CJ_XFREMA"  readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Simu. Frete:'" :id="'CJ_XFRESIM'" :type="'text'" v-model="orcamento.CJ_XFRESIM"  readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Transp. Simu:'" :id="'CJ_XTRANSP'" :type="'text'" v-model="orcamento.CJ_XTRANSP"  readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Desconto 1'" :id="'CJ_DESC1'" :type="'text'" v-model="orcamento.CJ_DESC1"  readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Cotação/Ped.'" :id="'CJ_COTCLI'" :type="'text'" v-model="orcamento.CJ_COTCLI"  readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Frete'" :id="'CJ_FRETE'" :type="'text'" v-model="orcamento.CJ_FRETE"  readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Seguro:'" :id="'CJ_SEGURO'" :type="'text'" v-model="orcamento.CJ_SEGURO" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Despesa:'" :id="'CJ_DESPESA'" :type="'text'" v-model="orcamento.CJ_DESPESA" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Frete Auton.:'" :id="'CJ_FRETAUT'" :type="'text'" v-model="orcamento.CJ_FRETAUT" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Dt. Validade:'" :id="'CJ_VALIDA'" :type="'text'" v-model="orcamento.CJ_VALIDA" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Moeda:'" :id="'CJ_MOEDA'" :type="'text'" v-model="orcamento.CJ_MOEDA" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Filial Venda:'" :id="'CJ_FILVEN'" :type="'text'" v-model="orcamento.CJ_FILVEN" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Filial Entr.:'" :id="'CJ_FILENT'" :type="'text'" v-model="orcamento.CJ_FILENT" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Carga:'" :id="'CJ_TPCARGA'" :type="'text'" v-model="orcamento.CJ_TPCARGA" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Indenizacao:'" :id="'CJ_DESCONT'" :type="'text'" v-model="orcamento.CJ_DESCONT" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Prazo Real:'" :id="'CJ_XENTREG'" :type="'text'" v-model="orcamento.CJ_XENTREG" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Log usuario:'" :id="'CJ_LOGUSL'" :type="'text'" v-model="orcamento.CJ_LOGUSL" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Usuário Incl:'" :id="'CJ_XUSRINC'" :type="'text'" v-model="orcamento.CJ_XUSRINC" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Percentual:'" :id="'CJ_XPERCEN'" :type="'text'" v-model="orcamento.CJ_XPERCEN" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Proposta No.:'" :id="'CJ_PROPOST'" :type="'text'" v-model="orcamento.CJ_PROPOST" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Val. Percent:'" :id="'CJ_XVALPER'" :type="'text'" v-model="orcamento.CJ_XVALPER" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Forma Pgto.:'" :id="'CJ_XFORMA'" :type="'text'" v-model="orcamento.CJ_XFORMA" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Mot. Rejeita:'" :id="'CJ_XMOTREJ'" :type="'text'" v-model="orcamento.CJ_XMOTREJ" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Oportunidade:'" :id="'CJ_NROPOR'" :type="'text'" v-model="orcamento.CJ_NROPOR" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Vendedor 1:'" :id="'CJ_XVEND1'" :type="'text'" v-model="orcamento.CJ_XVEND1" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Vendedor 2:'" :id="'CJ_XVEND2'" :type="'text'" v-model="orcamento.CJ_XVEND2" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Usuario lib.:'" :id="'CJ_XUSRLIB'" :type="'text'" v-model="orcamento.CJ_XUSRLIB" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Revisao Op.:'" :id="'CJ_REVISA'" :type="'text'" v-model="orcamento.CJ_REVISA" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Vendedor 3:'" :id="'CJ_XVEND3'" :type="'text'" v-model="orcamento.CJ_XVEND3" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Taxa Moeda:'" :id="'CJ_TXMOEDA'" :type="'text'" v-model="orcamento.CJ_TXMOEDA" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Vendedor 4:'" :id="'CJ_XVEND4'" :type="'text'" v-model="orcamento.CJ_XVEND4" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Presença Com:'" :id="'CJ_INDPRES'" :type="'text'" v-model="orcamento.CJ_INDPRES" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Vendedor 5:'" :id="'CJ_XVEND5'" :type="'text'" v-model="orcamento.CJ_XVEND5" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Cód. Interme:'" :id="'CJ_CODA1U'" :type="'text'" v-model="orcamento.CJ_CODA1U" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Redespacho:'" :id="'CJ_XREDESP'" :type="'text'" v-model="orcamento.CJ_XREDESP" readonly></form-floating>
            </div>
        </div>
        <div class="row mt-2" v-if="optionsOutros">
            <div class="col">
                <form-floating :placeholder="'Perc. Adian.:'" :id="'CJ_XFINPCD'" :type="'text'" v-model="orcamento.CJ_XFINPCD" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Vlr. Adian:'" :id="'CJ_XFINVLD'" :type="'text'" v-model="orcamento.CJ_XFINVLD" readonly></form-floating>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharOrcamentoModal()">Fechar</button>
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
        optionsOrcamentos: true,
        optionsOutros: false,
        orcamento: [],
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
        this.optionsOrcamentos = true;
        this.optionsOutros = false;
    },
    async mostraOutros(){
        this.optionsOrcamentos = false;
        this.optionsOutros = true;
    },
    async fecharOrcamentoModal(){
        this.carregandoinfo = false;
        this.carregando = false;
        this.orcamentoModal = false;
        this.orcamento = [];
    },
    async abrirOrcamentoModal(filial, numero, cliente, loja){
        try {
            this.carregandoinfo = true;
            this.orcamentoModal = true;
            this.titulo = numero;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos/unico?filial=${filial}&numero=${numero}&cliente=${cliente}&loja=${loja}`, config);
            this.orcamento = response.data
            this.carregandoinfo = false;
        } catch (error) {
            this.mostraModal("Falha ao buscar resultados.");
            this.carregandoinfo = false;
            this.orcamentoModal = false;
        }
    },
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