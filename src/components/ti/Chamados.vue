<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div class="row mt-2" style="margin: 0;">
        <div class="col-md-4 mb-3" v-for="api in apis" :key="api.id">
            <card-chamado :header="api.id">
                <template v-slot:body>{{ api.descricao }}</template>
                <template v-slot:requisitante>
                    <select-floating  :placeholder="'Requisitante:'" :id="'requisitante'"></select-floating>
                </template>
                <template v-slot:designado>
                    <select-floating  :placeholder="'Designado:'" :id="'designado'"></select-floating>
                </template>
            </card-chamado>
        </div>
    </div>

</template>

<script>
const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

import axios from 'axios';

import CardChamado from '../ui/CardChamado.vue'
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';
import TextareaFloating from '../ui/TextareaFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';
import Popup from '../ui/Popup.vue';

export default {
components: {
    CardChamado,
    Popup,
    Modal,
    Loading,
    FormFloating,
    TextareaFloating,
    SelectFloating
},
data(){
    return{
        token: '',
        popup: false,
        disableBtn: false,
        carregandoinfoApi: false,
        carregandoinfo: false,
        modalRelatorio: false,
        modalToken: false,
        resultados: 0,
        carregando: true,
        apis: [],
        modalApi: false,
        carregandoinfo: false,
        visualizar: {},
        dadosRelatorio: {},
        lista: {
            metodo: '',
            descricao: '',
            caminho: ''
        }
    }
},
methods: {
},
async created(){
    try {
        const config = {
            headers: {
            'Authorization': document.cookie,
            }
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/get_all/1`, config);
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

<style>
.esconder{
    display: none;
}
</style>