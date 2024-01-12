<template>
<popup v-if="popup"></popup>
<div v-if="carregando" id="loading"></div>
<div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
<table-top :resultados="resultados">
    <template v-slot:tableButtons>
        <button class="button-8 mb-2">Atualizar</button>
    </template>
</table-top>
<div class="row mb-2">
    <form-floating :placeholder="'Código:'" :id="'codigo'" :type="'text'" v-model="codigo" v-on:keyup.enter="pesquisaProduto(codigo, results)"></form-floating>
    <form-floating :placeholder="'Resultados:'" :id="'resultado'" :type="'number'" v-model="results" v-on:keyup.enter="pesquisaProduto(codigo, results)"></form-floating>
</div>
<div class="table-wrapper table-responsive table-striped mb-5">
    <table class="fl-table" id="myTable">
    <thead>
        <tr style="height: 25px">
        <th>Código</th>
        <th>Nome</th>
        <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="produto in produtos" :key="produto.ID">
        <td>
            <p>{{ produto.CODIGO }}</p>
        </td>
        <td>
            <p>{{ produto.DESCRI }}</p>
        </td>
        <td>
            <button class="button-8" @click="openEditarModal(documento.id)"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button>
        </td>
        </tr>
    </tbody>
    </table>
</div>
</div>
</template>

<script>
import axios from 'axios';
import Popup from '../ui/Popup.vue';
import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import FormFloating from '../ui/FormFloating.vue';

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

export default{
    components: {
        FormFloating,
        TableSearch,
        TableTop,
        Popup
    },
    data(){
        return{
            results: 1000,
            resultados: null,
            codigo: '',
            popup: false,
            produtos: [],
            resultados: null,
            fullLoad: false,
            carregandoinfo: false,
            carregando: true,
        }
    },
    methods: {
        async pesquisaProduto(codigo, results){
            try {
                console.log(codigo, results)
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produtos/pesquisa?codigo=${codigo}&resultados=${results}`, config);
                this.produtos = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                console.log(error);
                alert("Falha ao pesquisar produtos. Favor tentar mais tarde.");
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produtos/get_all`, config);
                this.produtos = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
            } catch (error) {
                console.log(error);
                alert("Erro ao carregar página. Favor tentar mais tarde.");
                this.carregando = false;
            }
    }
}
</script>