<template>
    <div class="row" style="padding: 1%; border-radius: 5px; margin-right: 0;">
        <div class="table-wrapper table-responsive table-striped mb-5" style="padding: 0;">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>Descritivo</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td> <router-link class="button-8 mb-2" to="/comercial/movimentos-servicos-wms">Movimentos Serviços WMS</router-link> </td>
                </tr>
                <tr>
                <td> <router-link class="button-8 mb-2" to="/comercial/saldo-por-endereco-wms">Saldo por Endereco WMS</router-link> </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import TableSearch from '../ui/TableSearch.vue';

export default {
    components: {
        TableSearch
    }
}

</script>