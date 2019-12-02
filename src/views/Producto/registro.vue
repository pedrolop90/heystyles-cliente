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
                                        <div class="col-lg-4">
                                            <base-input label="Marcas" :valid="validarMarcaSeleccionada" >
                                                <select class="form-control" v-model="marcaSeleccionada">
                                                    <option v-for="item in marcas" :key="item.id" :value="item.id" >{{ item.nombre }}</option>
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
                                                v-model="model.producto.stockMinimo"
                                                min= 0
                                                max= 1000
                                                :valid="validarStock"
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
const MARCAS = [
    { idMarca: '1', nombre: 'NIKE',  text: 'NIKE', value: '1'},
    { idMarca: '2', nombre: 'ADIDAS',  text: 'ADIDAS', value: '2'},
    { idMarca: '3', nombre: 'TREFILADOS',  text: 'TREFILADOS', value: '3'},
    { idMarca: '4', nombre: 'IMPORTADO',  text: 'IMPORTADO', value: '4'},
    { idMarca: '5', nombre: 'COMPAT',  text: 'COMPAT', value: '5'},
    { idMarca: '6', nombre: 'CENTOS',  text: 'CENTOS', value: '6'}
]
import 'flatpickr/dist/flatpickr.css'
import flatPicker from 'vue-flatpickr-component'
import {mapState} from 'vuex'
import axios from 'axios'
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
        itemSeleccionadoAutocomplete: undefined,
        model: {
            marcas: [],
            producto: {
                id: null,
                nombre: undefined,
                stockMinimo: undefined,
                unidadMedida: undefined
            }
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
        ],
        marcaSeleccionada: undefined,
        stockMinimo: undefined
      }
    },
    computed: {
        ...mapState(['servidorProducto', 'proveedor']),
        validarMarcaSeleccionada () {
            if (this.marcaSeleccionada === '' ) {
                return false
            }
            else if (this.marcaSeleccionada === undefined) {
                return undefined
            }
            return true
        },
        validarStock () {
            try {
                if (this.model.producto.stockMinimo >= 0 && this.model.producto.stockMinimo <= 1000) {
                    return true
                } else if (this.model.producto.stockMinimo === undefined) {
                    return undefined
                }
            } catch (error) {
                return false
            }
            return false
        },
        validarItemSeleccionadoAutocomplete () {
            if (this.itemSeleccionadoAutocomplete === '' || this.itemSeleccionadoAutocomplete === undefined) {
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
        validar () {
            if (this.validarItemSeleccionadoAutocomplete && this.validarStock && this.validarMarcaSeleccionada) {
                return true
            }
            return false
        },
        async registrar () {
            if (!this.validar()) {
                this.$toast.info({
                    title: 'No se puede registrar el proveedor',
                    message: 'Existen campos vacios o no validos dentro del formulario'
                })
                return
            }
            const marcasDelProducto = (await axios.get(this.servidorProducto + '/producto/producto/' + this.model.producto.id + '/marcas')).data.data
            const self = this
            const listaIdMarcas = []
            let repetida = false
            marcasDelProducto.forEach(function (m) {
                if (m.id !== self.marcaSeleccionada) {
                    console.log(m.id + '  ' + self.marcaSeleccionada)
                    listaIdMarcas.push(m.id)
                } else {
                    repetida = true
                }
            })
            if (repetida) {
                this.$toast.info({
                    title: 'Ya esta Registrada',
                    message: 'Esta Marca ya esta vinculada a este Producto'
                })
                return 
            }
            listaIdMarcas.push(self.marcaSeleccionada)
            console.log('this.model')
            console.log(this.model)
            axios.put(this.servidorProducto + 'producto/producto', {
                ...this.model,
                marcas: listaIdMarcas
            })
            .then(response => {
                this.$toast.success({
                    title: 'Registro de Marca Exitosa',
                    message: 'Se registro la Marca Correctamente'
                })
                self.limpiarCampos()
                this.$router.push('/producto/')
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
        seleccionar (suggest, e) {
            this.itemSeleccionadoAutocomplete = suggest
            console.log(this.itemSeleccionadoAutocomplete)
            this.agregarProducto ()
        },
        agregarProducto () {
            this.model.producto = {
                ...this.itemSeleccionadoAutocomplete,
                unidadMedidaId: this.itemSeleccionadoAutocomplete.unidadMedida.id
            }
            console.log(this.model)
        },
        async apiProductos () {
            this.itemsProductos = (await axios.get(this.servidorProducto + '/producto/producto')).data.data
        },
        async apiMarcas () {
            this.marcas = []
            const m = (await axios.get(this.servidorProducto + '/producto/marca')).data.data
            const self = this
            m.forEach(function (marca) {
                const aux = {
                    ...marca,
                    text: marca.nombre,
                    value: marca.id
                }
                console.log(aux)
                self.marcas.push(aux)
            })
        }
    },
    watch: {
        'model.nombre' () {
            
        }
    },
    created () {
        this.apiProductos()
        this.apiMarcas()
    }
  }
</script>
<style>
</style>
