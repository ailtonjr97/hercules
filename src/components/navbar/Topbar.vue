<template>
<nav class="sidebar-navigation">
	<ul style="padding-left: 0; min-height: 120%;">
		<li @click="goHome">
			<i class="fa-solid fa-home"></i>
			<span class="tooltip">Home</span>
		</li>
		<li @click="goQualidade">
			<i class="fa-solid fa-file-circle-check" style="margin-left: 10%;"></i>
			<span class="tooltip">Quali.</span>
		</li>
		<li @click="goUsuarios">
			<i class="fa-solid fa-user"></i>
			<span class="tooltip">Usuarios</span>
		</li>
		<li @click="logout">
			<i class="fa-solid fa-arrow-right-from-bracket fa-rotate-180"></i>
			<span class="tooltip">Sair</span>
		</li>
	</ul>
</nav>
<div id="mestra">
	<slot name="content"></slot>
</div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            isAdmin: 0
        }
    },
	computed: {
		goHome(){
			this.$router.push('/home')
		},
		goUsuarios(){
			this.$router.push('/usuarios')
		},
		goQualidade(){
			this.$router.push('/qualidade')
		}
	},
    methods: {
        async logout(){
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            this.$router.push('/login');
        }
    },
}
</script>

<style>
 .sidebar-navigation {
	 display: inline-block;
	 min-height: 100vh;
	 width: 50px;
	 background-color: #22577a;
	 float: left;
}
 .sidebar-navigation ul {
	 text-align: center;
	 color: white;
}
 .sidebar-navigation ul li {
	 padding: 16px 0;
	 cursor: pointer;
	 transition: all ease-out 120ms;
}
 .sidebar-navigation ul li i {
	 display: block;
	 font-size: 24px;
	 transition: all ease 450ms;
}
 .sidebar-navigation ul li .tooltip {
	 display: inline-block;
	 position: absolute;
	 background-color: #313443;
	 padding: 8px 15px;
	 border-radius: 3px;
	 margin-top: -26px;
	 left: 60px;
	 opacity: 0;
	 visibility: hidden;
	 font-size: 13px;
	 letter-spacing: 0.5px;
}
 .sidebar-navigation ul li .tooltip:before {
	 content: '';
	 display: block;
	 position: absolute;
	 left: -4px;
	 top: 10px;
	 transform: rotate(45deg);
	 width: 10px;
	 height: 10px;
	 background-color: inherit;
}
 .sidebar-navigation ul li:hover {
	 background-color: #22252e;
}
 .sidebar-navigation ul li:hover .tooltip {
	 visibility: visible;
	 opacity: 1;
}
 .sidebar-navigation ul li.active {
	 background-color: #22252e;
}
 .sidebar-navigation ul li.active i {
	 color: #98d7ec;
}
 
 
</style>