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
                                <h6 class="heading-small text-muted mb-4">Abonos de Factura</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-3">
                                            <base-input 
                                                alternative=""
                                                type="number"
                                                label="Valor"
                                                placeholder="Valor del abono"
                                                input-classes="form-control-alternative"
                                                v-model="valorAbono"
                                                min= 0
                                                max= deuda
                                                :valid="validarAbonos"
                                            />
                                        </div>
                                        <div class="col-lg-2">
                                            <b-form-input
                                                disabled
                                                alternative=""
                                                type="number"
                                                label="Deuda Total"
                                                input-classes="form-control-alternative"
                                                v-model="deuda"
                                                min= 0
                                                max= 1000
                                                size="sm"
                                            />
                                        </div>
                                        <div class="row float-right" >
                                            <base-button outline @click="guardarCambios()" type="success">Registrar</base-button>
                                        </div>
                                    </div>
                                    <b-table
                                        striped
                                        hover
                                        :fields="camposTablaAbonos"
                                        :items="productos"
                                        selected-variant="active"
                                        responsive>
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
                                        <template slot="usuario" slot-scope="data">
                                            {{data.item.usuario.nombres}} {{data.item.usuario.apelidos}} (<em>{{ data.item.usuario.numeroDocumento }}</em>)
                                        </template>
                                    </b-table>
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
import {mapState} from 'vuex'
import axios from 'axios'
import moment from 'moment'
  export default {
    components: {
    },
    name: 'Abono',
    props: {
        facturaOriginal: {
            required: true,
            type: Object
        }
    },
    data() {
      return {
        autocomplete: '',
        loading: false,
        model: {
            abonos: []
        },
        valorAbono: 0,
        camposTablaAbonos: [
            { key: 'usuario', label: 'Usuario' },
            { key: 'fecha_creacion', label: 'Fecha' },
            { key: 'valor', label: 'valor' },
            'Quitar'
        ],
        itemsProductos: [],
        productos: [],
        marcas: [],
        loader: false,
        deuda: undefined
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'servidorProducto', 'proveedor', 'servidorFactura', 'sesionActiva']),
        validarAbonos () {
            try {
                if (this.model.abonos > 0 && this.model.abonos <= this.deuda) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        }
    },
    methods: {
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
            this.model.abonos.forEach(function (abono) {
                if (abono.id !== codQuitar) {
                    aux.push(producto)
                }
            })
            this.model.abonos = aux
            recalcularDeuda()
        },
        recalcularDeuda () {
            if (this.model.abonos.length > 0) {
                const self = this
                let valorTotal = 0
                this.model.abonos.forEach(function (abono) {
                    valorTotal += abono.valor
                })
                this.deuda = this.facturaOriginal.valor - valorTotal
            }
        },
        agregarProducto () {
            this.productos.push(this.itemSeleccionadoAutocomplete)
            this.itemSeleccionadoAutocomplete = {}
            this.autocomplete = ''
        },
        async apiAbonos () {
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
        }
    },
    watch: {},
    created: async function() {
        this.loader = true
        // await this.apiAbonos()
        this.loader = false
    }
  }
</script>
<style>
</style>
