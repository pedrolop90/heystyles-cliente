<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Gestionar Posición</h3>
                                </div>
                            </div>
                        </div>
                        <div class="text-center" v-if="loader">
                            <vue-loaders name="ball-beat" color="blue" scale="2" class="text-center"></vue-loaders>
                        </div>
                        <template v-if="!loader">
                            <form @submit.prevent>
                                <h6 class="heading-small text-muted mb-4">Productos en la Posición</h6>
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
                                                    :min-length="1"
                                                    value-attribute="id"
                                                    display-attribute="producto.nombre"
                                                    @select="seleccionar"
                                                    @focus="limpiar">
                                                <template slot="misc-item-above" slot-scope="{ suggestions, query }">
                                                    <template v-if="suggestions.length > 0">
                                                        <p><em>Total de Sugerencias: {{ suggestions.length }}</em></p>
                                                    </template>
                                                    <div class="misc-item" v-else-if="!loading">
                                                        <span>Sin resultados</span>
                                                    </div>
                                                </template>
                                                <div slot="suggestion-item" slot-scope="item" :title="item.suggestion.nombre">
                                                    <span>{{ item.suggestion.producto.nombre }}(<em> {{item.suggestion.marca.nombre}} </em>)</span>
                                                    <base-button size="sm" type="primary" class="float-right px-2" @click.stop="agregar(item.suggestion)">Agregar</base-button>
                                                </div>
                                                </vue-suggest>
                                            </base-input>
                                        </div>
                                    </div>
                                    <b-table
                                        striped
                                        hover
                                        :fields="camposTablaItemsProducto"
                                        :items="productos"
                                        selected-variant="active"
                                        responsive>
                                        <template slot="quitar" slot-scope="data">
                                            <b-button
                                                variant="outline-warning"
                                                size="sm"
                                                v-b-popover.hover.top="'Quitar el Producto'"
                                                @click="quitarProducto(data.item.cod)"
                                            >
                                                X
                                            </b-button>
                                        </template>
                                        <template slot="nombre" slot-scope="data">
                                            {{data.item.nombre}} (<em>{{ data.item.marca }}</em>)
                                        </template>
                                        <template slot="unidadMedida" slot-scope="data">
                                            {{ data.item.unidadMedida.nombre }}
                                        </template>
                                    </b-table>
                                    <hr>
                                    <div class="row float-right" >
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
const ESTADOS = [
    { id:'BUEN_ESTADO', text: 'BUENO' },
    { id:'MAL_ESTADO', text: 'MALO' },
    { id:'ESTRAVIADO', text: 'EXTRAVIADO' }
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
    name: 'GestionarPosicion',
    props: {
        posicion: {
            required: true,
            type: Object
        }
    },
    data() {
      return {
        autocomplete: '',
        loading: false,
        model: {
            marcaProductosIds: [],
            lugarId: undefined
        },
        camposTablaItemsProducto: [
            {key: 'nombre', label: 'Nombre'},
            {key: 'unidadMedida', label: 'UND'},
            {key: 'quitar', label: ''},
        ],
        itemsProductos: [],
        productos: [],
        marcas: [],
        itemSeleccionadoAutocomplete: {},
        mostrarSelectorMarca: false,
        estados: ESTADOS,
        limpiarAutocomplete: false,
        loader: false
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'servidorProducto', 'proveedor', 'servidorFactura']),
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
            if (this.model.proveedorId === undefined ) {
                return undefined
            } else if (this.model.proveedorId === '' ) {
                return false
            }
            return true
        },
        validarfechaLimitePago () {
            if (this.model.fechaLimitePago === '' ) {
                return false
            }
            else if (this.model.fechaLimitePago === undefined) {
                return undefined
            } else if (moment().isAfter(this.model.fechaLimitePago)) {
                if (moment().format('YYYY-MM-DD') === this.model.fechaLimitePago) {
                    return true
                }
                return false
            }
            return true
        }
    },
    methods: {
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
        async guardarCambios () {
            const self = this
            this.model.marcaProductosIds = []
            this.productos.forEach (function (producto) {
                self.model.marcaProductosIds.push(producto.marcaProductoId)
            })
            axios.put(this.servidorProducto + 'producto/marca-prodcuto-lugar/lugar', {
                ...this.model
            })
            .then(response => {
                this.$toast.success({
                    title: 'Actualizacion Exitosa',
                    message: 'Se actualizo la Posición correctamente'
                })
                self.$router.push('/almacen/')
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
        },
        quitarProducto (codQuitar) {
            const aux = []
            this.productos.forEach(function (producto) {
                if (producto.cod !== codQuitar) {
                    aux.push(producto)
                }
            })
            this.productos = aux
        },
        validacion () {
            if (this.validarProveedor && this.validarfechaLimitePago) {
                return true
            }
            return false
        },
        agregar (suggest) {
            const coincidencia = this.productos.find(function (producto) {
                return producto.cod === suggest.id
            })
            if (coincidencia !== undefined) {
                this.$toast.info({
                    title: 'No se puede agregar',
                    message: 'Este producto ya esta agregado a la tabla'
                })
                return
            }
            this.limpiarAutocomplete = true
            this.itemSeleccionadoAutocomplete = {
                cod: suggest.id,
                marcaProductoId: suggest.id,
                nombre: suggest.producto.nombre,
                marcaProductoId: suggest.marcaProductoId,
                marca: suggest.marca,
                estadoEntrada: 'BUEN_ESTADO',
                unidadMedida: suggest.producto.unidadMedida,
                cantidad: 0,
                porcentajeDescuento: 0,
                valor: 0,
                total: 0
            }
            this.agregarProducto ()
        },
        seleccionar (suggest, e) {
            const coincidencia = this.productos.find(function (producto) {
                return producto.cod === suggest.id
            })
            if (coincidencia !== undefined) {
                this.$toast.info({
                    title: 'No se puede agregar',
                    message: 'Este producto ya esta agregado a la tabla'
                })
                return
            }
            this.limpiarAutocomplete = true
            this.itemSeleccionadoAutocomplete = {
                cod: suggest.id,
                marcaProductoId: suggest.id,
                nombre: suggest.producto.nombre,
                marca: suggest.marca.nombre,
                estadoEntrada: 'BUEN_ESTADO',
                unidadMedida: suggest.producto.unidadMedida,
                cantidad: 0,
                porcentajeDescuento: 0,
                valor: 0,
                total: 0
            }
            this.agregarProducto ()
        },
        agregarProducto () {
            this.productos.push(this.itemSeleccionadoAutocomplete)
            this.itemSeleccionadoAutocomplete = {}
            this.autocomplete = ''
        },
        async apiProductos () {
            this.itemsProductos = (await axios.get(this.servidorProducto + 'producto/marca-producto', {
                params: {
                    estado: 'ACTIVO'
                }
            })).data.data
        },
        limpiar () {
            if (this.limpiarAutocomplete) {
                this.autocomplete =''
            }
        },
        prepararLugar: async function () {
            this.model.lugarId = this.posicion.id
            const lista = (await axios.get(this.servidorProducto + 'producto/marca-prodcuto-lugar/' + this.posicion.id + '/marca-producto')).data.data
            const self = this
            lista.forEach(function (item) {
                const productoFiltrado = self.itemsProductos.find(function (producto, index) {
                    return producto.id === item.id
                })
                self.itemSeleccionadoAutocomplete = {
                    cod: item.id,
                    id: item.producto.id,
                    nombre: productoFiltrado.producto.nombre,
                    marcaProductoId: productoFiltrado.id,
                    marca: productoFiltrado.marca.nombre,
                    unidadMedida: productoFiltrado.producto.unidadMedida
                }
                self.agregarProducto ()
            })
        }
    },
    watch: {},
    created: async function() {
        this.loader = true
        await this.apiProductos()
        await this.prepararLugar()
        this.loader = false
    }
  }
</script>
<style>
</style>
