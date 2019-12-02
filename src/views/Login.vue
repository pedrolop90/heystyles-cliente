<template>
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-header bg-transparent pb-5">
                        <div class="text-muted text-center mt-2 mb-3"><small>Login</small></div>
                        <div class="btn-wrapper text-center">
                            <h1><i class="ni ni-circle-08 ni-4x" aria-hidden="true"></i></h1>
                        </div>
                    </div>
                    <div class="card-body px-lg-5 py-lg-5">
                        <form role="form">
                            <base-input class="input-group-alternative mb-3"
                                        placeholder="Correo"
                                        addon-left-icon="ni ni-email-83"
                                        v-model="model.email"
                                        :valid="validarEmail">
                            </base-input>

                            <base-input class="input-group-alternative"
                                        placeholder="contraseña"
                                        type="password"
                                        addon-left-icon="ni ni-lock-circle-open"
                                        v-model="model.password"
                                        :valid="validarPassword">
                            </base-input>

                            <base-checkbox class="custom-control-alternative">
                                <span class="text-muted">Recordarme</span>
                            </base-checkbox>
                            <div class="text-center">
                                <base-button type="primary" @click="ingresar()" class="my-4">Ingresar</base-button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-6">
                        <a href="#" class="text-light"><small>Olvido su contraseña?</small></a>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import axios from 'axios'
  export default {
    name: 'login',
    data() {
      return {
        model: {
          email: undefined,
          password: undefined
        }
      }
    },
    computed: {
        ...mapState(['servidorSeguridad', 'usuarios', 'servidorAcceso', 'menu']),
        ...mapMutations(['iniciarSesion', 'consultarSesion']),
        validarEmail () {
            if (this.model.email === '') {
                return false
            }
            else if (this.model.email === undefined) {
                return undefined
            }
            return true
        },
        validarPassword () {
            if (this.model.password === '') {
                return false
            }
            else if (this.model.password === undefined) {
                return undefined
            }
            return true
        }
    },
    methods: {
        async ingresar () {
            const self = this
            axios.post(this.servidorSeguridad + 'auth/login', {
                ...this.model
            })
            .then(response => {
                const datos = response.data.data
                if (!self.validarUsuarioActivo (datos)) {
                    return false
                }
                this.$toast.success({
                    title: 'Bienvenido',
                    message: 'Login exitoso'
                })
                // self.menu = datos.menuExtended.hijos
                // console.log('menu ' + self.menu)
                // console.log(response.data.data)
                // console.log(response.data.data.menuExtended.hijos)
                self.$store.commit('iniciarSesion', response.data.data.menuExtended.hijos)
                self.$store.commit('consultarSesion', response.data.data.usuario)
                axios.defaults.headers.common['usuario'] = this.sesionActiva.numeroDocumento // for all requests
                this.$router.push('/perfil/')
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: 'La contraseña o correo es incorrecto'
                })
            })
        },
        ingresarAux () {
            const self = this
            if (this.model.password === '' || this.model.email === '' || this.model.password === undefined || this.model.email === undefined) {
                this.$toast.info({
                    title: 'Campos Vacios',
                    message: 'Por favor ingrese un email y una contraseña valida'
                })
                return
            }
            const valido = this.usuarios.find(function (u) {
                return u.email === self.model.email && u.contrasena === self.model.password
            })
            if (valido === undefined) {
                this.$toast.info({
                    title: 'Login Fallido',
                    message: 'El correo o la contraseña no son de un usuario existente'
                })
                return
            }
            const correo = valido.email
            this.$store.commit('cambiarEstadoCuenta', correo)
            this.$router.push('/Perfil')
        },
        limpiarCampos () {
            this.model.password = ''
            this.model.email = ''
        },
        validarUsuarioActivo (datos) {
            console.log(datos.menuExtended.estado)
            if (datos.menuExtended.estado !== 'ACTIVO') {
                this.$toast.error({
                    title: 'Login Fallido',
                    message: 'Este usuario esta inactivo para hacer login'
                })
                return false
            } else {
                return true
            }
        }
    },
    created () {
        this.$store.commit('cerrarSesion')
    }
  }
</script>
<style>
</style>
