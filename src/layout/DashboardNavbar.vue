<template>
  <div>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <ul class="navbar-nav form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <li class="nav-item dropdown px-5 my-1">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                <span class="avatar avatar-lg rounded-circle">
                  <h5>
                    <div
                      style="border-radius:9px; position:absolute"
                      class="my-2"
                      pill
                      variant="danger"
                      v-if="cantidadNoificaciones > 0">
                        <i class="ni ni-bell-55 ni-2x text-red"></i>
                    </div>
                  </h5>
                  <foto :imagen="fotografia.base64" :extension="fotografia.extension" v-if="verImagen"/>
                </span>
                      <div class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">{{sesionActiva.nombres}}</span>
                      </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Bienvenido!</h6>
                        </div>
                        <router-link to="/perfil" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>Mi perfil</span>
                        </router-link>
                        <router-link to="/notificacion" class="dropdown-item">
                            <i class="ni ni-bell-55"></i>
                            <span>Notificaciones</span>
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <router-link to="/" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Cerrar Sesion</span>
                        </router-link>
                    </template>
                </base-dropdown>
            </li>
            <base-dropdown class="nav-item" position="right" v-if="false">
              <a slot="title" class="nav-link nav-link-icon my--2" href="#" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
                <i class="ni ni-bell-55 ni-3x text-red" style="position: absolute; z-index:-1">
                  </i>
                  <h5><b-badge style="border-radius:9px; background-color: #fcfcfd;" class="my-2" pill variant="danger">8</b-badge></h5>
                  
                   </a>
                   <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </base-dropdown>
        </ul>
    </base-nav>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
      style="min-height: 200px; background-image: url(img/logo_completo.jpeg); background-size: cover; background-position: center top;">
       <!-- Mask -->
      <span class="mask bg-gradient-success opacity-6"></span>
    </base-header>  
  </div>
</template>
<script>
import {mapState} from 'vuex'
import foto from '@/views/Perfil/foto'
import axios from 'axios'
  export default {
    components: {
      foto
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchQuery: '',
        fotografia: {
          id: undefined,
          base64: undefined,
          extension: undefined
        },
        verImagen: false,
        show: false,
        isRunning: false,
        minutes:0,
        secondes:0,
        time:20,
        timer:null,
        cantidadNoificaciones: 0
      }
    },
    computed: {
      ...mapState(['servidorAcceso','sesionActiva', 'notificaciones', 'servidorNotificacion'])
    },
    methods: {
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      async cargarNotificaciones () {
        const notificacionesAux = (await axios.get(this.servidorNotificacion + '/notificaciones')).data.data
        const aux = notificacionesAux.filter(function (notificacion) {
          return notificacion.estado === 'SIN_LEER'
        });
        this.cantidadNoificaciones = aux.length
      },
      start () {
			 this.isRunning = true
			 if (!this.timer) {
				  this.timer = setInterval( () => {
						if (this.time > 0) {
							 this.time--
						} else {
							 clearInterval(this.timer)
							 this.reset()
						}
				  }, 1000 )
			 }
		 },
		 stop () {
			 this.isRunning = false
			 clearInterval(this.timer)
			 this.timer = null
		 },
		 reset () {
			  // this.stop()
			  this.time = 20
			  this.secondes = 0
        this.minutes = 0
        console.log('hola mundo')
        this.cargarNotificaciones ()
        this.stop ()
        this.start ()
		 },
		 setTime (payload) {
			 this.time = ( 10 + payload.secondes)
		 }
    },
    created: async function() {
      if (this.notificaciones > 0) {
        this.show = true
      }
      this.verImagen = false
      const foto = (await axios.get(this.servidorAcceso + 'usuarios/personas/' + this.sesionActiva.numeroDocumento + '/fotografia')).data.data
      this.fotografia = {
        ...foto
      }
      this.verImagen = true
      await this.cargarNotificaciones ()
      this.start()
    },
    destroyed() {
      this.stop ()
    }
  }
</script>