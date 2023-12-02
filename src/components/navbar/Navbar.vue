<template>
	<!--- Navbar --->
<nav class="navbar navbar-expand-lg" style="background-color: #3a619b;">
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent" style="background-color: #3a619b; z-index: 99;">
    <ul class="navbar-nav mr-auto">
        <div class="row">
            <div class="col d-flex justify-content-start">
                <li class="nav-item" style="width: 90px;">
                    <router-link to="/home" class="nav-link" style="padding: 0 8px;">
                        <div class="item">
                            <img src="/images/logo_fibracem_F_1.png" alt="" style="width: 130%;">
                        </div>
                    </router-link>
                </li>
                <li class="nav-item" style="width: 90px;">
                    <router-link to="/qualidade" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-house" style="margin-left: 40%;"></i>
                            <span class="caption">Qualidade</span>
                        </div>
                    </router-link>
                </li>
                <li class="nav-item" style="width: 110px;">
                    <router-link to="/controladoria" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-house" style="margin-left: 80%;"></i>
                            <span class="caption">Controladoria</span>
                        </div>
                    </router-link>
                </li>
                <li :style="[isAdmin != 0 ? {'display': 'block'} : {'display': 'none'}]" class="nav-item pl-1 bloqueados">
                    <router-link to="/usuarios" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-user" style="margin-left: 22%;"></i>
                            <span class="caption">Usuários</span>
                        </div>
                    </router-link>
                </li>
                <li class="nav-item" @click="logout">
                    <a href="#" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span class="caption">Sair</span>
                        </div>
                    </a>
                </li>
            </div>
        </div>
    </ul>
  </div>
</nav>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default{
    data(){
        return{
            isAdmin: 0
        }
    },
    methods: {
        async logout(){
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            this.$router.push('/login')
        }
    },
    async created(){
        this.carregando = true;
        const token = document.cookie.replace('jwt=', '')
        let config = {
            headers: {
                'Authorization': token
            }
        }
        const decoded = jwtDecode(token);

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config)
        this.isAdmin = response.data[0].admin        
    }
}
</script>

<style scoped>
.bloqueados{
    display: none;
}

.fa-solid{
    font-size: 18px;
}

div.item {
    vertical-align: top;
    display: inline-block;
    text-align: center;
    width: 50px;
}
.caption {
    display: block;
}

.navbar{
    height: 65px;
}

.navbar { background-color: #3a619b; }
.navbar .navbar-nav .nav-link { color: #fff; }
.navbar .navbar-nav .nav-link:hover { color: #fbc531; }
.navbar .navbar-nav .active > .nav-link { color: #fbc531; }
</style>