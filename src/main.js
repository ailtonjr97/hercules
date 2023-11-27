import { createApp } from 'vue'

import App from './App.vue'
import router from './router.js';
import FormFloatingText from './components/ui/FormFloatingText.vue'
import SelectFloating from './components/ui/SelectFloating.vue'

const app = createApp(App)

app.use(router);

app.component('form-floating-text', FormFloatingText);
app.component('select-floating', SelectFloating);

app.mount('#app');