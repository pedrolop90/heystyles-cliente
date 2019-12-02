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
                                                        :valid="validarNombre"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Descripción"
                                                        placeholder="Descripción"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.descripcion"
                                                        :valid="validarDescripcion"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Telefono"
                                                        placeholder="Telefono"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.telefono"
                                                        :valid="validarTelefono"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Dirección"
                                                        placeholder="Dirección"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.direccion"
                                                        :valid="validarDireccion"
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
                                            <base-input 
                                                alternative=""
                                                type="number"
                                                label="Días limite de Pago"
                                                placeholder="Días limite de Pago"
                                                input-classes="form-control-alternative"
                                                v-model="model.fechaLimitePago"
                                                min= 0
                                                max= 365
                                                :valid="validarFechaLimite"
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
                                        <base-button outline @click="eliminar()" type="danger">Deshabilitar</base-button>
                                        <base-button outline @click="guardarCambios()" type="success">Guardar Cambios</base-button>
                                    </div>
                                </div>
                                <br>
                                <hr>
                                <div>
                                    <div v-if="model.cuentasBanco.length > 0">
                                        <h2>Cuenta Bancarias</h2>
                                        <b-table hover small striped :fields="camposTablaCuentaBanco" :items="model.cuentasBanco">
                                            <template slot="Quitar" slot-scope="data">
                                                <base-button
                                                    outline
                                                    type="warning"
                                                    @click="quitarCuenta(data.item)"
                                                    v-b-popover.hover.top="'Eliminar esta Cuenta Bancaria'">
                                                    <i class="fa fa-window-close fa-lg" aria-hidden="true"></i>
                                                </base-button>
                                            </template>
                                        </b-table>
                                    </div>
                                    <hr>
                                    <div v-if="model.contactos.length > 0">
                                        <h2>Contacto del Proveedor</h2>
                                        <b-table hover small striped :fields="camposTablaContacto" :items="model.contactos">
                                            <template slot="nombreCompleto" slot-scope="data">
                                                {{ data.item.nombres }} {{data.item.apellidos}}
                                            </template>
                                            <template slot="Quitar" slot-scope="data">
                                                <base-button
                                                    outline
                                                    type="warning"
                                                    @click="quitarContacto(data.item)"
                                                    v-b-popover.hover.top="'Eliminar este Contacto de Proveedor'">
                                                    <i class="fa fa-window-close fa-lg" aria-hidden="true"></i>
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
    name: 'Modificar',
    props: {
        proveedorOriginal: {
            type: Object,
            required: true
        }
    },
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
            estado: 'ACTIVO',
            cuentasBanco: [],
            contactos: []
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
            { key: 'numeroDocumento', label: 'Documento' },
            { key: 'email', label: 'Email' },
            { key: 'telefono', label: 'Telefono' },
            'Quitar'
        ]
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'proveedor']),
        validarNombre () {
            if (this.model.nombre === '' ) {
                return false
            }
            else if (this.model.nombre === undefined) {
                return undefined
            }
            return true
        },
        validarDescripcion () {
            if (this.model.descripcion === '' ) {
                return false
            }
            else if (this.model.descripcion === undefined) {
                return undefined
            }
            return true
        },
        validarTelefono () {
            if (this.model.telefono === '' ) {
                return false
            }
            else if (this.model.telefono === undefined) {
                return undefined
            }
            return true
        },
        validarDireccion () {
            if (this.model.direccion === '' ) {
                return false
            }
            else if (this.model.direccion === undefined) {
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
        validarFechaLimite () {
            try {
                if (this.model.fechaLimitePago > 0 && this.model.fechaLimitePago <= 365) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        },
    },
    methods: {
        async registrar () {
            if (!this.validacion()) {
                this.$toast.info({
                    title: 'No se puede actualizar el proveedor',
                    message: 'Existen campos vacios o no validos dentro del formulario principal'
                })
                return
            }
            const self = this
            axios.post(this.servidorAcceso + 'proveedor/proveedores', {
                proveedor: this.model,
                contactos: this.model.contactos,
                cuentasBanco: this.model.cuentasBanco
            })
            .then(response => {
                this.$toast.success({
                    title: 'Registro Exitoso',
                    message: 'Se registro el proveedor correctamente'
                })
                self.limpiarCampos()
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
        },
        registrarAux() {
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
            this.verModalContacto = value
        },
        agregarCuenta (informacion) {
            const cuentaBa = {
                ...informacion
            }
            this.model.cuentasBanco.push(cuentaBa)
        },
        agregarContacto (informacion) {
            const contacto = {
                ...informacion
            }
            this.model.contactos.push(contacto)
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
            this.model.cuentasBanco = this.model.cuentasBanco.filter( function( e ) {
                return e !== item
            } )
        },
        quitarContacto( item ) {
            this.model.contactos = this.model.contactos.filter( function( e ) {
                return e !== item
            } )
        },
        async guardarCambiosAux () {
            const proveedor = {
                ...this.model
            }
            this.$store.commit('modificarProveedor', proveedor)
            this.$router.push('/proveedor/')
        },
        async guardarCambios () {
            const self = this
            axios.put(this.servidorAcceso + 'usuarios/proveedores', {
                proveedor: this.model,
                contactos: this.model.contactos,
                cuentasBanco: this.model.cuentasBanco
            })
            .then(response => {
                this.$toast.success({
                    title: 'Actualizacion Exitosa',
                    message: 'Se actualizo el proveedor correctamente'
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
        eliminar () {
            axios.delete(this.servidorAcceso + 'usuarios/proveedores/' + this.model.id)
            .then(response => {
                this.$toast.success({
                    title: 'Eliminación Exitosa',
                    message: 'Se elimino el proveedor correctamente'
                })
                this.$router.push('/proveedor/')
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
    watch: {
        'model.fechaLimitePago': function () {
            if (this.model.fechaLimitePago < 0) {
                this.model.fechaLimitePago = 0
            } else if (this.model.fechaLimitePago > 365) {
                this.model.fechaLimitePago = 365
            } 
        }
    },
    async created () {
        const info = (await axios.get(this.servidorAcceso + 'usuarios/proveedores/' + this.proveedorOriginal.id)).data.data
        this.model = {
            ...info.proveedor,
            contactos: info.contactos,
            cuentasBanco: info.cuentasBanco
        }
    }
  }
</script>
<style>
</style>
