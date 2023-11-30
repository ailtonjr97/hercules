<template>
<div id="cabecalho">
    <div class="row"  style="width: 99.8%; margin-left: 0.2%; height: 100vh;">
      <div class="col-md-6 offset-md-3" style="width: 40%; margin-left: 30%;">
        <form v-on:submit.prevent="submit">
        <div class="card my-5" style="margin-top: 29% !important; ">
          <span class="card-body cardbody-color p-lg-5">
            <div class="mb-3">
              <input type="email" class="form-control" id="Username" aria-describedby="emailHelp" placeholder="Email" v-model="form.email">
            </div>
            <div class="mb-3">
              <input type="password" class="form-control" id="password" placeholder="Senha" v-model="form.password">
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-color px-5 mb-2 w-100">Login</button>
              <div id="loading" v-if="logador" style="margin-bottom: 50%;"></div>
            </div>
          </span>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default{
    data(){
        return {
          logador: false,
            form: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        async submit(){
            try {
                this.logador = true;
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/auth/login`, this.form);
                document.cookie = `jwt=${response.data}`;
                setTimeout(()=>{
                  this.$router.push('/home')
                }, 2000)
            } catch (error) {
              if(error.response.status == 404){
                alert(error.response.data)
                this.logador = false;
              }else if (error.response.status == 401){
                alert(error.response.data)
                this.logador = false;
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