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
                                <base-button type="primary" @click="ingresarAux()" class="my-4">Ingresar</base-button>
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
import {mapState} from 'vuex'
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
        ...mapState(['servidorAcceso', 'usuarios']),
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
        ingresar () {
            this.$router.push('/Perfil') 
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
            console.log('el resultado es  ' + valido)
            if (valido === undefined) {
                this.$toast.info({
                    title: 'Login Fallido',
                    message: 'El correo o la contraseña no son de un usuario existente'
                })
                return
            }
            const correo = valido.email
            this.$store.commit('cambiarEstadoCuenta', correo)
            setTimeout(3000)
            this.$router.push('/Perfil')
        }
    },
    created () {
        this.$store.commit('cerrarSesion')
    }
  }
</script>
<style>
</style>
