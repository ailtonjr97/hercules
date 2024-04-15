<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
</template>

<script>

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

import axios from 'axios';
import { jwtDecode } from "jwt-decode";
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
computed: {
    optionsFiliais(){
            return [
                {valor: "", descri: ''},
                {valor: "0101001", descri: 'FIBRACEM MATRIZ'},
                {valor: "0101002", descri: 'FIBRACEM FILIAL CD.'},
                {valor: "0101003", descri: 'FIBRACEM ESPIRITO SANTO CD'},
                {valor: "0101004", descri: 'FIBRACEM INDUSTRIA LINHARES'},
                {valor: "0101005", descri: 'FIBRACEM IMPORTACAO LINHARES'},
                {valor: "0101006", descri: 'FIBRACEM INJECOES'}
            ];
        },
    },
methods: {
    async refresh(){
        try {
            this.carregando = true;
            const token = document.cookie.replace('jwt=', '');
            let config = {
                headers: {
                    'Authorization': token
                }
            };
            const decoded = jwtDecode(token);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all?limit=100&pedido=${this.pedido}&data_ent=${this.dataEnt}&filial=${this.filial}`, config);
            const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
            this.apis = response.data;
            this.setor = logado.data[0].setor;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            this.mostraModal("Falha ao recarregar página.")
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
        const decoded = jwtDecode(token);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all?limit=100&pedido=&data_ent=&filial=`, config);
        const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
        this.apis = response.data;
        this.setor = logado.data[0].setor;
        this.nome = logado.data[0].name;
        this.resultados = response.data.length;
        this.carregando = false;
    } catch (error) {
        alert("Erro ao carregar página. Favor tentar mais tarde.");
        this.carregando = false;
    }
}
}
</script>