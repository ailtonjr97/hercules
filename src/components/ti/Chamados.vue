<template>

<div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">

            <div v-if="modoCard">
                <table-top :resultados="resultados">
                    <template v-slot:tableButtons>
                        <button class="button-8 mb-2" @click="refresh">Atualizar</button>
                        <button class="button-8" @click="mudarModoTabela">Ver em tabela</button>
                    </template>
                </table-top>
                <div class="row">
                    <div class="col-md-4 mb-5 d-flex justify-content-evenly" v-for="chamado in chamados" :key="chamado.id">
                        <div class="card" style="width: 31rem; background-color: #dfdfdf;">
                            <div class="card-header">
                                <div class="row">
                                    <div class="col-lg-9">
                                        <h5 style="margin-top: 2%;">{{ chamado.designado }}</h5>
                                    </div>
                                    <div class="col-sm-3">
                                        <button v-if="chamado.urgencia == 1" type="button" class="btn btn-primary" style="margin-left: 30%;">{{ chamado.id }}</button>
                                        <button v-if="chamado.urgencia == 3" type="button" class="btn btn-warning" style="margin-left: 30%;">{{ chamado.id }}</button>
                                        <button v-if="chamado.urgencia == 4" type="button" class="btn btn-danger" style="margin-left: 30%;">{{ chamado.id }}</button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h6 v-if="chamado.descricao.length <= 255">{{ chamado.descricao}}</h6>
                                <h6 v-else>{{ chamado.descricao.substring(0, 255)}}... <a @click="openModalDescricao(chamado.descricao)" style="color: #0d6efd; text-decoration: underline; cursor: pointer;">(ver mais)</a></h6>
                                <p class="card-text">- {{ chamado.name }}</p>
                            </div>
                            <ul class="list-group list-group-flush">
                                <button style="font-size: 14px; width: 10%; left: 85%;" class="button-8 mt-2 mb-2" @click="editarChamado(chamado.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div v-if="modoTabela">
                <table-top :resultados="resultados">
                    <template v-slot:tableButtons>
                        <button class="button-8 mb-2" @click="refresh">Atualizar</button>
                        <button class="button-8" @click="mudarModoCard">Ver em cartão</button>
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
                            <p v-if="chamado.urgencia == 1">{{chamado.id}}</p>
                            <p v-if="chamado.urgencia == 3" style="background-color: yellow; border-radius: 5px">{{chamado.id}}</p>
                            <p v-if="chamado.urgencia == 4" style="background-color: red; border-radius: 5px">{{chamado.id}}</p>
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
                            <p v-if="chamado.descricao.length <= 180">{{ chamado.descricao}}</p>
                            <p v-else>{{ chamado.descricao.substring(0, 180)}}... <a @click="openModalDescricao(chamado.descricao)" style="color: #0d6efd; text-decoration: underline; cursor: pointer;">(ver mais)</a></p>
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
                <textarea-floating :placeholder="'Descrição:'" :id="'descricao_completa'" v-model="modalDescricaoText"></textarea-floating>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="modalDescricao = false">Fechar</button>
        </template>
    </modal>

<modal v-if="modalEditarChamado" :title="'Editar chamado:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row" v-if="!carregandoinfo">
            <chosen-select-floating :descritivoEscolhido="requisitante.descritivoEscolhido" :valorEscolhido="requisitante.valorEscolhido" :options="requisitanteOptions" v-model="editar.usuario_id" :placeholder="'Requisitante:'" :id="'usuario_id'"></chosen-select-floating>
            <chosen-select-floating :descritivoEscolhido="designado.descritivoEscolhido" :valorEscolhido="designado.valorEscolhido" :options="designadoOptions" v-model="editar.designado_id" :placeholder="'Designado:'" :id="'designado_id'"></chosen-select-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="closeModalEditarChamado">Fechar</button>
        <button class="button-8" @click="enviarChamado">Executar</button>
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
import ChosenSelectFloating from '../ui/ChosenSelectFloating.vue'

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
        AnexFloating,
        ChosenSelectFloating
    },
    data(){
        return{
            modoTabela: false,
            modoCard: true,
            department_id: null,
            modalDescricaoText: '',
            modalDescricao: false,
            modalEditarChamado: false,
            modalVerChamado: false,
            contagem: null,
            atualizador: 0,
            whereId: null,
            carregando: true,
            chamados: [],
            fullLoad: false,
            carregandoinfo: false,
            visualizar: {},
            requisitante: {valorEscolhido: null, descritivoEscolhido: ''},
            designado: {valorEscolhido: null, descritivoEscolhido: ''},
            requisitanteOptions: [],
            designadoOptions: [],
            editar: {
                usuario_id: {},
                designado_id: {}
            }

        }
    },
    methods: {
        async mudarModoCard(){
            this.modoCard = true;
            this.modoTabela = false;
        },
        async mudarModoTabela(){
            this.modoCard = false;
            this.modoTabela = true;
        },
        async closeModalEditarChamado(){
            this.modalEditarChamado = false;
            this.designadoOptions = [],
            this.requisitanteOptions = []
        },
        async openModalDescricao(text){
            this.modalDescricao = true;
            this.modalDescricaoText = text;
        },
        async editarChamado(id){
            try {
                this.whereId = id;
                this.carregandoinfo = true;
                this.modalEditarChamado = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/get_one/${id}`, config);

                this.requisitante.valorEscolhido = response.data[0].requisitanteId
                this.requisitante.descritivoEscolhido = response.data[0].requisitante

                this.designado.valorEscolhido = response.data[0].designadoId
                this.designado.descritivoEscolhido = response.data[0].designadoName
                
                this.editar.usuario_id = response.data[0].requisitanteId
                this.editar.designado_id = response.data[0].designadoId

                const requisitanteResponse = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/requisitante`, config);
                requisitanteResponse.data.forEach(element => {
                    this.requisitanteOptions.push({descri: element.name, valor: element.id})
                });

                const designadoResponse = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/designado/${this.department_id}`, config);
                designadoResponse.data.forEach(element => {
                    this.designadoOptions.push({descri: element.name, valor: element.id})
                });

                this.carregandoinfo = false;
            } catch (error) {
                console.log(error);
                alert("Falha ao abrir modal de edição de chamados.");
                this.carregandoinfo = false;
            }
        },
        async enviarChamado(){
            try {
                this.modalEditarChamado = false;
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/chamados/update/${this.whereId}`, this.editar, config);
                this.refresh();
            } catch (error) {
                console.log(error);
                alert("Falha ao preenchar campos do chamado.");
                this.carregando = false;
            }
        },
        async verChamado(id){
            try {
                    this.carregandoinfo = true;
                    this.modalVerChamado = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/get_one/${id}`, config);
                    this.visualizar = response.data[0];
                    this.carregandoinfo = false;
                } catch (error) {
                    console.log(error)
                    alert('Erro ao mostrar chamado. Favor tentar mais tarde.')
                    this.carregandoinfo = false
            }
        },
        async refresh(){
            try {
                this.carregando = true;
                const loggedIn = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/logado`, config);
                const intranet_id = loggedIn.data[0].intranet_id
                console.log(loggedIn)
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/chamados/get_all/1/${intranet_id}`, config);
                this.designadoOptions = [],
                this.requisitanteOptions = []
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
            this.department_id = loggedIn.data[0].intranet_department_id
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