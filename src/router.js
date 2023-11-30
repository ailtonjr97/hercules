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

  router.beforeEach(function(to, _, next) {
    var jwt = document.cookie.replace('jwt=','');
    if(jwt.length != 0 || !to.meta.requiresAuth){
      const response = axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/verify-jwt/${jwt}`);
      console.log(response);
      // if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
      //   next('/auth');
      // } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
      //   next('/coaches');
      // } else {
      //   next();
      // }
    }else{
      next('/login')
    }
  });

export default router;