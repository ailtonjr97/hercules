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
          <form-floating :placeholder="'Filial:'" :id="'filial'" :type="'number'" @keyup.enter="pesquisa()" v-model="filial"></form-floating>
        </div>
        <div class="col">
          <form-floating :placeholder="'Número:'" :id="'numero'" :type="'number'" @keyup.enter="pesquisa()" v-model="numero"></form-floating>
        </div>
      </div>
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
              <th>Filial</th>
              <th>Número</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="api in apis" :key="api.R_E_C_N_O_">
              <td>{{api.C5_FILIAL}}</td>
              <td>{{api.C5_NUM}}</td>
              <td>
                <button title="Detalhes" class="button-8" @click="abrirModal(api.C5_FILIAL, api.C5_NUM)">
                  <i style="font-size: 14px;" class="fa-solid fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
    <modal v-if="infoModal" :title="`Detalhes do Pedido:`">
      <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div v-if="!carregandoinfo">

          <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'Filial'" :type="'text'" v-model="apiModal.C5_FILIAL" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Número'" :type="'text'" v-model="apiModal.C5_NUM" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Ped. Transf.'" :type="'text'" v-model="apiModal.C5_XPEDTR" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Num. Orc.'" :type="'text'" v-model="apiModal.C5_XNUMORC" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Cliente'" :type="'text'" v-model="apiModal.C5_CLIENTE" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Loja Entrega'" :type="'text'" v-model="apiModal.C5_LOJAENT" readonly></form-span>
            </div>
          </div>

          <div class="row mt-2" v-if="optionsOrcamentos">
            <div class="col">
                <form-span :span="'DT Emissao'" :type="'text'" v-model="apiModal.C5_EMISSAO" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Dt. Entrega'" :type="'text'" v-model="apiModal.C5_FECENT" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'Preço Atu'" :type="'text'" v-model="apiModal.C5_XPRCATU" readonly></form-span>
            </div>
          </div>

          <div class="row mt-2">
            <loading v-if="carregandoItemsOrc && optionsOrcamentos"></loading>
          </div>
          <div v-if="!carregandoItemsOrc && optionsOrcamentos" class="table-wrapper table-responsive table-striped mt-4">
            <table class="fl-table" id="myTable">
              <thead>
                <tr style="height: 25px">
                  <th>Item</th>
                  <th>Produto</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsApi" :key="item.C6_ITEM">
                  <td>{{item.C6_ITEM}}</td>
                  <td>{{item.C6_PRODUTO}}</td>
                  <td>{{item.C6_DESCRI}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template v-slot:buttons>
        <button class="button-8 mt-2" @click="infoModal = false;">Fechar</button>
      </template>
    </modal>  
  
    <modal v-if="modalPadrao" :title="modalPadraoTitle">
      <template v-slot:body>
        <loading v-if="carregandoInfoModal"></loading>
        <div v-if="!carregandoInfoModal">
          <div class="row">
            <div v-for="(item, index) in modalPadraoItem" class="col-md-3 mt-2">
              <form-span :span="modalPadraoDescritivos[index]" :type="'text'" v-model="computedModalPadraoItems[index]" readonly></form-span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:buttons v-if="!carregandoInfoModal">
        <button class="button-8 mt-2" @click="modalPadrao = false">Fechar</button>
      </template>
    </modal>

  </template>
  
  <script>
  import { computed } from 'vue';
  import { getAuthConfig } from '../auth/authToken';
  import FormSpan from '../ui/formSpan.vue';
  import axios from 'axios';
  import TableTop from '../ui/TableTop.vue';
  import TableSearch from '../ui/TableSearch.vue';
  import Modal from '../ui/Modal.vue';
  import Loading from '../ui/Loading.vue';
  import FormFloating from '../ui/FormFloating.vue';
  import TextareaFloating from '../ui/TextareaFloating.vue';
  import SelectFloating from '../ui/SelectFloating.vue';
  import Popup from '../ui/Popup.vue';
  import SpanSelect from '../ui/spanSelect.vue';
  import SpanTextarea from '../ui/spanTextarea.vue';
  
  const config = getAuthConfig();
  
  export default {
    name: 'ComercialPedidos',
    components: {
      Popup,
      TableTop,
      TableSearch,
      Modal,
      Loading,
      FormFloating,
      TextareaFloating,
      SelectFloating,
      FormSpan,
      SpanSelect,
      SpanTextarea
    },
    data() {
      return {
        infoModal: false,
        filial: '',
        numero: '',
        carregandoInfoModal: false,
        modalPadraoDescritivos: null,
        modalPadraoTitle: '',
        modalPadraoItem: null,
        modalPadrao: false,
        nomCli: '',
        clienteItems: null,
        clienteModal: false,
        optionsOrcamentos: true,
        optionsOutros: false,
        orcamento: null,
        titulo: '',
        orcamentoModal: false,
        mostraErro: false,
        limit: null,
        mostraErro: false,
        novoModal: false,
        popup: false,
        disableBtn: false,
        carregandoinfo: false,
        resultados: 0,
        carregando: true,
        apiModal: [],
        apis: [],
        itemsApi: [],
        carregandoItemsOrc: false,
        condPagModal: false,
        codPag: null,
        tabPreModal: false,
        tabPre: null
      };
    },
    computed: {
      computedModalPadraoItems: {
        get() {
          return this.modalPadraoItem;
        },
        set(newValue) {
          this.modalPadraoItem = newValue;
        }
      }
    },
    methods: {
      async openModalPadrao(title, api, descritivos) {
        try {
          this.modalPadraoDescritivos = descritivos;
          this.modalPadraoTitle = title;
          this.modalPadrao = true;
          this.carregandoInfoModal = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}${api}`, config);
          this.modalPadraoItem = response.data;
          this.carregandoInfoModal = false;
        } catch (error) {
          this.carregandoInfoModal = false;
          if (error.response.status == 404) {
            alert('Nenhum resultado encontrado.');
          } else {
            alert('Falha ao executar ação. Tente novamente mais tarde');
          }
        }
      },
      async abrirModal(C5_FILIAL, C5_NUM) {
        try {
          this.infoModal = true;
          this.carregandoinfo = true;
          this.carregandoItemsOrc = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedido-info?filial=${C5_FILIAL}&numero=${C5_NUM}`, config);
          this.apiModal = response.data;
          this.carregandoinfo = false;
          console.log(this.apiModal)
          const items = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedido-items?filial=${C5_FILIAL}&numero=${C5_NUM}`, config);
          this.itemsApi = items.data;
          this.carregandoItemsOrc = false;
        } catch (error) {
          console.log(error);
          alert('Falha ao executar ação. Tente novamente mais tarde');
        }
      },
      async pesquisa() {
        try {
          this.carregando = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedidos?filial=${this.filial}&numero=${this.numero}`, config);
          this.apis = response.data;
          this.resultados = response.data.length;
          this.carregando = false;
        } catch (error) {
          this.carregando = false;
          if (error.response.status == 404) {
            this.apis = [];
            this.resultados = 0;
          } else {
            alert('Falha ao executar ação. Tente novamente mais tarde');
          }
        }
      },
      async refresh() {
        try {
          this.carregando = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedidos`, config);
          this.apis = response.data;
          this.resultados = response.data.length;
          this.carregando = false;
        } catch (error) {
          alert('Falha ao executar ação. Tente novamente mais tarde.');
        }
      }
    },
    async created() {
      try {
        const config = getAuthConfig();
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedidos`, config);
        this.apis = response.data;
        this.resultados = response.data.length;
        this.carregando = false;
      } catch (error) {
        console.log(error);
        alert("Erro ao carregar página. Favor tentar mais tarde.");
        this.carregando = false;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Seus estilos aqui */
  </style>
  