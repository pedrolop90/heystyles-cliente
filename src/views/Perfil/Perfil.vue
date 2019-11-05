<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Información Usuario</h3>
                                </div>
                            </div>
                        </div>
                        <template v-if="sesionActiva !== undefined && sesionActiva !== null">
                            <form @submit.prevent>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Nombres"
                                                        placeholder="Nombres"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.nombres"
                                                        ref="nombre"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Apellidos"
                                                        placeholder="Apellidos"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.apellidos"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input label="Cargo">
                                                <select class="form-control" v-model="model.cargoId">
                                                    <option v-for="cargo in cargos" :key="cargo.id" :value="cargo.id" >{{ cargo.nombre }}</option>
                                                </select>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input label="Tipo Documento">
                                                <select class="form-control" v-model="model.tipoDocumento">
                                                    <option v-for="item in tiposDocumento" :key="item.value" :value="item.value" >{{ item.text }}</option>
                                                </select>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Documento"
                                                        placeholder="N. Documento"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.numeroDocumento"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Email"
                                                        placeholder="heystyles@example.com"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.email"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Telefono"
                                                        placeholder="5 555 555"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.telefono"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Fecha de Nacimiento"
                                                        placeholder="Fecha de Nacimiento"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.lastName">
                                                <flat-picker slot-scope="{focus, blur}"
                                                            @on-open="focus"
                                                            @on-close="blur"
                                                            :config="{allowInput: true}"
                                                            class="form-control datepicker"
                                                            v-model="model.fechaNacimiento">
                                                </flat-picker>
                                            </base-input>
                                        </div>
                                    </div>
                                    <div class="text-right" >
                                        <base-button outline @click="actualizar()" type="success">Actualizar Información</base-button>
                                    </div>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const TIPO_DOCUMENTO = [
    {value: 'CC', text: 'Cedula'},
    {value: 'TI', text: 'Tarjeta de Identidad'}
]
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment'
import {mapState} from 'vuex'
import axios from 'axios'
  export default {
    components: {
      flatPicker
    },
    name: 'Perfil',
    data() {
      return {
        model: {
          nombres: '',
          apellidos: '',
          numeroDocumento: '',
          email: '',
          fechaNacimiento: moment().format('YYYY-MM-DD'),
          tipoDocumento: '',
          cargo: undefined,
          id: 0,
          idPersona: 0,
          telefono: ''
        },
        tiposDocumento: TIPO_DOCUMENTO,
        cargos: undefined,
        cargosAux: [
            {id: '1', nombre: 'Gerente'},
            {id: '2', nombre: 'Secretaria'},
            {id: '3', nombre: 'Bodeguero'}
        ]
      }
    },
    computed: {
        ...mapState(['servidorAcceso','sesionActiva'])
    },
    watch: {
        sesionActiva () {
            if (this.sesionActiva !== undefined) {
                this.model = {
                    ...this.sesionActiva
                }
            }
        },
        'model.cargoId' () {
            console.log('cambie')
        }
    },
    methods: {
        async actualizar () {
            axios.put(this.servidorAcceso + 'usuarios/usuarios', {
                ...this.model
            }).then(response => (
                this.$toast.success({
                    title: 'Actualizacion Exitosa',
                    message: 'Algunos cambios se veran reflejados al iniciar sesión de nuevo'
                })
            ))
            this.$store.commit('consultarSesion', this.model.numeroDocumento)
        },
        actualizarAux () {
            if (!this.validacion()) {
                return
            }
            const usuario = {
                ...this.model,
                contrasena: this.model.numeroDocumento
            }
            this.$store.commit('modificarUsuario', usuario)
            this.$router.push('/perfil')
            this.$toast.success({
                title: 'Exito',
                message: 'Se ha modificado correctamente su perfil, inicie nuevamente la sesión para ver los cambios reflejados'
            })
        },
        async apiCargos () {
            this.cargos = (await axios.get(this.servidorAcceso + 'usuarios/cargos')).data.data
        },
        validacion () {
            const nombreCampo = []
            if (this.model.nombres === '') {
                nombreCampo.push('nombres') 
            }
            if (this.model.apellidos === '') {
                nombreCampo.push('apellidos')
            }
            if (this.model.numeroDocumento === '') {
                nombreCampo.push('numero de documento')
            }
            const a = this.model.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/)
            console.log('++++ ' + a + ' ----- ' + a[0])
            if (a === '') {
                nombreCampo.push('email')
            }
            if (this.model.fechaNacimiento === '') {
                nombreCampo.push('fecha de nacimiento')
            }
            if (this.model.tipoDocumento === '') {
                nombreCampo.push('tipo de documento')
            }
            if (this.model.telefono === '') {
                nombreCampo.push('telefono')
            }
            if (nombreCampo.length > 0) {
                this.$toast.info({
                    title: 'Datos Vacios',
                    message: 'Los siguientes datos no pueden estas vacios ' + nombreCampo.join(', ')
                })
                return false
            }
            return true
        }
    },
    created: function() {
        this.apiCargos()
        if (this.sesionActiva) {
            this.model = {
                ...this.sesionActiva
            }
        }
    }
  }
</script>
<style>
</style>
