<template >
<div v-if="carregando" id="loading"></div>
<div v-if="fullLoad">
  <table-top :resultados="resultados">
      <template v-slot:tableButtons>
        <button class="button-8 mb-2" @click="openNewUserModal">Novo Usuário</button>
        <router-link class="button-8 mb-2" to="/usuarios/inativos">Inativos</router-link>
      </template>
  </table-top>
  <div class="row mb-2">
    <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
    <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Nome:'"></table-search>
  </div>
  <div class="table-wrapper table-responsive table-striped">
    <table class="fl-table" id="myTable">
      <thead>
        <tr style="height: 25px">
          <th>ID</th>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id">
          <td>
            <p>{{ usuario.id }}</p>
          </td>
          <td>
            <p>{{ usuario.name }}</p>
          </td>
          <td>
            <p>{{ usuario.email }}</p>
          </td>
          <td style="padding-bottom: 15px;">
            <button class="button-8" @click="infoEditarModal(usuario.id)">Editar</button>
            <button class="button-8" @click="inactivate(usuario.id)">Inativar</button>
            <button class="button-8" @click="passwordReset(usuario.id)">Resetar Senha</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<modal v-if="editUserModal" :title="'Editar usuário'">
  <template v-slot:body>
    <loading v-if="carregandoinfoUsuario"></loading>
    <div class="row" v-if="!carregandoinfoUsuario">
      <form-floating :placeholder="'Nome:'" :id="'user-name'" :type="'text'" v-model="editar.name"></form-floating>
      <form-floating :placeholder="'Email:'" :id="'user-email'" :type="'email'" v-model="editar.email"></form-floating>
      <select-floating :placeholder="'É admin?'" :id="'user-admin'" :options="optionsAdmin" v-model="editar.admin"></select-floating>
    </div>
    <div class="row mt-2" v-if="!carregandoinfoUsuario">
      <select-floating :placeholder="'É DPO?'" :id="'user-dpo'" :options="optionsAdmin" v-model="editar.dpo"></select-floating>
      <select-floating :placeholder="'Setor'" :id="'user-setor'" :options="optionsSetores" v-model="editar.setor"></select-floating>
    </div>
  </template>
  <template v-slot:buttons v-if="!carregandoinfoUsuario">
        <button class="button-8" @click="closeEditUserModal">Fechar</button>
        <button type="button" class="button-8" @click="submitUser(idSubmitUser)">Executar</button>
  </template>
</modal>

<modal v-if="newUserModal" :title="'Cadastrar Novo Usuário'">
  <template v-slot:body>
    <div class="row mt-3">
        <form-floating :placeholder="'Nome:'" :id="'name'" :type="'text'" v-model="form.name"></form-floating>
        <form-floating :placeholder="'Email:'" :id="'email'" :type="'email'" v-model="form.email"></form-floating>
        <select-floating :placeholder="'É admin?'" :id="'admin'" :options="optionsAdmin" v-model="form.admin"></select-floating>
    </div>
    <div class="row mt-2">
      <form-floating :placeholder="'Senha:'" :id="'password'" :type="'password'" v-model="form.password"></form-floating>
      <select-floating :placeholder="'Setor:'" :id="'setor'" :options="optionsSetores" v-model="form.setor"></select-floating>
    </div>
  </template>
  <template v-slot:buttons>
        <button class="button-8" @click="openNewUserModal">Fechar</button>
        <button type="button" class="button-8" @click="submit">Executar</button>
  </template>
</modal>

</template>

<script>
import axios from 'axios';
import Modal from '../ui/Modal.vue';
import FormFloating from '../ui/FormFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';
import Loading from '../ui/Loading.vue';
import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';

