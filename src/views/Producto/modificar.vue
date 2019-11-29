<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Registro de Producto</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <h6 class="heading-small text-muted mb-4">Información del Producto</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <base-input alternative=""
                                                        label="Nombre"
                                                        placeholder="Nombre"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.nombre"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input label="Marcas" :valid="validarMarca">
                                                <select class="form-control" v-model="model.marca">
                                                    <option v-for="item in marcas" :key="item.idMarca" :value="item.idMarca" >{{ item.nombre }}</option>
                                                </select>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input 
                                                alternative=""
                                                type="number"
                                                label="Stock Minimo"
                                                placeholder="Stock Minimo Permitido del Producto"
                                                input-classes="form-control-alternative"
                                                v-model="model.stockMinimo"
                                                min= 0
                                                max= 1000
                                                :valid="validarStock"
                                            />
                                        </div>
                                    </div>
                                    <b-table striped hover selectable :fields="camposTablaItemsProducto" :items="itemsProductos" @row-selected="seleccionado" responsive="sm" selected-variant="active" select-mode="single" />
                                    <div class="row float-right" >
                                        <base-button outline @click="registrar()" type="success">Registrar</base-button>
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
const MARCAS = [
    { idMarca: '1', nombre: 'NIKE',  text: 'NIKE', value: '1'},
    { idMarca: '2', nombre: 'ADIDAS',  text: 'ADIDAS', value: '2'},
    { idMarca: '3', nombre: 'TREFILADOS',  text: 'TREFILADOS', value: '3'},
    { idMarca: '4', nombre: 'IMPORTADO',  text: 'IMPORTADO', value: '4'},
    { idMarca: '5', nombre: 'COMPAT',  text: 'COMPAT', value: '5'},
    { idMarca: '6', nombre: 'CENTOS',  text: 'CENTOS', value: '6'}
]
import 'flatpickr/dist/flatpickr.css'
import {mapState} from 'vuex'
import axios from 'axios'
  export default {
    components: {
    },
    name: 'ModificarProducto',
    data() {
      return {
        model: {
            nombre: undefined,
            marca: undefined,
            stockMinimo: 0,
            idProducto: undefined
        },
        verModal: false,
        verModalContacto: false,
        camposTablaCuentaBanco: [
            { key: 'nombreBanco', label: 'Nombre del Banco' },
            { key: 'tipoCuenta', label: 'Tipo de Cuenta' },
            { key: 'numeroCuenta', label: 'Numero de Cuenta' },
            'Quitar'
        ],
        camposTablaItemsProducto: [
            {key: 'nombre', label: 'Nombre'},
            {key: 'descripcion', label: 'descripcion'},
            {key: 'unidadMedida', label: 'Unidad de Medidad'}
        ],
        marcas: MARCAS,
        itemsProductos: [
            { idProducto: 1, nombre: 'Pegante Super 200 ml amarillo', descripcion: 'Pegante Super 200 ml amarillo', unidadMedida: 'ML', stockMinimo: '50' },
            { idProducto: 2, nombre: 'Rollo de tela de Suela color negro calibre 86 X 100 METROS', descripcion: 'Rollo de tela de Suela color negro calibre 86 X 100 METROS', unidadMedida: 'MTR', stockMinimo: '100' }
        ]
      }
    },
    computed: {
        ...mapState(['servidorProducto', 'proveedor']),
        validarNombre () {
            if (this.model.nombre === '' ) {
                return false
            }
            else if (this.model.nombre === undefined) {
                return undefined
            }
            return true
        },
        validarMarca () {
            if (this.model.marca === '' ) {
                return false
            }
            else if (this.model.marca === undefined) {
                return undefined
            }
            return true
        },
        validarStock () {
            try {
                if (this.model.stockMinimo >= 0 && this.model.stockMinimo <= 1000) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        },
        validarProducto () {
            if (this.model.idProducto === undefined ) {
                this.$toast.info({
                    title: 'No se puede registrar el Producto',
                    message: 'Se debe eligir un producto para registrarlo'
                })
                return false
            }
            return true
        }
    },
    methods: {
        seleccionado (item) {
            console.log(item[0])
            this.model.idProducto = item[0].idProducto
            this.model.nombre = item[0].nombre
        },
        async registrar () {
            if (!this.validarProducto) {
                return
            }
            if (!this.validacion()) {
                this.$toast.info({
                    title: 'No se puede registrar el proveedor',
                    message: 'Existen campos vacios o no validos dentro del formulario principal'
                })
                return
            }
            const self = this
            axios.post(this.servidorProducto + 'usuarios/proveedores', {
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
                fechaLimitePago: undefined,
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
        },
        validacion () {
            if (this.validarMarca && this.validarStock) {
                return true
            }
            return false
        }
    },
    watch: {
        'model.nombre' () {
            
        }
    },
    created: function() {
    }
  }
</script>
<style>
</style>
