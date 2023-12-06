<template>
    <div class="row" style="max-width: 99%; padding: 1%;">
        <div class="col d-flex justify-content-start">
            <card :address="'/qualidade/documentos'" :title="'Documentos'" :body="'Documentos relacionados à Qualidade.'" :src="'https://cdn-icons-png.flaticon.com/512/4585/4585036.png'"></card>
        </div>
    </div>
</template>

<script>
import Card from '../ui/Card.vue';
import Topbar from '../navbar/Topbar.vue';

export default{
    components: {
        Card,
        Topbar
    }
}
</script>