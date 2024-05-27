import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

import Usuarios from './components/usuarios/Usuarios.vue';
import Home from './components/home/Home.vue';
import Login from './components/auth/Login.vue';
import UsuariosInativos from './components/usuarios/UsuariosInativos.vue';
import Controladoria from './components/controladoria/Controladoria.vue';
import Qualidade from './components/qualidade/Qualidade.vue';
import QualidadeDocumentos from './components/qualidade/QualidadeDocumentos.vue';
import AnexPage from './components/ui/AnexPage.vue';
import DocumentosArquivados from './components/qualidade/DocumentosArquivados.vue';
import Totvs from './components/totvs/Totvs.vue';
import TotvsApis from './components/totvs/TotvsApis.vue';
import TotvsGruposDeVenda from './components/totvs/TotvsGruposDeVenda.vue';
import TotvsMovimentosServicosWms from './components/totvs/TotvsMovimentosServicosWms.vue';

import ChamadosTi from './components/ti/Chamados.vue';
import Rh from './components/rh/Rh.vue';
import RhDocumentos from './components/rh/Documentos.vue';
import ComercialLanding from './components/comercial/ComercialLanding.vue';
import ComercialCotacaoFrete from './components/comercial/ComercialCotacaoFrete.vue';
import ComercialGruposDeClientes from './components/comercial/ComercialGruposDeClientes.vue';
import ComercialOrcamentos from './components/comercial/ComercialOrcamentos.vue';
import ComercialClientes from './components/comercial/ComercialClientes.vue';
import ComercialVendedores from './components/comercial/ComercialVendedores.vue';
import ComercialTrack from './components/comercial/ComercialTrack.vue';

import LogisticaLanding from './components/logistica/LogisticaLanding.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login, meta: { hideNavbar: true, requiresAuth: false } },
  { path: '/home', component: Home },
  { path: '/usuarios', component: Usuarios },
  { path: '/usuarios/inativos', component: UsuariosInativos },
  { path: '/controladoria', component: Controladoria, meta: { carregando: true } },
  { path: '/qualidade', component: Qualidade, meta: { carregando: true } },
  { path: '/qualidade/documentos', component: QualidadeDocumentos, meta: { carregando: true } },
  { path: '/qualidade/documentos/arquivados', component: DocumentosArquivados, meta: { carregando: true } },
  { path: '/rh', component: Rh },
  { path: '/rh/documentos', component: RhDocumentos },
  { path: '/chamados', component: ChamadosTi },
  { path: '/totvs', component: Totvs },
  { path: '/totvs/apis', component: TotvsApis },
  { path: '/totvs/grupos-de-venda', component: TotvsGruposDeVenda },
  { path: '/totvs/movimentos-servicos-wms', component: TotvsMovimentosServicosWms },
  { path: '/arquivos', component: AnexPage },
  { path: '/comercial', component: ComercialLanding },
  { path: '/comercial/cotacao-de-frete', component: ComercialCotacaoFrete },
  { path: '/comercial/grupos-de-clientes', component: ComercialGruposDeClientes },
  { path: '/comercial/orcamentos', component: ComercialOrcamentos },
  { path: '/comercial/clientes', component: ComercialClientes },
  { path: '/comercial/vendedores', component: ComercialVendedores },
  { path: '/comercial/track-order', component: ComercialTrack },
  { path: '/logistica', component: LogisticaLanding },
  { path: '/:notFound(.*)', redirect: '/home' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    return next();
  }

  const token = document.cookie;

  if (!token) {
    return next('/login');
  }

  let config = {
    headers: {
      'Authorization': token
    }
  };

  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/verify-jwt`, config);

    if (response.status !== 200) {
      return next('/login');
    }

    const decoded = jwtDecode(token);

    if (to.path === '/usuarios' || to.path === '/totvs') {
      const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
      const isAdmin = userResponse.data[0]?.admin;

      if (isAdmin === 0) {
        return next('/home');
      }
    }

    next();
  } catch (error) {
    console.error('Error during route guard:', error);
    next('/login');
  }
});

export default router;
