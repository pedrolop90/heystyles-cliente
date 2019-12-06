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
                        <div class="text-center" v-if="loader">
                            <vue-loaders name="ball-beat" color="blue" scale="2" class="text-center"></vue-loaders>
                        </div>
                        <template v-if="sesionActiva !== undefined && sesionActiva !== null && !loader">
                            <form @submit.prevent>
                                <div class="card card-profile shadow">
                                    <b-row class="justify-content-md-center">
                                        <div class="col-lg-2 form-group">
                                            <foto :imagen="fotografia.base64" :extension="fotografia.extension" />
                                        </div>
                                    </b-row>
                                    <b-row class="justify-content-md-center">
                                        <div class="col-lg-3 form-group">
                                            <div class="input-group input-group-sm">
                                                <b-form-file
                                                    accept="image/jpeg, image/png, image/gif"
                                                    @change="onFileSelected"
                                                    placeholder="Escojer foto..."
                                                    browse-text="Buscar"
                                                    class="form-control form-control-sm"/>
                                            </div>
                                        </div>
                                    </b-row>
                                    <div class="card-body pt-0 pt-md-4">
                                        <div class="row">
                                            <div class="col-lg-4">
                                                <base-input alternative=""
                                                            label="Nombres"
                                                            placeholder="Nombres"
                                                            input-classes="form-control-alternative"
                                                            v-model="model.nombres"
                                                            :valid="validarNombres"
                                                            ref="nombre"
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
                                                <base-input alternative=""
                                                    label="Cargo"
                                                    input-classes="form-control-alternative"
                                                    v-model="cargo"
                                                    disabled
                                                />
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
                                            <base-button outline @click="actualizar()" type="success">Actualizar Información</base-button>
                                        </div>
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
import foto from './foto'
  export default {
    components: {
      flatPicker,
      foto
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
        fotografia: {
            base64: undefined,
            extension: undefined,
            id: undefined
        },
        selectedFile: null,
        tiposDocumento: TIPO_DOCUMENTO,
        cargos: undefined,
        cargosAux: [
            {id: '1', nombre: 'Gerente'},
            {id: '2', nombre: 'Secretaria'},
            {id: '3', nombre: 'Bodeguero'}
        ],
        cargo: '',
        loader: false,
        cadena: undefined
      }
    },
    computed: {
        ...mapState(['servidorAcceso','sesionActiva']),
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
    watch: {
        sesionActiva () {
            if (this.sesionActiva !== undefined) {
                this.model = {
                    ...this.sesionActiva
                }
            }
        },
        'model.cargo' () {
            console.log(this.model.cargo)
        }
    },
    methods: {
        async onFileSelected(event) {
            const file = event.target.files[0]
            console.log(file)
            let reader = new FileReader()
            const self = this
            let cadena = ''
            this.fotografia.extension = file.type
            reader.onloadend = (file) => {
                self.actualizarFoto(reader.result)
            }
            reader.readAsDataURL(file)
        },
        async actualizarFoto ( base64) {
            console.log( base64)
            const parametros = {
                extension: this.fotografia.extension,
                id: this.fotografia.id,
                base64: base64
            }
            await axios.put(this.servidorAcceso + 'usuarios/personas/' + this.model.numeroDocumento + '/fotografia', {
                ...parametros
            }).then(response => (
                this.$toast.success({
                    title: 'Actualizacion Exitosa',
                    message: 'Se actualizo la foto con exito'
                })
            ))
        },
        async actualizar () {
            if (!this.validacion()) {
                this.$toast.info({
                    title: 'No se puede actualizar su información',
                    message: 'Existen campos vacios o no validos dentro del formulario'
                })
                return
            }
            await axios.put(this.servidorAcceso + 'usuarios/usuarios', {
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
            if (this.validarNombres && this.validarApellidos && this.validarCargo && this.validarTipoDocumento
            && this.validarNumeroDocumento && this.validarEmail && this.validarTelefono && this.validarFechaNacimiento) {
                return true
            }
            return false
        }
    },
    created: async function() {
        this.loader = true
        // await this.apiCargos()
        if (this.sesionActiva) {
            this.model = {
                ...this.sesionActiva
            }
        }
        const infoCargo = (await axios.get(this.servidorAcceso + 'usuarios/cargos/'+this.model.cargoId)).data.data
        const fotografia = (await axios.get(this.servidorAcceso + 'usuarios/personas/' + this.model.numeroDocumento + '/fotografia')).data.data
        this.fotografia = {
            ...fotografia
        }
        this.cargo = infoCargo.cargo.nombre
        this.loader = false
    }
  }
</script>
<style>
</style>
