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
      </div>
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
              <th>NF</th>
              <th>CTE</th>
              <th>Frete NF</th>
              <th>Frete CTE</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr :style="{ backgroundColor: api.frete_cte > api.frete_nf ? '#fffacd' : 'initial' }" v-for="api in apis" :key="api.id">
              <td>{{ api.numero_nf }}</td>
              <td>{{ api.numero_cte }}</td>
              <td>{{ api.frete_nf }}</td>
              <td>{{ api.frete_cte }}</td>
              <td>
                <button title="Detalhes" class="button-8">
                  <i style="font-size: 14px;" class="fa-solid fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </template>
  
  <script>
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
    name: 'ComercialOrcamentos',
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
        limit: null,
        mostraErro: false,
        novoModal: false,
        popup: false,
        disableBtn: false,
        carregandoinfo: false,
        resultados: 0,
        carregando: true,
        apis: [],
        itemsOrc: [],
        carregandoItemsOrc: false,
        condPagModal: false,
        codPag: null,
        tabPreModal: false,
        tabPre: null
      };
    },
    methods: {
      async refresh() {
        try {
          this.carregando = true;
          await axios.get(`${import.meta.env.VITE_BACKEND_IP}/logistica/refresh-cte`, config);
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/grid`, config);
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
    },
    async created() {
      try {
        const config = getAuthConfig();
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/grid`, config);
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