<template>
  <div>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <ul class="navbar-nav form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                <span class="avatar avatar-sm rounded-circle">
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
                        <div class="dropdown-divider"></div>
                        <router-link to="/" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Cerrar Sesion</span>
                        </router-link>
                    </template>
                </base-dropdown>
            </li>
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
        verImagen: false
      };
    },
    computed: {
      ...mapState(['servidorAcceso','sesionActiva'])
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
      }
    },
    created: async function() {
      this.verImagen = false
      const foto = (await axios.get(this.servidorAcceso + 'usuarios/personas/' + this.sesionActiva.numeroDocumento + '/fotografia')).data.data
      this.fotografia = {
        ...foto
      }
      this.verImagen = true
      console.log('fotografia')
      console.log(this.fotografia)
      console.log('foto')
      console.log(foto)
    }
  };
</script>
