<template>
    <div class="row" style="max-width: 99%; padding: 1%;">
        <div class="col d-flex justify-content-start">
            <card :address="'/totvs/apis'" :title="`API's`" :body="`Conjunto das API's do Protheus`" :src="'images/api.png'"></card>
        </div>
    </div>
</template>

<script>
import Card from '../ui/Card.vue';

export default{
    components: {
        Card,
    }
}
</script>