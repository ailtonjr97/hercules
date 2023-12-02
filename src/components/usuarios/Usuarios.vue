<template >
<div v-if="carregando" id="loading"></div>
<div v-if="fullLoad">
  <div class="row mt-2">
    <div class="col-md-4">
        <button class="button-8 mb-2" @click="openNewUserModal">Novo Usuário</button>
        <router-link class="button-8 mb-2" to="/usuarios/inativos">Inativos</router-link>
    </div>
    <div class="col-lg-6">
    </div>
    <div class="col-sm-2">
      <button type="button" class="button-8" id="result" style="float: right; margin-right: 0;">
        <span class="counter-value">{{ resultados }}</span>
        resultados
      </button>
    </div>
  </div>
  <div class="row mb-2">
    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="procuraBtn0" onkeyup="procura(0, 'procuraBtn0')"/>
        <label for="procuraBtn0">ID:</label>
      </div>
    </div>
    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="procuraBtn1" onkeyup="procura(1, 'procuraBtn1')"/>
        <label for="procuraBtn1">Nome:</label>
      </div>
    </div>
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
            <button  class="button-8" data-bs-toggle="modal" data-bs-target="#editarModal" @click="infoEditarModal(usuario.id)">Editar</button>
            <button class="button-8" @click="inactivate(usuario.id)">Inativar</button>
            <button class="button-8" @click="passwordReset(usuario.id)">Resetar Senha</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<modal-bootstrap :id="'editarModal'" :titulo="'Editar Usuário'">
  <template v-if="carregandoinfoUsuario" v-slot:carregando>
    <img style="width: 50%; height: 50%; margin-left: 25%;" src="../../../images/spinning.gif" alt="">
  </template>
  <template v-slot:body v-if="!carregandoinfoUsuario">
    <div class="row">
      <div class="col">
        <div class="form-floating">
          <input type="text" class="form-control" :id="colunaNoBancoUsuario[0]" :placeholder="placeholder[0]" v-model="editar.name" required>
          <label :for="colunaNoBancoUsuario[0]">{{ placeholder[0] }}</label>
        </div>
      </div>
      <div class="col">
        <div class="form-floating">
          <input type="email" class="form-control" :id="colunaNoBancoUsuario[1]" :placeholder="placeholder[1]" v-model="editar.email" required>
          <label :for="colunaNoBancoUsuario[1]">{{ placeholder[1] }}</label>
        </div>
      </div>
      <div class="col">
        <div class="form-floating">
            <select class="form-select" :id="colunaNoBancoUsuario[2]" v-model="editar.admin" required>
                <option v-for="option in optionsAdmin" v-bind:value="option.valor" >{{ option.descri }}</option>
            </select>
            <label :for="placeholder[2]">{{ placeholder[2] }}</label>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <div class="form-floating">
            <select class="form-select" :id="colunaNoBancoUsuario[3]" v-model="editar.dpo" required>
                <option v-for="option in optionsAdmin" v-bind:value="option.valor" >{{ option.descri }}</option>
            </select>
            <label :for="colunaNoBancoUsuario[3]">{{ placeholder[5] }}</label>
        </div>
      </div>
      <div class="col">
        <div class="form-floating">
            <select class="form-select" :id="colunaNoBancoUsuario[4]" v-model="editar.setor" required>
                <option v-for="option in optionsSetores" v-bind:value="option.valor" >{{ option.descri }}</option>
            </select>
            <label :for="colunaNoBancoUsuario[4]">{{ placeholder[4] }}</label>
        </div>
      </div>
    </div>
  </template>
  <template v-if="!carregandoinfoUsuario" v-slot:fechar>
    <button type="button" class="button-8" data-bs-dismiss="modal" id="fecharUser">Fechar</button>
  </template>
  <template v-if="!carregandoinfoUsuario" v-slot:confirmar>
    <button type="button" class="button-8" @click="submitUser(idSubmitUser)">Executar</button>
  </template>

</modal-bootstrap>

<modal v-if="newUserModal" :title="'Cadastrar Novo Usuário:'">
  <template v-slot:body>
    <div class="row mt-3">
        <div class="col">
          <form-floating :placeholder="'Nome:'" :id="'name'" :type="'text'" v-model="form.name"></form-floating>
        </div>
        <div class="col">
            <div class="form-floating">
                <input type="text" class="form-control" :id="colunaNoBanco[1]" :placeholder="placeholder[1]" v-model="form.email" required>
                <label :for="colunaNoBanco[1]">{{ placeholder[1] }}</label>
            </div>
        </div>
        <div class="col">
            <div class="form-floating">
                <select class="form-select" :id="colunaNoBanco[2]" v-model="form.admin" required>
                    <option v-for="option in optionsAdmin" v-bind:value="option.valor" >{{ option.descri }}</option>
                </select>
                <label :for="placeholder[2]">{{ placeholder[2] }}</label>
            </div>
        </div>
    </div>
    <div class="row mt-2" style="width: 99.8%; margin-left: 0.2%;">
        <div class="col">
            <div class="form-floating">
                <input type="password" class="form-control" :id="colunaNoBanco[3]" :placeholder="placeholder[3]" v-model="form.password" required>
                <label :for="colunaNoBanco[3]">{{ placeholder[3] }}</label>
            </div>
        </div>
        <div class="col">
            <div class="form-floating">
                <select class="form-select" :id="colunaNoBanco[4]" v-model="form.setor" required>
                    <option v-for="option in optionsSetores" v-bind:value="option.valor" >{{ option.descri }}</option>
                </select>
                <label :for="colunaNoBanco[4]">{{ placeholder[4] }}</label>
            </div>
        </div>
    </div>
  </template>
  <div class="row">
    <div class="col"></div>
  </div>
  <template v-slot:buttons>
        <button class="button-8" @click="openNewUserModal">Fechar</button>
        <button type="button" class="button-8" @click="submit">Executar</button>
  </template>
</modal>

</template>

<script>
import axios from 'axios'
import ModalBootstrap from '../ui/ModalBootstrap.vue';
import Modal from '../ui/Modal.vue';
import FormFloating from '../ui/FormFloating.vue';

let config = {
  headers: {
    'Authorization': document.cookie.replace('jwt=', ''),
  }
}

 export default{
  components: {
    ModalBootstrap,
    Modal,
    FormFloating
  },
  data(){
    return{
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
          this.carregando = true;
          document.getElementById('fecharUser').click();
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