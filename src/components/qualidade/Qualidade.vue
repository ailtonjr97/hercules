<template>
    <div class="row mt-2">
        <div class="col d-flex justify-content-start">
            <card :address="'/qualidade/documentos'" :title="'Documentos'" :body="'Documentos relacionados à Qualidade.'" :src="'https://cdn-icons-png.flaticon.com/512/4585/4585036.png'"></card>
        </div>
    </div>
</template>

<script>
import Card from '../ui/Card.vue';

export default{
    components: {
        Card
    }
}
</script>