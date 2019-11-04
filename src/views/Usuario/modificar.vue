<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Modificar Usuario</h3>
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
                                        <base-button outline @click="eliminar()" type="danger">Dar de baja</base-button>
                                        <base-button outline @click="guardarCambios()" type="success">Guardar Cambios</base-button>
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
    name: 'modificar',
    props: {
        usuario: {
            type: Object,
            required: true
        }
    },
    data() {
      return {
        model: {
          nombres: '',
          apellidos: '',
          numeroDocumento: '',
          email: '',
          fechaNacimiento: moment().format('YYYY-MM-DD'),
          tipoDocumento: '',
          cargoId: undefined,
          id: null,
          idPersona: null,
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
        ...mapState(['servidorAcceso', 'usuarios'])
    },
    methods: {
        async guardarCambios () {
            axios.put(this.servidorAcceso + 'usuarios/usuarios', {
                ...this.model
            })
            .then(response => {
                this.$toast.success({
                    title: 'Registro Exitoso',
                    message: 'Se registro el usuario correctamente'
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
        async guardarCambiosAux () {
            const usuario = {
                ...this.model,
                contrasena: this.model.numeroDocumento
            }
            this.$store.commit('modificarUsuario', usuario)
            this.$router.push('/usuario/')
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
        eliminar () {
            axios.delete(this.servidorAcceso + 'usuarios/usuarios/' + this.model.id)
            .then(response => {
                this.$toast.success({
                    title: 'Eliminación Exitosa',
                    message: 'Se elimino el usuario correctamente'
                })
                this.$router.push('/usuario/')
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
            /*
            const email = this.model.email
            this.$store.commit('quitarUsuario', email)
            this.$router.push('/usuario/')
            this.$toast.success({
                title: 'Exito',
                message: 'Se ha dado de baja correctamente'
            })*/
        }
    },
    created: function() {
        this.apiCargos()
        this.model = {
            ...this.usuario
        }
    }
  }
</script>
<style>
</style>
