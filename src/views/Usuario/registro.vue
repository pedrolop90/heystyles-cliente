<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Registro Usuario</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Nombres"
                                                        placeholder="Nombres"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.nombres"
                                                        :valid="validarNombres"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Apellidos"
                                                        placeholder="Apellidos"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.apellidos"
                                                        :valid="validarApellidos"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input label="Cargo" :valid="validarCargo">
                                                <select class="form-control" v-model="model.cargoId" >
                                                    <option v-for="cargo in cargos" :key="cargo.id" :value="cargo.id" >{{ cargo.nombre }}</option>
                                                </select>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input label="Tipo Documento" :valid="validarTipoDocumento">
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
                                                        :valid="validarNumeroDocumento"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Email"
                                                        placeholder="heystyles@example.com"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.email"
                                                        :valid="validarEmail"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Telefono"
                                                        placeholder="5 555 555"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.telefono"
                                                        :valid="validarTelefono"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Fecha de Nacimiento"
                                                        placeholder="Fecha de Nacimiento"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.lastName"
                                                        :valid="validarFechaNacimiento">
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
                                        <base-button outline @click="registrar()" type="success">Registrar Usuario</base-button>
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
    name: 'registro',
    data() {
      return {
        model: {
          nombres: undefined,
          apellidos: undefined,
          numeroDocumento: undefined,
          email: undefined,
          fechaNacimiento: moment().format('YYYY-MM-DD'),
          tipoDocumento: undefined,
          cargoId: undefined,
          id: null,
          idPersona: null,
          telefono: undefined
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
        ...mapState(['servidorAcceso', 'usuarios']),
        validarNombres () {
            if (this.model.nombres === '') {
                return false
            }
            else if (this.model.nombres === undefined) {
                return undefined
            }
            return true
        },
        validarApellidos () {
            if (this.model.apellidos === '') {
                return false
            }
            else if (this.model.apellidos === undefined) {
                return undefined
            }
            return true
        },
        validarNumeroDocumento () {
            if (this.model.numeroDocumento === '') {
                return false
            }
            else if (this.model.numeroDocumento === undefined) {
                return undefined
            }
            return true
        },
        validarEmail () {
            if (this.model.email === '') {
                return false
            }
            else if (this.model.email === undefined) {
                return undefined
            } else if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(this.model.email)) {
                return true
            }
            return false
        },
        validarTelefono () {
            if (this.model.telefono === '') {
                return false
            }
            else if (this.model.telefono === undefined) {
                return undefined
            }
            return true
        },
        validarFechaNacimiento () {
            if (this.model.fechaNacimiento === '') {
                return false
            }
            else if (this.model.fechaNacimiento === undefined) {
                return undefined
            }
            return true
        },
        validarTipoDocumento () {
            if (this.model.tipoDocumento === '' ) {
                return false
            }
            else if (this.model.tipoDocumento === undefined) {
                return undefined
            }
            return true
        },
        validarCargo () {
            if (this.model.cargoId === '' ) {
                return false
            }
            else if (this.model.cargoId === undefined) {
                return undefined
            }
            return true
        }
    },
    methods: {
        async registrar () {
            if (!this.validacion()) {
                this.$toast.info({
                    title: 'No se puede registrar el usuario',
                    message: 'Existen campos vacios o no validos dentro del formulario'
                })
                return
            }
            axios.post(this.servidorAcceso + 'usuarios/usuarios', {
                ...this.model
            })
            .then(response => {
                this.$toast.success({
                    title: 'Registro Exitoso',
                    message: 'Se actualizo el usuario correctamente'
                })
                this.$router.push('/usuario/')
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
        },
        registrarAux() {
            console.log(this.model)
            const usuario = {
                ...this.model,
                contrasena: this.model.numeroDocumento
            }
            this.usuarios.push(usuario)
            this.$router.push('/usuario/')
            this.$toast.success({
                title: 'Exito',
                message: 'Se ha registrado un usuario correctamente'
            })
        },
        async apiCargos () {
            this.cargos = (await axios.get(this.servidorAcceso + '/usuarios/cargos')).data.data
        },
        limpiarCampos () {
            this.model = {
                nombres: '',
                apellidos: '',
                numeroDocumento: '',
                email: '',
                fechaNacimiento: moment().format('YYYY-MM-DD'),
                tipoDocumento: '',
                cargoId: undefined,
                id: 0,
                idPersona: 0,
                telefono: ''
            }
        },
        validacion () {
            if (this.validarNombres && this.validarApellidos && this.validarCargo && this.validarTipoDocumento
            && this.validarNumeroDocumento && this.validarEmail && this.validarTelefono && this.validarFechaNacimiento) {
                return true
            }
            return false
        }
    },
    created: function() {
        this.apiCargos()
        
    }
  }
</script>
<style>
</style>
