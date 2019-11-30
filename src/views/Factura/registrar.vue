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
                                                <select class="form-control" v-model="model.proveedorId">
                                                    <option v-for="item in proveedores" :key="item.id" :value="item.id" >{{ item.nombre }}</option>
                                                </select>
                                            </base-input>
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Fecha Limite de Vencimiento"
                                                        placeholder="Fecha Limite de Vencimiento"
                                                        input-classes="form-control-alternative"
                                                        :valid="validarfechaLimitePago">
                                                <flat-picker slot-scope="{focus, blur}"
                                                            @on-open="focus"
                                                            @on-close="blur"
                                                            :config="{allowInput: true}"
                                                            class="form-control datepicker"
                                                            v-model="model.fechaLimitePago">
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
                                                    value-attribute="id"
                                                    display-attribute="producto.nombre"
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
                                                    <span>{{ item.suggestion.producto.nombre }}(<em> {{item.suggestion.marca.nombre}} </em>)</span>
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
                                        <template slot="quitar" slot-scope="data">
                                            <b-button
                                                variant="outline-warning"
                                                size="sm"
                                                v-b-popover.hover.top="'Quitar el Producto'"
                                                @click="quitarProducto(data.item.id)"
                                            >
                                                X
                                            </b-button>
                                        </template> 
                                        <template slot="cantidad" slot-scope="data">
                                            <b-form-input 
                                                alternative=""
                                                type="number"
                                                input-classes="form-control-sm"
                                                v-model="data.item.cantidad"
                                                min= 0
                                                max= 100000
                                                size="sm"
                                                style="min-width: 70px !important"
                                                :state="validarCantidad(data.item.cantidad)"
                                                @blur="calcularTotalFactura"
                                            />
                                        </template> 
                                        <template slot="valor" slot-scope="data">
                                            <b-form-input
                                                alternative=""
                                                type="number"
                                                input-classes="form-control-sm"
                                                v-model="data.item.valor"
                                                min= 0
                                                max= 10000000
                                                style="min-width: 100px !important"
                                                size="sm"
                                                :state="validarPrecio(data.item.valor)"
                                                @blur="calcularTotalFactura"
                                            />
                                        </template>
                                        <template slot="porcentajeDescuento" slot-scope="data">
                                            <b-form-input
                                                :state="validarDescuento(data.item.porcentajeDescuento)"
                                                type="number"
                                                style="min-width: 50px !important"
                                                min= 0
                                                max= 100
                                                v-model="data.item.porcentajeDescuento"
                                                size="sm"
                                                @blur="calcularTotalFactura"
                                            />
                                        </template>
                                        <template slot="nombre" slot-scope="data">
                                            {{data.item.nombre}} (<em>{{ data.item.marca.nombre }}</em>)
                                        </template>
                                        <template slot="unidadMedida" slot-scope="data">
                                            {{ data.item.unidadMedida.nombre }}
                                        </template>
                                        <template slot="Total" slot-scope="data">
                                            <b-form-input
                                                disabled
                                                type="number"
                                                input-classes="form-control-alternative"
                                                size="sm"
                                                style="min-width: 120px !important"
                                                :value="(data.item.valor*data.item.cantidad)
                                                -(data.item.valor*data.item.cantidad)
                                                *data.item.porcentajeDescuento/100"
                                            />
                                        </template>
                                    </b-table>
                                    <hr>
                                    <div class="row">
                                        <div class="col-lg-2">
                                            <label for="input-small">Iva:</label>
                                        </div>
                                        <div class="col-lg-2">
                                            <b-form-input
                                                disabled
                                                alternative=""
                                                type="number"
                                                label="Valor Total"
                                                input-classes="form-control-alternative"
                                                v-model="model.porcentaje"
                                                min= 0
                                                max= 1000
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-2">
                                            <label for="input-small">Sub-Total:</label>
                                        </div>
                                        <div class="col-lg-2">
                                            <b-form-input
                                                disabled
                                                alternative=""
                                                type="number"
                                                label="Valor Total"
                                                input-classes="form-control-alternative"
                                                v-model="model.subTotal"
                                                min= 0
                                                max= 1000
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-2">
                                            <label for="input-small">Total:</label>
                                        </div>
                                        <div class="col-lg-2">
                                            <b-form-input
                                                disabled
                                                alternative=""
                                                type="number"
                                                label="Valor Total"
                                                input-classes="form-control-alternative"
                                                v-model="model.valorTotal"
                                                min= 0
                                                max= 1000
                                                size="sm"
                                            />
                                        </div>
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
    { id: '1', nombre: 'NIKE',  text: 'NIKE', value: '1', fechaLimitePago: 10},
    { id: '2', nombre: 'ADIDAS',  text: 'ADIDAS', value: '2', fechaLimitePago: 45},
    { id: '3', nombre: 'TREFILADOS',  text: 'TREFILADOS', value: '3', fechaLimitePago: 30},
    { id: '4', nombre: 'IMPORTADO',  text: 'IMPORTADO', value: '4', fechaLimitePago: 45},
    { id: '5', nombre: 'COMPAT',  text: 'COMPAT', value: '5', fechaLimitePago: 10},
    { id: '6', nombre: 'CENTOS',  text: 'CENTOS', value: '6', fechaLimitePago: 0}
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
            fechaLimitePago: moment().format('YYYY-MM-DD'),
            proveedorId: undefined,
            productos: [],
            valorTotal: 0,
            porcentajeDescuento: 0,
            porcentaje: 0,
            subTotal: 0
        },
        iva: 19,
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
            {key: 'unidadMedida', label: 'Unidad'},
            {key: 'estadoEntrada', label: 'Estado'},
            {key: 'cantidad', label: 'Cant.'},
            {key: 'porcentajeDescuento', label: 'Desc.'},
            {key: 'valor', label: 'Precio'},
            "Total",
            {key: 'quitar', label: ''},
        ],
        proveedores: PROVEEDORES,
        itemsProductos: [],
        marcas: [],
        itemSeleccionadoAutocomplete: {},
        mostrarSelectorMarca: false,
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
        validarProductos () {
            if (this.model.productos.length === 0) {
                this.$toast.info({
                    title: 'Datos Incompletos',
                    message: 'Debe agregar almenos un producto'
                })
                return false 
            }
            const self = this
            let valoresValidos = true
            this.model.productos.forEach(function(producto, index){
                console.log(index)
                if (!self.validarPrecios(producto.valor)) {
                    self.$toast.info({
                        title: 'Datos Incompletos',
                        message: 'Existen precios invalidos en los productos'
                    })
                    valoresValidos = false
                } else if (!self.validarCantidad(producto.cantidad)) {
                    self.$toast.info({
                        title: 'Datos Incompletos',
                        message: 'Existen cantidades invalidas en los productos'
                    })
                    valoresValidos = false
                } else if (!self.validarDescuento(producto.porcentajeDescuento)) {
                    self.$toast.info({
                        title: 'Datos Incompletos',
                        message: 'Existen Descuentos invalidos en los productos'
                    })
                    valoresValidos = false
                }
            })
            return valoresValidos
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
        seleccionado (item) {
            this.model.idProducto = item[0].idProducto
            this.model.nombre = item[0].nombre
        },
        async registrar () {
            if (!this.validacion()) {
                this.$toast.info({
                    title: 'No se puede registrar la factura',
                    message: 'Existen campos vacios o no validos dentro del formulario principal'
                })
                return
            }
            console.log(this.validarProductos())
            if (!this.validarProductos()) {
                return
            }
            const self = this
            let fechaPago = this.model.fechaLimitePago

            this.model.fechaLimitePago = moment(fechaPago, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss')
            axios.post(this.servidorFactura + 'factura/factura', {
                factura: this.model,
                gestionProductos: this.model.productos
            })
            .then(response => {
                this.$toast.success({
                    title: 'Registro Exitoso',
                    message: 'Se registro la Factura correctamente'
                })
                self.$router.push('/factura/')
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
        quitarProducto (idQuitar) {
            const aux = []
            this.model.productos.forEach(function (producto) {
                if (producto.id !== idQuitar) {
                    aux.push(producto)
                }
            })
            this.model.productos = aux
        },
        validacion () {
            console.log(this.validarProveedor)
            console.log(this.validarfechaLimitePago)
            if (this.validarProveedor && this.validarfechaLimitePago) {
                return true
            }
            return false
        },
        agregar (suggest) {
            this.itemSeleccionadoAutocomplete = {
                nombre: suggest.producto.nombre,
                marcaProductoId: suggest.marca.id,
                marca: suggest.marca,
                estadoEntrada: "MAL_ESTADO",
                unidadMedida: suggest.producto.unidadMedida,
                cantidad: undefined,
                porcentajeDescuento: 0,
                valor: 0,
                total: 0
            }
            this.agregarProducto ()
        },
        seleccionar (suggest, e) {
            this.itemSeleccionadoAutocomplete = {
                nombre: suggest.producto.nombre,
                marcaProductoId: suggest.marca.id,
                marca: suggest.marca,
                estadoEntrada: "MAL_ESTADO",
                unidadMedida: suggest.producto.unidadMedida,
                cantidad: 0,
                porcentajeDescuento: 0,
                valor: 0,
                total: 0
            }
            this.agregarProducto ()
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
        validarDescuento (valor) {
            try {
                if (valor === '') {
                    return false
                }
                if (valor >= 0 && valor <= 100) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        },
        validarCantidad (valor) {
            try {
                if (valor === '' || valor === undefined ) {
                    return false
                }
                if (valor > 0 && valor <= 10000) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        },
        async apiProductos () {
            this.itemsProductos = (await axios.get(this.servidorProducto + 'producto/marca-producto')).data.data
        },
        async listarProdedores () {
            this.proveedores = []
            this.proveedores = (await axios.get(this.servidorAcceso + 'usuarios/proveedores')).data.data
        },
        calcularTotalFactura () {
            if (this.model.productos.length === 0) {
                this.model.valor = 0
                this.model.subTotal = 0
                return
            }
            const self = this
            this.model.valor = 0
            this.model.valorTotal = 0
            this.model.productos.forEach(function (producto) {
                const valor = (producto.valor * producto.cantidad)
                    - (producto.valor * producto.cantidad) * producto.porcentajeDescuento / 100
                self.model.valorTotal += valor
            })
        }
    },
    watch: {
        'model.proveedorId' () {
            const self = this
            const proveedorFiltrado = this.proveedores.find(function (proveedor) {
                return proveedor.id === self.model.proveedorId
            })
            const hoy = moment().add('days', proveedorFiltrado.fechaLimitePago)
            this.model.fechaLimitePago = hoy.format('YYYY-MM-DD')
        },
        'model.productos' () {
            this.model.valor = 0
            this.model.valorTotal = 0
            this.calcularTotalFactura()
        },
        'model.valorTotal' () {
            this.model.subTotal = this.model.valorTotal/1.19
            this.model.porcentaje = this.model.subTotal*0.19
        }
    },
    created: function() {
        this.apiProductos()
        this.listarProdedores()
    }
  }
</script>
<style>
</style>
