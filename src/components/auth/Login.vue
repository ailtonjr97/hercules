<template>
  <div v-if="carregando" id="loading"></div>
  <div id="fundo">
    <div class="formulario">
      <img src="/images/image_Vq.png" alt="" style="margin-left: 25%; width: 50%; border-radius: 5px">
      <label class="labela" style="color: #ffffff" for="username">Usuário</label>
      <input class="botao-login" type="text" placeholder="E-mail" id="username" name="email" v-model="email">
      <label class="labela" style="color: #ffffff" for="password">Senha</label>
      <input class="botao-login" type="password" placeholder="Senha" id="password" name="password" v-model="password">
      <button @click="login()" id="entrar">Entrar</button>
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
import axios from 'axios';
import Cookies from 'js-cookie';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';

export default {
  components: {
    Loading,
    FormFloating,
    Modal
  },
  data() {
    return {
      carregando: false,
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        this.carregando = true;
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_IP}/auth/login`,
          [{ 'email': this.email }, { 'password': this.password }],
          { headers: { 'Authorization': document.cookie } }
        );
        const token = response.data.token;

        // Expira em 12 horas
        const expires = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
        Cookies.set('jwt', token, { expires });

        window.location.href = `${import.meta.env.VITE_LOGIN_IP}/home`;
      } catch (error) {
        console.log(error);
        this.carregando = false;
        alert('Erro ao autenticar. Favor tentar novamente');
      }
    }
  }
};
</script>


<style media="screen">

#fundo {
  background-image: url('/images/office.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background{
    width: 430px;
    height: 520px;
    position: absolute;
    transform: translate(-50%,-50%);
    left: 50%;
    top: 50%;
}
.formulario{
    width: 400px;
    background-color: rgba(255,255,255,0.13);
    position: absolute;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.1);
    box-shadow: 0 0 40px rgba(8,7,16,0.6);
    padding: 50px 35px;
}
.formulario *{
    font-family: 'Poppins',sans-serif;
    color: black;
    letter-spacing: 0.5px;
    outline: none;
    border: none;
}
.formulario h3{
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    text-align: center;
}

.labela{
    display: block;
    margin-top: 15px;
    font-size: 16px;
    font-weight: 500;
}
.botao-login{
    display: block;
    height: 50px;
    width: 100%;
    background-color: rgba(255,255,255,80%);
    border-radius: 3px;
    padding: 0 10px;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 300;
}
::placeholder{
    color: #000000;
}
#entrar{
    margin-top: 50px;
    width: 100%;
    background-color: #ffffff;
    color: #080710;
    padding: 15px 0;
    font-size: 18px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
}
.social{
  margin-top: 30px;
  display: flex;
}
.social div{
  background: red;
  width: 150px;
  border-radius: 3px;
  padding: 5px 10px 10px 5px;
  background-color: rgba(255,255,255,0.27);
  color: #eaf0fb;
  text-align: center;
}
.social div:hover{
  background-color: rgba(255,255,255,0.47);
}
.social .fb{
  margin-left: 25px;
}
.social i{
  margin-right: 4px;
}
</style>