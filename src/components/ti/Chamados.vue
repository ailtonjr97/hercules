<template>
    <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
                <button class="button-8 mb-2" @click="refresh">Atualizar</button>
            </template>
        </table-top>
        <div class="row mb-2">
            <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
            <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Requisitante:'"></table-search>
            <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Designado:'"></table-search>
            <table-search :id="'procuraBtn3'" :num="3" :placeholder="'Descrição:'"></table-search>
        </div>
        <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>ID</th>
                <th>Requisitante</th>
                <th>Designado</th>
                <th>Área</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="chamado in chamados" :key="chamado.id">
                <td>
                    <p v-if="chamado.urgencia == 2" style="background-color: yellow; border-radius: 5px">{{chamado.id}}</p>
                    <p v-if="chamado.urgencia == 3" style="background-color: red; border-radius: 5px">{{chamado.id}}</p>
                    <p v-else>{{chamado.id}}</p>
                </td>
                <td>
                    <p>{{ chamado.name }}</p>
                </td>
                <td>
                    <p>{{ chamado.designado}}</p>
                </td>
                <td>
                    <p>{{ chamado.area}}</p>
                </td>
                <td>
                    <p>{{ chamado.operacoes}}</p>
                </td>
                <td style="white-space: normal; word-break: break-word">
                    <p v-if="chamado.descricao.length <= 90">{{ chamado.descricao}}</p>
                    <p v-else>{{ chamado.descricao.substring(0, 255)}}... <a @click="openModalDescricao(chamado.descricao)" style="color: #0d6efd; text-decoration: underline; cursor: pointer;">(ver mais)</a></p>
                </td>
                <td>
                    <button class="button-8" @click="verChamado(chamado.id)"><i class="fa-solid fa-eye" style="font-size: 14px;"></i></button>
                    <button class="button-8" @click="editarChamado(chamado.id)"><i class="fa-solid fa-pen-to-square" style="font-size: 14px;"></i></button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>

    <modal v-if="modalVerChamado" :title="'Dados do chamado:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div v-if="!carregandoinfo">
            <div class="row">
                <form-floating :placeholder="'Setor:'" :id="'setor'" :type="'text'" v-model="visualizar.setor" ></form-floating>
                <form-floating :placeholder="'Área:'" :id="'area'" :type="'text'" v-model="visualizar.area" ></form-floating>
                <form-floating :placeholder="'Operações:'" :id="'operacoes'" :type="'text'" v-model="visualizar.operacoes" ></form-floating>
                <form-floating :placeholder="'Status:'" :id="'status'" :type="'text'" v-model="visualizar.status" ></form-floating>
                <form-floating :placeholder="'Urgência:'" :id="'urgencias'" :type="'text'" v-model="visualizar.urgencias" ></form-floating>
            </div>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="modalVerChamado = false">Fechar</button>
        </template>
    </modal>

    <modal v-if="modalDescricao" :title="'Descrição completa:'">
        <template v-slot:body>
            <div class="row">
                <textarea-floating :placeholder="'Descrição:'" :id="'descricao_completa'" v-model="modalDescricaoText" :rows="30"></textarea-floating>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="modalDescricao = false">Fechar</button>
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

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

export default {
    components: {
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
            modalDescricaoText: '',
            modalDescricao: false,
            modarEditarChamado: false,
            modalVerChamado: false,
            contagem: null,
            atualizador: 0,
            whereId: null,
            carregando: true,
            chamados: [],
            fullLoad: false,
            carregandoinfo: false,
            visualizar: {},
        }
    },
    methods: {
        async openModalDescricao(text){
            this.modalDescricao = true;
            this.modalDescricaoText = text;
        },
        async editarChamado(){
            try {
                
            } catch (error) {
                console.log(error);
                alert("Falha ao abrir modal de edição de chamados.");
                this.carregandoinfo = false;
            }
        },
        async verChamado(id){
            try {
                    this.carregandoinfo = true;
                    this.modalVerChamado = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/${id}`, config);
                    this.visualizar = response.data[0];
                    this.carregandoinfo = false;
                    console.log(this.visualizar)
                } catch (error) {
                    console.log(error)
                    alert('Erro ao mostrar documentos. Favor tentar mais tarde.')
                    this.carregandoinfo = false
            }
        },
        async refresh(){
            try {
                this.carregando = true;
                const loggedIn = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/logado`, config);
                const intranet_id = loggedIn.data[0].intranet_id
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/get_all/1/${intranet_id}`, config);
                this.chamados = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
        } catch (error) {
            console.log(error)
            alert("Erro ao carregar página. Favor tentar mais tarde.");
            this.carregando = false;
        }
        }
    },
    async created(){
        try {
            const config = {
                headers: {
                'Authorization': document.cookie,
                }
            }
            const loggedIn = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/logado`, config);
            const intranet_id = loggedIn.data[0].intranet_id
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/get_all/1/${intranet_id}`, config);
            this.chamados = response.data;
            this.resultados = response.data.length;
            this.fullLoad = true;
            this.carregando = false;
        } catch (error) {
            console.log(error)
            alert("Erro ao carregar página. Favor tentar mais tarde.");
            this.carregando = false;
        }
    },
    beforeUnmount(){
        clearInterval(this.atualizador)
    }
}
</script>