let config = {
  headers: {
    'Authorization': document.cookie.replace('jwt=', ''),
  }
}

 export default{
  components: {
    Modal,
    FormFloating,
    SelectFloating,
    Loading,
    TableTop,
    TableSearch
  },
  data(){
    return{
      editUserModal: false,
      newUserModal: false,
      fullLoad: false,
      idSubmitUser: null,
      carregandoinfoUsuario: false,
      carregando: true,
      usuarios: [],
      informacoes: [],
      resultados: null,
      form: {
          name: '',
          email: '',
          admin: '',
          password: '',
          setor: ''
      },
      editar: {
        name: '',
        email: '',
        admin: null,
        dpo: null,
        setor: ''
      }
    }
  },
  computed: {
      placeholder(){
          return ["Nome:", "E-mail:", "É admin?", "Senha:", "Setor:", "É DPO?"];
      },
      colunaNoBanco(){
          return ["name", "email", "admin", "password", "setor"];
      },
      colunaNoBancoUsuario(){
          return ["user-name", "user-email", "user-admin", "user-dpo", "user-setor"];
      },
      optionsAdmin(){
          return [{valor: 0, descri: 'Não'}, {valor: 1, descri: 'Sim'}];
      },
      optionsSetores(){
          return [
              {valor: "Tecnologia da Informação", descri: 'Tecnologia da Informação'},
              {valor: "Engenharia de Processos", descri: 'Engenharia de Processos'},
              {valor: "Controladoria", descri: 'Controladoria'},
              {valor: "Qualidade", descri: 'Qualidade'},
              {valor: "PCP", descri: 'PCP'},
              {valor: "Produção", descri: 'Produção'},
          ];
      },
  },
  methods: {
    async openNewUserModal(){
      this.newUserModal ? this.newUserModal = false : this.newUserModal = true;
    },
    async closeEditUserModal(){
      this.editUserModal = false;
    },
    async pageRefresh(){
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/get_all`, config)
        this.usuarios = response.data
        this.resultados = response.data.length
        this.carregando = false
        this.fullLoad = true;
      } catch (error) {
        console.log(error);
        alert('Falha ao recarregar usuários')
      }
    },
    async passwordReset(id){
      try {
        this.carregando = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/password-reset/${id}`, config);
          if(response.status == 200){
            this.pageRefresh()
          }
      } catch (error) {
          console.log(error);
          alert("Falha ao resetar senha do usuário.");
      }
    },
    async inactivate(id){
      try {
        this.carregando = true;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/inactivate/${id}`, config)
        if(response.status == 200){
          this.pageRefresh()
        }else{
          throw new Error();
        }
      } catch (error) {
        alert('Falha ao inativar usuário');
      }
    },
    async submit(){
        try {
            this.newUserModal = false
            this.carregando = true;
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/users/register`, this.form, config);
            if(response.status == 200){
              this.pageRefresh()
            }
        } catch (error) {
          console.log(error)
            if(error.response.status == 401){
                alert("Usuário já existe.")
            }else{
                alert("Erro ao cadastrar usuário.")
            };
        }
    },
    async submitUser(id){
      try {
          this.closeEditUserModal();
          this.carregando = true;
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/users/alter/${id}`, this.editar, config);
          if(response.status == 200){
            this.pageRefresh();
          }
      } catch (error) {
          console.log(error)
          alert("Erro ao editar usuário")
      }
    },
    async infoEditarModal(id){
      try {
        this.editUserModal = true;
        this.idSubmitUser = id;
        this.carregandoinfoUsuario = true;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${id}`, config);
        this.editar = response.data[0];
        this.carregandoinfoUsuario = false;
      } catch (error) {
        console.log(error)
        alert("Erro ao mostrar informações. Favor tentar novamente.")
      }
    }
  },
  async created(){
    try {
      let config = {
        headers: {
          'Authorization': document.cookie.replace('jwt=', ''),
        }
      }
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/get_all`, config)
      this.usuarios = response.data
      this.resultados = response.data.length
      this.carregando = false
      this.fullLoad = true;
    } catch (error) {
      console.log(error)
      alert('Erro ao carregar página.')
    }
  }
 }
</script>