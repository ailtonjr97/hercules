import { createRouter, createWebHistory } from 'vue-router';

import Usuarios from './components/usuarios/Usuarios.vue';
import Home from './components/home/Home.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/home' },
      { path: '/home', component: Home},
      { path: '/usuarios', component: Usuarios },
      { path: '/:notFound(.*)', component: null }
    ]
  });

export default router;