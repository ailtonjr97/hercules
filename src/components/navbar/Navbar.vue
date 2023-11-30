<template>
	<!--- Navbar --->
	<nav class="navbar navbar-expand-lg">
		<div class="container">
			<div class="collapse navbar-collapse" id="nvbCollapse">
				<ul class="navbar-nav ml-auto">
					<li class="nav-item pl-1">
                        <router-link to="/home" class="nav-link">
                            <div class="item">
                                <i class="fa-solid fa-house"></i>
                                <span class="caption">Início</span>
                            </div>
                        </router-link>
					</li>
                    <li class="nav-item pl-1">
                        <router-link to="/usuarios" class="nav-link">
                            <div class="item">
                                <i class="fa-solid fa-user" style="margin-left: 22%;"></i>
                                <span class="caption">Usuários</span>
                            </div>
                        </router-link>
					</li>
                    <li class="nav-item pl-1" @click="logout">
                        <a href="#" class="nav-link">
                            <div class="item">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                <span class="caption">Sair</span>
                            </div>
                        </a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<!--# Navbar #-->
</template>

<script>
export default{
    methods: {
        async logout(){
            function deleteAllCookies() {
                    const cookies = document.cookie.split(";");

                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
            deleteAllCookies();
            this.$router.push('/login')
        }
    }
}
</script>

<style>
.fa-solid{
    font-size: 18px;
}

div.item {
    vertical-align: top;
    display: inline-block;
    text-align: center;
    width: 50px;
}
img {
    width: 30px;
    height: 30px;
    background-color: blue;
}
.caption {
    display: block;
}

.navbar{
    height: 65px;
}

.navbar { background-color: #3a619b; }
.navbar .navbar-nav .nav-link { color: #fff; }
.navbar .navbar-nav .nav-link:hover { color: #fbc531; }
.navbar .navbar-nav .active > .nav-link { color: #fbc531; }
</style>