<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Registro de Proveedor</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <h6 class="heading-small text-muted mb-4">Información del Proveedor</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Nombre"
                                                        placeholder="Nombre"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.nombre"
                                                        :required="true"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Descripción"
                                                        placeholder="Descripción"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.descripcion"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Telefono"
                                                        placeholder="Telefono"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.telefono"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Dirección"
                                                        placeholder="Dirección"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.direccion"
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
                                            <base-input 
                                                alternative=""
                                                type="number"
                                                label="Fecha Limite"
                                                placeholder="Días limite de Pago"
                                                input-classes="form-control-alternative"
                                                v-model="model.fechaLimitePago"
                                                min= 0
                                                max= 365
                                            />
                                        </div>
                                    </div>
                                    <div class="row float-right" >
                                        <registro-cuenta-banco :verModal="verModal" @esActivo="esActivo" @agregarCuenta="agregarCuenta"/>
                                        <base-button outline type="secondary" @click="verModal = true" >
                                            <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                            Cuenta de Banco
                                        </base-button>
                                        <registro-contacto-proveedor :verModalContacto="verModalContacto" @esActivoModalContacto="esActivoModalContacto" @agregarContacto="agregarContacto"/>
                                        <base-button outline type="secondary" @click="verModalContacto = true" >
                                            <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                            Contacto
                                        </base-button>
                                        <base-button outline @click="registrar()" type="success">Registrar</base-button>
                                    </div>
                                </div>
                                <br>
                                <hr>
                                <div>
                                    <div v-if="model.cuentaBanco.length > 0">
                                        <h2>Cuenta Bancarias</h2>
                                        <b-table hover small striped :fields="camposTablaCuentaBanco" :items="model.cuentaBanco">
                                            <template slot="Quitar" slot-scope="data">
                                                <base-button type="warning" @click="quitarCuenta(data.item)">
                                                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                                                    Quitar Cuenta
                                                </base-button>
                                            </template>
                                        </b-table>
                                    </div>
                                    <hr>
                                    <div v-if="model.contacto.length > 0">
                                        <h2>Contacto del Proveedor</h2>
                                        <b-table hover small striped :fields="camposTablaContacto" :items="model.contacto">
                                            <template slot="nombreCompleto" slot-scope="data">
                                                {{ data.item.nombres }} {{data.item.apellidos}}
                                            </template>
                                            <template slot="Quitar" slot-scope="data">
                                                <base-button type="warning" @click="quitarContacto(data.item)">
                                                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                                                    Quitar Contacto
                                                </base-button>
                                            </template>
                                        </b-table>
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
import 'flatpickr/dist/flatpickr.css'
import RegistroCuentaBanco from './Components/RegistroCuentaBanco'
import RegistroContactoProveedor from './Components/RegistroContactoProveedor'
import {mapState} from 'vuex'
import axios from 'axios'
  export default {
    components: {
      RegistroCuentaBanco,
      RegistroContactoProveedor
    },
    name: 'Registrar',
    data() {
      return {
        model: {
            nombre: '',
            descripcion: '',
            telefono: '',
            direccion: '',
            email: '',
            fechaLimitePago: 0,
            id: null,
            cuentaBanco: [],
            contacto: []
        },
        verModal: false,
        verModalContacto: false,
        camposTablaCuentaBanco: [
            { key: 'nombreBanco', label: 'Nombre del Banco' },
            { key: 'tipoCuenta', label: 'Tipo de Cuenta' },
            { key: 'numeroCuenta', label: 'Numero de Cuenta' },
            'Quitar'
        ],
        camposTablaContacto: [
            { key: 'nombreCompleto', label: 'Nombre Completo' },
            { key: 'documento', label: 'Documento' },
            { key: 'email', label: 'Email' },
            { key: 'telefono', label: 'Telefono' },
            'Quitar'
        ]
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'proveedor'])
    },
    methods: {
        async registrar () {
            const self = this
            axios.post(this.servidorAcceso + 'usuarios/proveedores', {
                proveedor: this.model,
                contactos: this.model.contacto,
                cuentasBanco: this.model.cuentaBanco
            })
            .then(response => {
                this.$toast.success({
                    title: 'Registro Exitoso',
                    message: 'Se registro el proveedor correctamente'
                })
                self.limpiarCampos()
                this.$router.push('/proveedor/')
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
            const proveedor = {
                ...this.model
            }
            this.proveedor.push(proveedor)
            this.$router.push('/proveedor/')
            this.$toast.success({
                title: 'Exito',
                message: 'Se ha registrado el proveedor correctamente'
            })
        },
        esActivo (value) {
            this.verModal = value
        },
        esActivoModalContacto (value) {
            console.log('hola' + value)
            this.verModalContacto = value
        },
        agregarCuenta (informacion) {
            const cuentaBa = {
                ...informacion
            }
            this.model.cuentaBanco.push(cuentaBa)
        },
        agregarContacto (informacion) {
            const contacto = {
                ...informacion
            }
            this.model.contacto.push(contacto)
        },
        limpiarCampos () {
            this.model = {
                nombre: '',
                descripcion: '',
                telefono: '',
                direccion: '',
                email: '',
                fechaLimitePago: 0,
                id: undefined
            }
        },
        quitarCuenta( item ) {
            this.model.cuentaBanco = this.model.cuentaBanco.filter( function( e ) {
                return e !== item
            } )
        },
        quitarContacto( item ) {
            this.model.contacto = this.model.contacto.filter( function( e ) {
                return e !== item
            } )
        }
    },
    watch: {
        'model.fechaLimitePago': function () {
            if (this.model.fechaLimitePago < 0) {
                this.model.fechaLimitePago = 0
            } else if (this.model.fechaLimitePago > 365) {
                this.model.fechaLimitePago = 365
            } 
        }
    },
    created: function() {
    }
  }
</script>
<style>
</style>
