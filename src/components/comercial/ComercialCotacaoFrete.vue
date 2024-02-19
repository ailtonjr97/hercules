<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2" @click="novaCotacao">Nova Cotação</button>
            <button class="button-8 mb-2" @click="refresh">Atualizar</button>
            <button class="button-8 mb-2" @click="exportarModal = true">Exportar</button>
        </template>
    </table-top>
    <div class="row mb-2">
        <form-floating :placeholder="'Pedido:'" :id="'pedido'" :type="'text'" v-model="pedido" v-on:keyup.enter="pesquisa(pedido, cotador_id, results)"></form-floating>
        <form-floating :placeholder="'Resultados:'" :id="'resultado'" :type="'number'" v-model="results" v-on:keyup.enter="pesquisa(pedido, cotador_id, results)"></form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Pedido</th>
            <th>Cotador</th>
            <th>Status</th>
            <th>Data Solicitação</th>
            <th>Data Resposta</th>
            <th>Revisão</th>
            <th>Valor</th>
            <th>Transportadora</th>
            <th>Prazo</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="resposta in respostas" :key="resposta.id">
            <td>
                <p>{{ resposta.id }}</p>
            </td>
            <td>
                <p>{{ resposta.pedido }}</p>
            </td>
            <td>
                <p>{{ resposta.cotador_id }}</p>
            </td>
            <td>
                <p>{{ resposta.status }}</p>
            </td>
            <td>
                <p>{{ resposta.data_solicit }}</p>
            </td>
            <td>
                <p>{{ resposta.data_resp }}</p>
            </td>
            <td>
                <p>{{ resposta.revisao }}</p>
            </td>
            <td>
                <p>{{ resposta.valor }}</p>
            </td>
            <td>
                <p>{{ resposta.id_transportadora }}</p>
            </td>
            <td>
                <p>{{ resposta.prazo }}</p>
            </td>
            <td>
                <button title="Visualizar" class="button-8" @click="openEditarModal(resposta.id)"><i style="font-size: 14px;" class="fa-solid fa-pen"></i></button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>

<modal v-if="exportarModal" :title="'Exportar para:'">
    <template v-slot:body>
        <div class="row">
            <div class="col">
                <a href=""></a>
                <img src="/images/excel.png" alt="" style="width: 10%; cursor: pointer;" @click="exportarExcel">
                <img src="/images/pdf.png" alt="" style="width: 10%; cursor: pointer; margin-left: 2%;" @click="exportarPdf">
            </div>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="exportarModal = false">Fechar</button> 
    </template>
</modal>

<modal v-if="modalInfo" :title="`Pedido ${proposta.pedido}:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <form-floating :placeholder="'Transportadora:'" :id="'id_transportadora'" :type="'text'" v-model="editar.id_transportadora" ></form-floating>
            <form-floating :placeholder="'Valor:'" :id="'valor'" :type="'text'" v-model="editar.valor" ></form-floating>
            <form-floating :placeholder="'Prazo:'" :id="'prazo'" :type="'text'" v-model="editar.prazo" ></form-floating>
        </div>
    </div>
    </template>
    <template v-slot:buttons>
        <button class="button-8 mt-2" @click="fecharModalInfo()">Fechar</button>
        <button class="button-8 mt-2" @click="salvarModalInfo(proposta.id)">Salvar</button>
    </template>
</modal>

<modal v-if="novaCotacaoModal" :title="`Nova Cotação`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <form-floating :placeholder="'Número do Pedido:'" :id="'numped'" :type="'text'" v-model="numped" ></form-floating><br>
            <p style="color: red;" v-if="alertaPedido">Pedido não encontrado no Protheus.</p>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharNovaCotacaoModal()">Fechar</button>
        <button class="button-8 mt-2" @click="salvarModalCotacao(numped)">Salvar</button>
    </template>
</modal>

</template>
    
