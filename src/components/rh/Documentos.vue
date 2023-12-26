<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
                <button class="button-8 mb-2" @click="abrirNovaEntidade">Nova Entidade</button>
                <button class="button-8 mb-2" @click="abrirNovoDocumento">Novo Documento</button>
                <button class="button-8 mb-2" @click="pageRefresh">Atualizar</button>
            </template>
        </table-top>
        <div class="row mb-2">
            <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
            <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Nome:'"></table-search>
        </div>
        <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="documento in documentos" :key="documento.id">
                <td>
                    <p>{{ documento.id }}</p>
                </td>
                <td>
                    <p>{{ documento.nome }}</p>
                </td>
                <td>
                    <button class="button-8 mb-2">teste</button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
    
<modal v-if="novaEntidade" :title="'Nova entidade:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row" v-if="!carregandoinfo">
            <select-floating :placeholder="'Natureza:'" :id="'natureza'" :options="[{valor: 'fisica', descri: 'Pessoa Física'}, {valor: 'juridica', descri: 'Pessoa Jurídica'}, {valor: 'outros', descri: 'Outros'}]" v-model="criar.natureza"></select-floating>
            <select-floating :placeholder="'Regime:'" :id="'regime'" :options="[{valor: 'clt', descri: 'CLT'}, {valor: 'estagio', descri: 'Estágio'}, {valor: 'terceiro', descri: 'Terceiro'}, {valor: 'fornecedor', descri: 'Fornecedor'}, {valor: 'transportadora', descri: 'Transportadora'}, {valor: 'outros', descri: 'Outros'}]" v-model="criar.regime"></select-floating>
            <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="criar.nome"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'Endereço:'" :id="'endereco'" :type="'text'" v-model="criar.endereco"></form-floating>
            <form-floating :placeholder="'Número:'" :id="'endereco_numero'" :type="'text'" v-model="criar.endereco_numero"></form-floating>
            <form-floating :placeholder="'Bairro:'" :id="'bairro'" :type="'text'" v-model="criar.bairro"></form-floating>
            <form-floating :placeholder="'Cidade:'" :id="'cidade'" :type="'text'" v-model="criar.cidade"></form-floating>
            <select-floating :placeholder="'País:'" :id="'pais'" :options="paises" v-model="criar.pais"></select-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharNovaEntidade">Fechar</button>
        <button class="button-8" @click="enviarNovaEntidade">Executar</button>
    </template>
</modal>

<modal v-if="novoDocumento" :title="'Nova entidade:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row" v-if="!carregandoinfo">
            <select-floating :placeholder="'Natureza:'" :id="'natureza'" :options="[{valor: 'fisica', descri: 'Pessoa Física'}, {valor: 'juridica', descri: 'Pessoa Jurídica'}, {valor: 'outros', descri: 'Outros'}]" v-model="criar.natureza"></select-floating>
            <select-floating :placeholder="'Regime:'" :id="'regime'" :options="[{valor: 'clt', descri: 'CLT'}, {valor: 'estagio', descri: 'Estágio'}, {valor: 'terceiro', descri: 'Terceiro'}, {valor: 'fornecedor', descri: 'Fornecedor'}, {valor: 'transportadora', descri: 'Transportadora'}, {valor: 'outros', descri: 'Outros'}]" v-model="criar.regime"></select-floating>
            <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="criar.nome"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'Endereço:'" :id="'endereco'" :type="'text'" v-model="criar.endereco"></form-floating>
            <form-floating :placeholder="'Número:'" :id="'endereco_numero'" :type="'text'" v-model="criar.endereco_numero"></form-floating>
            <form-floating :placeholder="'Bairro:'" :id="'bairro'" :type="'text'" v-model="criar.bairro"></form-floating>
            <form-floating :placeholder="'Cidade:'" :id="'cidade'" :type="'text'" v-model="criar.cidade"></form-floating>
            <select-floating :placeholder="'País:'" :id="'pais'" :options="paises" v-model="criar.pais"></select-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharNovaEntidade">Fechar</button>
        <button class="button-8" @click="enviarNovaEntidade">Executar</button>
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
import AnexFloating from '../ui/AnexFloating.vue';
import Popup from '../ui/Popup.vue';

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

export default {
    components: {
        Popup,
        TableTop,
        TableSearch,
        Modal,
        Loading,
        FormFloating,
        SelectFloating,
        TextareaFloating,
        AnexFloating
    },
    data(){
        return{
            popup: false,
            paises: [],
            novaEntidade: false,
            carregando: true,
            documentos: [],
            fullLoad: false,
            carregandoinfo: false,
            criar: {
                natureza: '',
                regime: '',
                nome: '',
                endereco: '',
                endereco_numero: '',
                bairro: '',
                cidade: '',
                pais: ''
            },
        }
    },
    methods: {
        async showPopup(){
            this.popup = true;
            setTimeout(()=>{
                this.popup = false;
            }, 2000);
        },
        async pageRefresh(){
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/get_all`, config);
                this.documentos = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                var self = this;
                Object.keys(this.criar).forEach(function(key, index) {
                    self.criar[key] = '';
                });
                this.images = [];
                this.showPopup();
            } catch (error) {
                console.log(error)
                alert("Falha ao carregar página.");
            }
        },
        async abrirNovaEntidade(){
            this.novaEntidade = true;
            this.carregandoinfo = true;
            const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/paises/{paises}');
            response.data.forEach(element => {
                this.paises.push({descri: element.nome.abreviado, valor: element.nome.abreviado})
            });
            this.carregandoinfo = false;
        },
        async fecharNovaEntidade(){
            this.paises = [];
            this.novaEntidade = false;
        },
        async enviarNovaEntidade(){
            try {
                this.fecharNovaEntidade();
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/create`, this.criar, config);
                this.pageRefresh();
            } catch (error) {
                console.log(error)
                alert('Erro ao criar documento. Favor tentar mais tarde.')
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
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/get_all`, config);
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