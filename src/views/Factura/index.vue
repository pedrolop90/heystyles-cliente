<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Registro de Facturas</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <h6 class="heading-small text-muted mb-4">Información de la Factura</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <base-input label="Proveedor" :valid="validarProveedor">
                                                <select class="form-control" v-model="model.idProveedor">
                                                    <option v-for="item in proveedores" :key="item.idProveedor" :value="item.idProveedor" >{{ item.nombre }}</option>
                                                </select>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Fecha Limite de Vencimiento"
                                                        placeholder="Fecha Limite de Vencimiento"
                                                        input-classes="form-control-alternative"
                                                        :valid="validarFechaVencimiento">
                                                <flat-picker slot-scope="{focus, blur}"
                                                            @on-open="focus"
                                                            @on-close="blur"
                                                            :config="{allowInput: true}"
                                                            class="form-control datepicker"
                                                            v-model="model.fechaVencimiento">
                                                </flat-picker>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                label="Esta Pago?"
                                                input-classes="form-control-alternative">
                                                    <b-form-checkbox switch size="lg" class="py-2" />
                                                </base-input>
                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <h6 class="heading-small text-muted mb-4">Lista de Productos</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-9">
                                            <base-input alternative=""
                                                label="Producto"
                                                input-classes="form-control-alternative">
                                                <vue-suggest
                                                    v-model="autocomplete"
                                                    :list="itemsProductos"
                                                    :filter-by-query="true"
                                                    :max-suggestions="10"
                                                    :min-length="3"
                                                    value-attribute="idProducto"
                                                    display-attribute="nombre"
                                                    @suggestion-click="seleccionar"
                                                    @select="seleccionar">
                                                <template slot="misc-item-above" slot-scope="{ suggestions, query }">
                                                    <template v-if="suggestions.length > 0">
                                                        <p><em>Total de Sugerencias: {{ suggestions.length }}</em></p>
                                                    </template>
                                                    <div class="misc-item" v-else-if="!loading">
                                                        <span>Sin resultados</span>
                                                    </div>
                                                </template>
                                                <div slot="suggestion-item" slot-scope="item" :title="item.suggestion.nombre">
                                                    <span>{{item.suggestion.nombre}}</span>
                                                    <base-button size="sm" type="primary" class="float-right px-2" @click.stop="agregar(item.suggestion)">Agregar</base-button>
                                                </div>
                                                </vue-suggest>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4" v-if="mostrarSelectorMarca">
                                            <base-input label="Marcas" :valid="validarMarca">
                                                <select class="form-control" v-model="itemSeleccionadoAutocomplete.idMarca">
                                                    <option v-for="item in marcas" :key="item.idMarca" :value="item" >{{ item.nombre }}</option>
                                                </select>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4"  v-if="mostrarSelectorMarca">
                                            <div class="row float-right" >
                                                <base-button outline @click="agregarProducto()" type="success">AgregarProducto</base-button>
                                            </div>
                                        </div>
                                    </div>
                                    <b-table striped hover selectable :fields="camposTablaItemsProducto" :items="model.productos" @row-selected="seleccionado" responsive="sm" selected-variant="active" select-mode="single">
                                        <template slot="cantidad" slot-scope="data">
                                            <base-input 
                                                alternative=""
                                                type="number"
                                                placeholder="Cantidad"
                                                input-classes="form-control-sm"
                                                v-model="data.item.cantidad"
                                                min= 0
                                                max= 10000000
                                                :valid="validarCantidad(data.item.cantidad)"
                                            />
                                        </template> 
                                        <template slot="valor" slot-scope="data">
                                            <base-input 
                                                alternative=""
                                                type="number"
                                                placeholder="Valor"
                                                input-classes="form-control-sm"
                                                v-model="data.item.valor"
                                                min= 0
                                                max= 10000000
                                                :valid="validarPrecio(data.item.valor)"
                                            />
                                        </template>  
                                    </b-table>
                                    <hr>
                                    <div class="col-lg-4">
                                            <base-input 
                                                alternative=""
                                                type="number"
                                                label="Valor Total"
                                                placeholder="Valor Total de la factura"
                                                input-classes="form-control-alternative"
                                                v-model="model.valorTotal"
                                                min= 0
                                                max= 1000
                                                :valid="validarValorTotal"
                                            />
                                        </div>
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
const PROVEEDORES = [
    { idProveedor: '1', nombre: 'NIKE',  text: 'NIKE', value: '1', fechaLimitePago: 10},
    { idProveedor: '2', nombre: 'ADIDAS',  text: 'ADIDAS', value: '2', fechaLimitePago: 45},
    { idProveedor: '3', nombre: 'TREFILADOS',  text: 'TREFILADOS', value: '3', fechaLimitePago: 30},
    { idProveedor: '4', nombre: 'IMPORTADO',  text: 'IMPORTADO', value: '4', fechaLimitePago: 45},
    { idProveedor: '5', nombre: 'COMPAT',  text: 'COMPAT', value: '5', fechaLimitePago: 10},
    { idProveedor: '6', nombre: 'CENTOS',  text: 'CENTOS', value: '6', fechaLimitePago: 0}
]
import 'flatpickr/dist/flatpickr.css'
import flatPicker from 'vue-flatpickr-component'
import {mapState} from 'vuex'
import axios from 'axios'
import moment from 'moment'
/* https://vuejsexamples.com/simple-yet-feature-rich-autocomplete-component-for-vue-js/ */
import VueSuggest from 'vue-simple-suggest'
import 'vue-simple-suggest/dist/styles.css'
  export default {
    components: {
        flatPicker,
        VueSuggest
    },
    name: 'RegistrarProducto',
    data() {
      return {
        autocomplete: '',
        loading: false,
        model: {
            idProducto: undefined,
            fechaVencimiento: moment().format('YYYY-MM-DD'),
            idProveedor: undefined,
            productos: [],
            valorTotal: 0
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
            {key: 'idMarca', label: 'Marca'},
            {key: 'unidadMedida', label: 'Unidad'},
            {key: 'cantidad', label: 'Cantidad'},
            {key: 'valor', label: 'Valor'},
        ],
        proveedores: PROVEEDORES,
        itemsProductos: [
            { idProducto: 1, nombre: 'Pegante Super 200 ml amarillo', descripcion: 'Pegante Super 200 ml amarillo', unidadMedida: 'ML', stockMinimo: '50', marcas: [{ nombre: 'NIKE', idMarca: '10'},{idMarca: '20', nombre: 'ADIDAS' }] },
            { idProducto: 2, nombre: 'Rollo de tela de Suela color negro calibre 86 X 100 METROS', descripcion: 'Rollo de tela de Suela color negro calibre 86 X 100 METROS', unidadMedida: 'MTR', stockMinimo: '100', marcas: [{idMarca: '2', nombre:'DESCONOCIDA'}, {idMarca: '1', nombre:'CHIMBA'}] },
            { idProducto: 3, nombre: 'Puntilla cuadrada para clavar Bareque', descripcion: 'Puntilla cuadrada para clavar Bareque de 4 punlgadas', unidadMedida: 'GR', stockMinimo: '100', marcas: [{idMarca: '20', nombre:'GENERICA'}] }
        ],
        marcas: [],
        itemSeleccionadoAutocomplete: {},
        mostrarSelectorMarca: false
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
        validarMarca () {
            if (this.model.marca === '' ) {
                return false
            }
            else if (this.model.marca === undefined) {
                return undefined
            }
            return true
        },
        validarValorTotal () {
            try {
                if (this.model.valorTotal >= 0 && this.model.valorTotal <= 10000000) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        },
        validarPrecios (valor) {
            try {
                if (valor >= 0 && valor <= 10000000) {
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
        },
        validarProveedor () {
            if (this.model.idProveedor === undefined ) {
                return undefined
            } else if (this.model.idProveedor === '' ) {
                return false
            }
            return true
        },
        validarFechaVencimiento () {
            if (this.model.fechaVencimiento === '' ) {
                return false
            }
            else if (this.model.fechaVencimiento === undefined) {
                return undefined
            } else if (moment().isAfter(this.model.fechaVencimiento)) {
                if (moment().format('YYYY-MM-DD') === this.model.fechaVencimiento) {
                    return true
                }
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
        },
        agregar (item) {
            this.marcas = item.marcas
            this.itemSeleccionadoAutocomplete = item
            if (this.itemSeleccionadoAutocomplete.marcas.length > 1) {
                this.mostrarSelectorMarca = true
            } else {
                this.itemSeleccionadoAutocomplete.idMarca = item.marcas[0]
                this.agregarProducto ()
            }
        },
        seleccionar (suggest, e) {
            this.marcas = suggest.marcas
            this.itemSeleccionadoAutocomplete = suggest
            if (this.itemSeleccionadoAutocomplete.marcas.length > 1) {
                this.mostrarSelectorMarca = true
            } else {
                this.itemSeleccionadoAutocomplete.idMarca = suggest.marcas[0]
                this.agregarProducto ()
            }
        },
        agregarProducto () {
            this.model.productos.push(this.itemSeleccionadoAutocomplete)
            this.itemSeleccionadoAutocomplete = {}
            this.mostrarSelectorMarca = false
            this.autocomplete = ''
        },
        validarPrecio (valor) {
            try {
                if (valor === '') {
                    return false
                }
                if (valor >= 0 && valor <= 10000000) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        },
        validarCantidad (valor) {
            try {
                if (valor === '') {
                    return false
                }
                if (valor >= 0 && valor <= 10000) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        }
    },
    watch: {
        'model.idProveedor' () {
            const self = this
            const proveedorFiltrado = this.proveedores.find(function (proveedor) {
                return proveedor.idProveedor === self.model.idProveedor
            })
            const hoy = moment().add('days', proveedorFiltrado.fechaLimitePago)
            this.model.fechaVencimiento = hoy.format('YYYY-MM-DD')
        }
    },
    created: function() {
    }
  }
</script>
<style>
</style>
