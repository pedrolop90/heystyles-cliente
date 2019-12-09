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
                                                v-model="model.valor"
                                                min= 0
                                                max= deuda
                                                :valid="validarAbonos"
                                            />
                                        </div>
                                        <div class="col-lg-2">
                                            <base-input
                                                disabled
                                                alternative=""
                                                type="number"
                                                label="Deuda Total"
                                                input-classes="form-control-alternative"
                                                v-model="deuda"
                                                size="sm"
                                            />
                                        </div>
                                        <div class="col-lg-2">
                                            <div class="row float-right py-4" >
                                                <base-button outline @click="registrar()" type="success">Registrar</base-button>
                                            </div>
                                        </div>
                                    </div>
                                    <b-table
                                        striped
                                        hover
                                        :fields="camposTablaAbonos"
                                        :items="abonos"
                                        selected-variant="active"
                                        responsive>
                                        <template slot="Quitar" slot-scope="data">
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
                                            {{data.item.usuario.nombres}} {{data.item.usuario.apelidos}} (<em>tel: {{ data.item.usuario.telefono }}</em>)
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
            facturaId: undefined,
            id: null,
            usuarioId: undefined,
            valor: 0
        },
        abonos: [],
        valorAbono: 0,
        camposTablaAbonos: [
            { key: 'id', label: 'id' },
            { key: 'usuario', label: 'Usuario' },
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
                if (this.model.valor > 0 && this.model.valor <= this.deuda) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        }
    },
    methods: {
        async registrar () {
            if (!this.validarAbonos) {
                this.$toast.error({
                    title: 'Abono no valido',
                    message: 'El abono debe ser de 0 y menor que la deuda final'
                })
                return
            }
            const self = this
            axios.put(this.servidorFactura + 'factura/abonos', {
                ...self.model
            })
            .then(response => {
                this.$toast.success({
                    title: 'Actualizacion Exitosa',
                    message: 'Se actualizo la Posición correctamente'
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
        quitarProducto (codQuitar) {
            axios.delete(this.servidorFactura + 'factura/abonos/' + codQuitar)
            this.$toast.info({
                title: 'Eliminado Correctamente',
                message: 'Se ha eliminado correctamente el abono'
            })
            const aux = []
            this.abonos.forEach(function (abono) {
                if (abono.id !== codQuitar) {
                    aux.push(abono)
                }
            })
            this.abonos = aux
        },
        async apiAbonos () {
            const self = this
            this.abonos = (await axios.get(this.servidorFactura + 'factura/abonos'/* ,{
                params: {
                    facturaId: self.facturaOriginal.id
                }
            }*/)).data.data
            const aux = []
            this.abonos.forEach(async  function (abono) {
                if (abono.facturaId === self.facturaOriginal.id) {
                    const usuario = (await axios.get(self.servidorAcceso + 'usuarios/usuarios/' + abono.usuarioId)).data.data
                    abono.usuario = usuario
                    aux.push(abono)
                }
            })
            this.abonos = aux
        },
        limpiar () {
            if (this.limpiarAutocomplete) {
                this.autocomplete =''
            }
        }
    },
    watch: {
        abonos () {
            let i = 0
            const self = this
            let valorTotal = 0
            this.abonos.forEach(function (abono) {
                valorTotal += abono.valor
                i++
            })
            if (i === 0) {
                this.deuda = this.facturaOriginal.valorTotal
            } else {
                this.deuda = this.facturaOriginal.valorTotal - valorTotal
            }
        },
    },
    created: async function() {
        this.loader = true
        console.log('this.sesionActiva')
        console.log(this.sesionActiva)
        await this.apiAbonos()
        this.model.usuarioId = this.sesionActiva.id
        this.model.facturaId = this.facturaOriginal.id
        this.loader = false
    }
  }
</script>
<style>
</style>