<script>
import axios from 'axios';
import Popup from '../ui/Popup.vue';
import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import FormFloating from '../ui/FormFloating.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';

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
        Popup,
        Modal,
        Loading
    },
    data(){
        return{
            alertaPedido: false,
            values: [],
            numped: '',
            novaCotacaoModal: false,
            proposta: {},
            modalInfo: false,
            exportarModal: false,
            pedido: '',
            cotador_id: null,
            results: 1000,
            popup: false,
            moldes: [],
            resultados: null,
            fullLoad: false,
            carregandoinfo: false,
            carregando: true,
            editar: {
                id_transportadora: null,
                valor: '',
                prazo: ''
            }
        }
    },
    methods: {
        async salvarModalCotacao(numped){
            try {
                this.carregandoinfo = true;
                if(numped){
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sck/${numped}`, config);
                    response.data.objects.forEach(element => {
                        this.values.push({id: element.cknum})
                    });
                    const filtro = this.values.find(x => x.id == numped)
                    if (filtro){
                        this.carregandoinfo = false;
                        this.alertaPedido = false;
                    }else{
                        this.alertaPedido = true;
                        this.carregandoinfo = false;
                    }
                }else{
                    alert("Favor preencher o número do pedido.");
                    this.carregandoinfo = false;
                }
            } catch (error) {
                console.log(error)
               this.carregandoinfo = false;
               alert("Erro na operação. Favor entrar em contato com a TI.");
            }
        },
        async fecharNovaCotacaoModal(){
            this.novaCotacaoModal = false;
            this.carregandoinfo = false;
            this.numped = '';
            this.alertaPedido = false;
        },
        async novaCotacao(){
            try {
                this.carregandoinfo = true;
                this.novaCotacaoModal = true;
                this.carregandoinfo = false;
            } catch (error) {
                this.carregandoinfo = false;
                alert("Falha ao salvar informações. Tente novamente mais tarde.")
            }
        },
        async salvarModalInfo(id){
            try {
                this.modalInfo = false;
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/${id}`, this.editar, config);
                this.refresh();
                this.editar = {};
            } catch (error) {
                alert("Falha ao salvar informações. Tente novamente mais tarde.")
            }
        },
        async openEditarModal(id){
            try {
                this.modalInfo = true;
                this.carregandoinfo = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/${id}`, config);
                this.proposta = response.data[0];
                this.carregandoinfo = false;
            } catch (error) {
                this.carregandoinfo = false;
                alert("Falha ao mostrar mais informações.");
            }
        },
        async fecharModalInfo(){
            this.modalInfo = false;
            this.carregandoinfo = false;
        },
        async exportarExcel(){
            try {
                this.carregando = true;
                axios({
                    url: `${import.meta.env.VITE_BACKEND_IP}/engenharia/moldes/excel?codigo=${this.codigo}&resultados=${this.results}&descricao=${this.descricao}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    headers: {
                        'Authorization': document.cookie,
                    }
                }).then((response) => {
                    // create file link in browser's memory
                    const href = URL.createObjectURL(response.data);

                    // create "a" HTML element with href to file & click
                    const link = document.createElement('a');
                    link.href = href;
                    link.setAttribute('download', 'arquivo.xlsx');
                    document.body.appendChild(link);
                    link.click();

                    // clean up "a" element & remove ObjectURL
                    document.body.removeChild(link);
                    URL.revokeObjectURL(href);

                    this.carregando = false;
                });
                this.exportarModal = false;
            } catch (error) {
                alert("Falha ao baixar arquivo. Tentar novamente mais tarde.");
                this.carregando = false;
            }
        },
        async exportarPdf(){
            try {
                this.carregando = true;
                axios({
                    url: `${import.meta.env.VITE_BACKEND_IP}/engenharia/moldes/pdf?codigo=${this.codigo}&resultados=${this.results}&descricao=${this.descricao}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    headers: {
                        'Authorization': document.cookie,
                    }
                }).then((response) => {
                    // create file link in browser's memory
                    const href = URL.createObjectURL(response.data);

                    // create "a" HTML element with href to file & click
                    const link = document.createElement('a');
                    link.href = href;
                    link.setAttribute('download', 'arquivo.pdf');
                    document.body.appendChild(link);
                    link.click();

                    // clean up "a" element & remove ObjectURL
                    document.body.removeChild(link);
                    URL.revokeObjectURL(href);

                    this.carregando = false;
                });
                this.exportarModal = false;
            } catch (error) {
                alert("Falha ao baixar arquivo. Tentar novamente mais tarde.");
                this.carregando = false;
            }
        },
        async pesquisa(pedido, cotador_id, results){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/pesquisa?pedido=${pedido}&resultados=${results}&cotador_id=${cotador_id}`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                alert("Falha ao pesquisar. Favor tentar mais tarde.");
                this.carregando = false;
            }
        },
        async refresh(){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
            } catch (error) {
                alert("Falha ao recarregar. Favor tentar novamente mais tarde.")
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
            } catch (error) {
                alert("Erro ao carregar página. Favor tentar mais tarde.");
                this.carregando = false;
            }
    }
}
</script>