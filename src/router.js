import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

import Usuarios from './components/usuarios/Usuarios.vue';
import Home from './components/home/Home.vue';
import Login from './components/auth/Login.vue'
import UsuariosInativos from './components/usuarios/UsuariosInativos.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/home' },
      { path: '/login', component: Login, meta: {hideNavbar: true, requiresAuth: false }},
      { path: '/home', component: Home},
      { path: '/usuarios', component: Usuarios },
      { path: '/usuarios/inativos', component: UsuariosInativos },
      { path: '/:notFound(.*)', redirect: '/home' }
    ]
  });

router.beforeEach(async function(to, from, next) {
  let loggedIn = false;
  if(to.path == '/login'){
    next();
  }else{
    if(document.cookie == 0){
      return next('/login')
    }else{
      var jwt = document.cookie.replace('jwt=','');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/verify-jwt/${jwt}`);
      if(response.status == 200){
        loggedIn = true;
      }else{
        loggedIn = false;
      }

      if (!loggedIn) {
        return next('/login');
      } else if (loggedIn) {
        return next();
      } else{
        next()
      }
    }
  }
});

export default router;