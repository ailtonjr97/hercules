<template>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2" @click="modalApi = true">Nova API</button>
        </template>
    </table-top>
    <div class="row mb-2">
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Método:'"></table-search>
        <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Descrição:'"></table-search>
        <table-search :id="'procuraBtn3'" :num="3" :placeholder="'Caminho:'"></table-search>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Método</th>
            <th>Descrição</th>
            <th>Caminho</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis" :key="api.id">
            <td>
                <p>{{ api.id }}</p>
            </td>
            <td>
                <p>{{ api.metodo }}</p>
            </td>
            <td>
                <p>{{ api.descricao }}</p>
            </td>
            <td>
                <p>{{ api.caminho }}</p>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>


<modal v-if="modalApi" :title="'Criar nova API Protheus'">
<template v-slot:body>
      <div class="row">
        <select-floating :placeholder="'Método:'" :id="'metodo'" :options="[{valor: 'GET', descri: 'GET'}, {valor: 'POST', descri: 'POST'}, {valor: 'PUT', descri: 'PUT'}, {valor: 'DELETE', descri: 'DELETE'}]" v-model="lista.metodo"></select-floating>
        <textarea-floating :placeholder="'Descrição:'" :id="'descricao'" v-model="lista.descricao" ></textarea-floating>
        <form-floating :placeholder="'Caminho:'" :id="'caminho'" :type="'text'" v-model="lista.caminho" ></form-floating>
      </div>
</template>
<template v-slot:buttons>
      <button class="button-8" @click="modalApi = false">Fechar</button>
      <button class="button-8" @click="novaApi">Executar</button>
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
import TextareaFloating from '../ui/TextareaFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';

export default {
components: {
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
        carregando: true,
        apis: [],
        modalApi: false,
        carregandoinfo: false,
        visualizar: {},
        lista: {
            metodo: '',
            descricao: '',
            caminho: ''
        }
    }
},
methods: {
    async novaApi(){
        try {
            this.modalApi = false;
            this.carregando = true;
            const config = {
                headers: {
                'Authorization': document.cookie,
                }
            }
            await axios.post(`${import.meta.env.VITE_BACKEND_IP}/totvs/apis/lista`, this.lista, config);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/apis/lista`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false
        } catch (error) {
            console.log(error);
            alert("Erro ao criar nova api.")
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/apis/lista`, config);
        this.apis = response.data;
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