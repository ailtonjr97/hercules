<template>
<div class="modal fade" :id="id" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" :id="id">{{ titulo }}</h5>
      </div>
      <div class="modal-body">
        <slot name="carregando">
        </slot>
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <slot name="fechar"></slot>
        <slot name="confirmar"></slot>
      </div>
    </div>
  </div>
</div>
</template>

<script>
 export default {
    props: {
        id: {
            type: String,
            required: true,
            default: "Inserir ID"
        },
        titulo: {
           type: String,
           required: true,
           default: "Inserir Título." 
        }
    }
 }
</script>