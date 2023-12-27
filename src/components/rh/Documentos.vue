<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
                <button class="button-8 mb-2" @click="abrirNovaEntidade">Nova Entidade</button>
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
                    <button class="button-8 mb-2" @click="abrirNovoDocumento(documento.id)"><i style="font-size: 14px;" class="fa-solid fa-file-circle-plus"></i></button>
                    <button class="button-8" @click="openAnexoModal(documento.id)"><i style="font-size: 14px;" class="fa-solid fa-folder-open"></i></button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
    
<modal v-if="novaEntidade" :title="'Nova Entidade:'">
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

<modal v-if="novoDocumento" :title="'Novo Documento:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row" v-if="!carregandoinfo" style="text-align: center;">
            <input v-if="images == 0" style="width: 100%; height: 250px;" type="file" id="images" @change="uploadFile" ref="file" multiple>
            <div v-if="images != 0" id="carouselExampleIndicators" class="carousel slide" data-bs-interval="false" style="border-radius: 5px">
                <ol class="carousel-indicators">
                    <li v-for="(imagem, idx) in images" :key="idx" :class="{ 'active': idx==0 }" data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="idx"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item" v-for="(imagem, idx) in images" :key="idx" :class="{ 'active': idx==0 }">
                        <div class="row">
                            <div class="col-lg-8">
                                <embed class="preview" :src="imagem.source" style="width: 100%; height: 600px;">
                            </div>
                            <div class="col-lg-4">
                                <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="criar.nome"></form-floating>
                                <form-floating class="mt-2" :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="criar.nome"></form-floating>
                            </div>
                        </div>
                    </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
                    <img src="/images/setaEsq.png" alt="" style="width: 25%;">
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
                    <img src="/images/setaEsq.png" alt="" style="width: 25%; transform: rotate(180deg);">
                    <span class="sr-only">Next</span>
                </a>
            </div>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="refazerDocumentos">Refazer</button>
        <button class="button-8" @click="fecharNovoDocumento">Fechar</button>
        <button class="button-8" @click="submitFile">Executar</button>
    </template>
</modal>

<modal v-if="anexosModal" :title="'Documentos:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row mt-2" v-if="!carregandoinfo">
            <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>ID</th>
                <th>Nome</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="anexo in listaArquivos" :key="anexo.id">
                <td>
                    <p>{{ anexo.id }}</p>
                </td>
                <td>
                    <a target="__blank" :href="`${ip}/files/${anexo.filename}`">{{ anexo.original_name }}</a>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="closeAnexoModal">Fechar</button>
    </template>
</modal>
    
</template>

<style scoped>
.drop-container {
  position: relative;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  padding: 20px;
  border-radius: 10px;
  border: 2px dashed #555;
  color: #444;
  cursor: pointer;
  transition: background .2s ease-in-out, border .2s ease-in-out;
}

.drop-container:hover,
.drop-container.drag-active {
  background: #eee;
  border-color: #111;
}

.drop-container:hover .drop-title,
.drop-container.drag-active .drop-title {
  color: #222;
}

.drop-title {
  color: #444;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  transition: color .2s ease-in-out;
}

input[type=file] {
  width: 350px;
  max-width: 100%;
  color: #000000;
  padding: 5px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #555;
}

input[type=file]::file-selector-button {
  margin-top: 6%;
  margin-left: 40%;
  border: none;
  background: #396ddd;
  padding: 10px 20px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background .2s ease-in-out;
}

input[type=file]::file-selector-button:hover {
  background: #0d45a5;
}
</style>
    
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
import AnexBox from '../ui/AnexBox.vue'

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
        AnexFloating,
        AnexBox
    },
    data(){
        return{
            ip: import.meta.env.VITE_BACKEND_IP,
            anexosModal: false,
            whereId: null,
            selectedFiles: [],
            images: [],
            popup: false,
            paises: [],
            novaEntidade: false,
            novoDocumento: false,
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
        async closeAnexoModal(){
            this.anexosModal = false;
            this.images = [];
            this.selectedFiles = [];
        },
        async openAnexoModal(id){
            try {
                this.carregandoinfo = true;
                this.anexosModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/anexos-lista/${id}`, config);
                this.listaArquivos = response.data
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                alert("Falha ao abrir anexos. Favor tentar mais tarde.")
            }
        },
        async refazerDocumentos(){
            this.images = [];
            this.selectedFiles = [];
        },
        async uploadFile(e) {
            let vm = this;
            this.selectedFiles = e.target.files;
            for (let i = 0; i < this.selectedFiles.length; i++) {
                this.images.push({"source": URL.createObjectURL(this.selectedFiles[i])});
            }
        },
        async submitFile() {
            for(let i = 0; i < this.selectedFiles.length; i++){
                const formData = new FormData();
                formData.append('file', this.selectedFiles[i]);
                const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': document.cookie };
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/anexos/${this.whereId}`, formData, { headers });
            }
            this.pageRefresh();
        },
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
                this.selectedFiles = [];
                this.showPopup();
                this.novoDocumento = false;
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
        async abrirNovoDocumento(id){
            this.whereId = id
            this.novoDocumento = true;
        },
        async fecharNovoDocumento(){
            this.images = [];
            this.novoDocumento = false;
            this.selectedFiles = [];
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