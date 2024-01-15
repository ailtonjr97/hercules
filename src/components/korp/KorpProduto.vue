<template>
<popup v-if="popup"></popup>
<div v-if="carregando" id="loading"></div>
<div class="row mb-4" style="width: 99.5%; margin-left: 0.3%;">
    <div v-for="(campo, coluna) in campos" class="col-md-3 mt-2">
        <form-floating :placeholder="`${coluna}:`" :id="'codigo'" v-model="campos[coluna]" :type="'text'" readonly></form-floating>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import Popup from '../ui/Popup.vue';
import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import FormFloating from '../ui/FormFloating.vue';

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

export default{
    components: {
        FormFloating,
        TableSearch,
        TableTop,
        Popup
    },
    data(){
        return{
            popup: false,
            campos: '',
            carregando: true,
        }
    },
    methods: {
    },
    async created(){
            try {
                const config = {
                    headers: {
                    'Authorization': document.cookie,
                    }
                }
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produto/${this.$route.params.id}`, config);
                let camposResponse = response.data[0];
                this.campos = Object.fromEntries(Object.entries(camposResponse).filter(([_, v]) => v != null));
                this.carregando = false;
            } catch (error) {
                console.log(error);
                alert("Erro ao carregar página. Favor tentar mais tarde.");
                this.carregando = false;
            }
    }
}
</script>