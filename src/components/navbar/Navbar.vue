<template>
	<!--- Navbar --->
<nav class="navbar navbar-expand-lg" style="background-color: #3a619b;">
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"><i class="fa-solid fa-bars" style="color: white;"></i></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent" style="background-color: #3a619b; z-index: 99;">
    <div class="row">
        <div class="col d-flex justify-content-start">
            <router-link to="/home" class="nav-link" style="padding: 0 8px;">
                <div class="item">
                    <img v-if="logo == 'AUDITE'" src="/images/image_Vq.png" alt="" style="width: 75%; border-radius: 5px">
                    <img v-if="logo == 'FIBRACEM'" src="/images/logo_fibracem_F_1.png" alt="" style="width: 85%; border-radius: 5px">
                </div>
            </router-link>

            <div class="dropdown" style="margin-left: 15%;">
                <i class="fa-solid fa-comments-dollar" style="color: white; font-size: 20px; margin-top: 40%; cursor: pointer;" data-bs-toggle="dropdown"></i>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">Comercial</h6>
                    <router-link to="/comercial/orcamentos" class="nav-link" style="padding: 0 8px;">Orçamentos</router-link>
                    <router-link to="/comercial/pedidos" class="nav-link" style="padding: 0 8px;">Pedidos</router-link>
                </div>
            </div>

            <div class="dropdown" style="margin-left: 15%;">
                <i class="fa-solid fa-dollar" style="color: white; font-size: 20px; margin-top: 80%; cursor: pointer;" data-bs-toggle="dropdown"></i>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">Logística</h6>
                    <router-link to="/financeiro/cte" class="nav-link" style="padding: 0 8px;">CTE</router-link>
                    <router-link to="/financeiro/pdf-nf" class="nav-link" style="padding: 0 8px;">PDF NF</router-link>
                </div>
            </div>

            <div class="dropdown" style="margin-left: 20%;">
                <i class="fa-solid fa-user" style="color: white; font-size: 20px; margin-top: 60%; cursor: pointer;" data-bs-toggle="dropdown"></i>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">{{ name }}</h6>
                    <router-link to="/usuarios" class="nav-link" style="padding: 0 8px;">Usuários</router-link>
                    <router-link to="#" @click="logout()" class="nav-link" style="padding: 0 8px;">Sair</router-link>
                </div>
            </div>

        </div>
    </div>
  </div>
</nav>

<slot name="content"></slot>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default{
    data(){
        return{
            logo: null,
            mostraStatus: false,
            isAdmin: 0,
            name: '',
        }
    },
    methods: {
        async logout(){
            function deleteAllCookies() {
                    const cookies = document.cookie.split(";");

                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                }
            deleteAllCookies();
            function delete_cookie(name) {
                document.cookie = name +'=; Path=/qualidade; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              }
              delete_cookie('jwt')
            window.location.href = 'http://audite.click/login';
        }
    },
    async created(){
        try {
            this.carregando = true;
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
                }
                const token = getCookie('jwt')
                let config = {
                    headers: {
                        'Authorization': `jwt=${token}`
                    }
            };
            const decoded = jwtDecode(token);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
            this.logo = import.meta.env.VITE_LOGO
            this.isAdmin = response.data[0].admin;
            this.name = response.data[0].name;
        } catch (error) {
            console.log(error);
            this.mostraStatus = true;
        }
    }
}
</script>

<style scoped>

a{
    color: inherit;
}

a:hover{
    color: white;
    background-color: #3a619b;
}

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
    height: 45px;
}

.navbar {
    background-color: #22577A;
}
.navbar .navbar-nav .nav-link {
    color: #fff;
}
.navbar .navbar-nav .nav-link:hover {
    color: #fbc531;
}
.navbar .navbar-nav .active > .nav-link {
    color: #fbc531;
    }
</style>