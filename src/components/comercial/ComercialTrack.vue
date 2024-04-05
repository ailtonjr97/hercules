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
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'Código:'"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Descrição:'"></table-search>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>Itens</th>
            <th>ID</th>
            <th>Filial</th>
            <th>Pedido</th>
            <th>Separado CD</th>
            <th>Liberado Comercial</th>
            <th>Liberado Faturamento</th>
            <th>Faturado</th>
            <th>Liberado Expedição</th>
            <th>Expedido</th>
            </tr>
        </thead>
        <tbody>
            <div>
                
            </div>
            <tr v-for="api in apis">
                <td style="width: 600px;">
                    <button v-on:click="mudaSeta()" data-bs-toggle="collapse" :data-bs-target="'#a' + api.C5_FILIAL + api.C5_NUM" title="Itens" class="button-8"><i v-if="!abriu" class="fa-solid fa-arrow-up"></i><i v-if="abriu" class="fa-solid fa-arrow-down"></i></button>
                    <tr>
                        <div :id="'a' + api.C5_FILIAL + api.C5_NUM" class="panel-collapse collapse mt-2 mb-2">
                            <div class="table-wrapper table-striped">
                                <table class="fl-table" id="myTable">
                                    <thead>
                                        <th>Item</th>
                                        <th>Quantidade</th>
                                        <th>Separado CD</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="iten in api.itens[0]">
                                            <td style="word-wrap: break-word; width: 5px;">{{ iten.C6_PRODUTO }}</td>
                                            <td>{{ iten.C6_QTDVEN }}</td>
                                            <td><input type="checkbox" name="" id="" :checked="iten.C6_XSEPCD ? true: false" :disabled="iten.C6_XSEPCD ? true: false" @click="marcaSepC6(iten.C6_FILIAL, iten.C6_NUM, iten.C6_ITEM, iten.C6_PRODUTO)"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </tr>
                </td>
                <td>{{ api.R_E_C_N_O_ }}</td>
                <td>{{ api.C5_FILIAL}}</td>
                <td>{{ api.C5_NUM}}</td>
                <td><input type="checkbox" name="separado_cd" id="separado_cd" :checked="api.C5_XSEPCD ? true: false" disabled></td>
                <td><input type="checkbox" name="liberado_comercial" id="liberado_comercial" :checked="api.liberado_comercial == 1 ? true: false"></td>
                <td><input type="checkbox" name="liberado_faturamento" id="liberado_faturamento" :checked="api.liberado_faturamento == 1 ? true: false"></td>
                <td><input type="checkbox" name="faturado" id="faturado" :checked="api.faturado == 1 ? true: false"></td>
                <td><input type="checkbox" name="liberado_expedicao" id="liberado_expedicao" :checked="api.liberado_expedicao == 1 ? true: false"></td>
                <td><input type="checkbox" name="expedido" id="expedido" :checked="api.expedido == 1 ? true: false"></td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="novoModal" :title="'Criar nova cotação:'">
    <template v-slot:body>
        <div class="row">
            <div class="col">
                <select-floating :placeholder="'Filial'" :id="'user-setor'" :options="optionsFiliais" v-model="filial"></select-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Número do Pedido:'" :id="'numped'" :type="'number'" v-model="numped" ></form-floating><br>
            </div>
            <p style="color: red;" v-if="alertaPedido">Pedido não encontrado no Protheus. Verificar se esse pedido pertence a filial.</p>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharNovoModal()">Fechar</button>
        <button class="button-8 mt-2" @click="salvarModalCotacao(numped, filial)">Salvar</button>
    </template>
</modal>


</template>

<script>

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

import axios from 'axios';

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
        alertaPedido: false,
        numped: '',
        filial: '',
        novoModal: false,
        abriu: false,
        popup: false,
        disableBtn: false,
        carregandoinfo: false,
        resultados: 0,
        carregando: true,
        apis: [],
    }
},
methods: {
    async marcaSepC6(filial, num, item, produto){
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_c6xsepcd/${filial}/${num}/${item}/${produto}`, config);
            this.refresh();
            this.popup = true;
            setTimeout(()=>{
                this.popup = false;
            }, 2000);
        } catch (error) {
            alert("Falha ao executar ação. Tente novamente mais tarde.")
            this.carregando = false;
        }
    },
    async abrirNovoModal(){
        try {
            this.novoModal = true;
            //throw new Error
        } catch (error) {
            alert("Falha ao abrir modal. Tente novamente mais tarde.");
        }
    },
    async fecharNovoModal(){
        this.filial = '';
        this.numped = '';
        this.novoModal = false;
    },
    async mudaSeta(){
        if(this.abriu){
            this.abriu = false
        }else{
            this.abriu = true
        }
    },
    async refresh(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            alert("Falha ao recarregar página.");
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all`, config);
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