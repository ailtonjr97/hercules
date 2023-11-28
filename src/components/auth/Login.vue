<template>
<div id="cabecalho">
    <div class="row"  style="width: 99.8%; margin-left: 0.2%; height: 100vh;">
      <div class="col-md-6 offset-md-3" style="width: 40%; margin-left: 30%;">
        <div class="card my-5">
          <span class="card-body cardbody-color p-lg-5">
            <div class="mb-3">
              <input type="email" class="form-control" id="Username" aria-describedby="emailHelp" placeholder="Email" v-model="form.email">
            </div>
            <div class="mb-3">
              <input type="password" class="form-control" id="password" placeholder="Senha" v-model="form.password">
            </div>
            <div class="text-center"><button type="submit" class="btn btn-color px-5 mb-2 w-100" @click="submit">Login</button></div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default{
    data(){
        return {
            form: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        async submit(){
            try {
                const response = await axios.post(`${import.meta.env.VITE_DOTNET_IP}/auth/login`, this.form);
                document.cookie = `jwt=${response.data.token}`;

            } catch (error) {
                if(error.response.data == 'User not found or inactive.'){
                    alert("Usuário não encontrado ou inativo.")
                } else if(error.response.data == 'Incorrect password!'){
                    alert("Senha incorreta.")
                }
                else{
                    alert("Erro ao fazer login. Favor tentar mais tarde.")
                }
            }
        }
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