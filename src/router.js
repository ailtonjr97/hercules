import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

import Usuarios from './components/usuarios/Usuarios.vue';
import Home from './components/home/Home.vue';
import Login from './components/auth/Login.vue';
import UsuariosInativos from './components/usuarios/UsuariosInativos.vue';
import Controladoria from './components/controladoria/Controladoria.vue';
import Qualidade from './components/qualidade/Qualidade.vue';
import QualidadeDocumentos from './components/qualidade/QualidadeDocumentos.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/home' },
      { path: '/login', component: Login, meta: {hideNavbar: true, requiresAuth: false }},
      { path: '/home', component: Home},
      { path: '/usuarios', component: Usuarios},
      { path: '/controladoria', component: Controladoria, meta: {carregando: true}},
      { path: '/qualidade', component: Qualidade, meta: {carregando: true}},
      { path: '/qualidade/documentos', component: QualidadeDocumentos, meta: {carregando: true}},
      { path: '/usuarios/inativos', component: UsuariosInativos },
      { path: '/:notFound(.*)', redirect: '/home' }
    ]
  });


router.beforeEach(async function(to, from, next) {
  let loggedIn = false;
  if(to.path == '/login'){
    next();
  }else{
    if(document.cookie == 0 || document.cookie == 2){
      return next('/login')
    }else{
      function delete_cookie(name) {
        document.cookie = name +'=; Path=/qualidade; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      delete_cookie('jwt')
      const token = document.cookie
      let config = {
          headers: {
              'Authorization': token
          }
      }
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/verify-jwt`, config);
      if(response.status == 200){
        loggedIn = true;
      }else{
        loggedIn = false;
      }

      if (!loggedIn) {
        return next('/login');
      } else if (loggedIn) {
        if(to.path == '/usuarios'){
          const token = document.cookie
          let config = {
              headers: {
                  'Authorization': token
              }
          }
          const decoded = jwtDecode(token);
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config)
          const isAdmin = response.data[0].admin
          if(isAdmin != 0){
            return next();
          }else{
            return next('/home');
          }
        }
        return next();
      } else{
        next()
      }
    }
  }
});

export default router;