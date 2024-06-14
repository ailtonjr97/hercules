<template>
  <div v-if="carregando" id="loading"></div>
  <div id="cabecalho">
      <div class="row"  style="width: 99.8%; margin-left: 0.2%; height: 100vh;">
        <div class="col-md-6 offset-md-3" style="width: 40%; margin-left: 30%;">
          <div class="card my-5" style="margin-top: 29% !important; ">
            <span class="card-body cardbody-color p-lg-5">
              <div class="text-center">
                <form-floating :placeholder="'E-mail:'" :id="'email'" :type="'email'" v-model="email"></form-floating><br>
                <form-floating :placeholder="'Senha:'" :id="'senha'" :type="'password'" v-model="password"></form-floating>
                <button @click="login()" class="btn btn-color px-5 mb-2 w-100 mt-3">Login</button>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <modal v-if="error" :title="'Erro:'">
      <template v-slot:body>
        <h5>Credenciais incorretas</h5>
      </template>
      <template v-slot:buttons><button class="button-8" @click="close">Fechar</button></template>
    </modal>
  </template>

<script>
const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

import axios from 'axios';
import Cookies from 'js-cookie';

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
  Loading,
  FormFloating,
  Modal
},
data(){
    return{
      carregando: false,
      email: '',
      password: ''
    }
},
methods: {
  async login(){
    try {
      this.carregando = true;
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/auth/login`, [{'email': this.email}, {'password': this.password}], config);
      const token = response.data.token;

      // Expira em 12 horas
      const expires = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
      Cookies.set('jwt', token, { expires });

      window.location.href = `${import.meta.env.VITE_LOGIN_IP}/home`;
      this.$router.push({ name: 'Home' });

    } catch (error) {
      console.log(error)
      this.carregando = false;
      alert('Erro ao autenticar. Favor tentar novamente')
    }
  }
},
  async created(){
  }
}
</script>


<style scoped>
#cabecalho{
  background-image: url('../../../images/bg.jpg');
}
.btn-color{
  background-color: #0e1c36;
  color: #fff;
  
}

.profile-image-pic{
  height: 200px;
  width: 200px;
  object-fit: cover;
}



.cardbody-color{
  background-color: #ebf2fa;
}

a{
  text-decoration: none;
}
</style>