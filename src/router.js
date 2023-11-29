import { createRouter, createWebHistory } from 'vue-router';

import Usuarios from './components/usuarios/Usuarios.vue';
import Home from './components/home/Home.vue';
import Login from './components/auth/Login.vue'
import UsuariosInativos from './components/usuarios/UsuariosInativos.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/home' },
      { path: '/login', component: Login, meta: {hideNavbar: true}},
      { path: '/home', component: Home},
      { path: '/usuarios', component: Usuarios },
      { path: '/usuarios/inativos', component: UsuariosInativos },
      { path: '/:notFound(.*)', redirect: '/home' }
    ]
  });



export default router;