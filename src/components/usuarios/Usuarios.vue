<template>

<div style="padding-top: 1.5%">
  <div class="row">
    <div class="col-md-4">
        <router-link class="button-8 mb-2" to="/usuarios/novo">Novo usuário</router-link>
        <a class="button-8" href="/usuarios/inativos">Inativos</a>
    </div>
    <div class="col-lg-6">
    </div>
    <div class="col-sm-2">
      <button type="button" class="button-8 mb-2" id="result" style="float: right;">
        <span class="counter-value">{{ resultados }}</span>
        resultados
      </button>
    </div>
  </div>
  <div class="row mb-2">
    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="procuraBtn0" onkeyup="procura(0, 'procuraBtn0')"/>
        <label for="procuraBtn0">ID:</label>
      </div>
    </div>
    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="procuraBtn1" onkeyup="procura(1, 'procuraBtn1')"/>
        <label for="procuraBtn1">Nome:</label>
      </div>
    </div>
  </div>
  <div class="table-wrapper table-responsive table-striped">
    <table class="fl-table" id="myTable">
      <thead>
        <tr style="height: 25px">
          <th>ID</th>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Admin</th>
          <th>DPO</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <div v-if="carregando" id="loading"></div>
        <tr v-for="usuario in usuarios" :key="usuario.id">
          <td>
            <p>{{ usuario.id }}</p>
          </td>
          <td>
            <p>{{ usuario.name }}</p>
          </td>
          <td>
            <p>{{ usuario.email }}</p>
          </td>
          <td>
            <p></p>
          </td>
          <td>
            <p></p>
          </td>
          <td style="padding-bottom: 15px;">
            <a class="button-8" href="/usuarios/editar/<%=user.id%>">Editar</a>
            <a class="button-8" href="/usuarios/inativar/<%=user.id%>">Inativar</a>
            <a class="button-8" href="/usuarios/mudarsenha/<%=user.id%>">Mudar Senha</a>
          </td>
        </tr>
      </tbody>
      <tbody></tbody>
    </table>
  </div>
</div>
</template>

<script>
 export default{
  data(){
    return{
      carregando: true,
      usuarios: [],
      resultados: null
    }
  },
  async created(){
    const response = await fetch('http://192.168.2.5:5000/user/get_all')
    const responseJson = await response.json()
    this.usuarios = responseJson
    this.carregando = false
    this.resultados = responseJson.length
  }
 }
</script>