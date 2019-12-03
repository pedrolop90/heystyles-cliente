<template>
<div class="row">
    <div class="col-md-4">
        <modal :show.sync="activo"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div class="text-center text-muted mb-10">
                        <h2>Crear Item</h2>
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </div>
                    <form role="form">
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Nombre</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Nombre del Item"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.nombre"
                                    :valid="validarNombre">
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Unidad de Medida</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Unidad de Medida"
                                    addon-left-icon="fa fa-list-ul"
                                    :valid="validarUnidadMedida">
                            <select class="form-control" v-model="model.unidadMedidaId">
                                <option v-for="item in unidadesMedida" :key="item.id" :value="item.id" >{{ item.nombre }}</option>
                            </select>
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Stock Minimo</small>
                        </div>
                        <base-input alternative
                                    type="number"
                                    class="mb-3"
                                    placeholder="Minima cantidad del Item"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.stockMinimo"
                                    min= 0
                                    max= 1000
                                    :valid="validarStockMinimo">
                        </base-input>
                        <div class="text-center py-1">
                            <base-button @click="agregar()" type="primary" class="my-6 fa fa-check" style="min-width: 150px; margin: 3px !important">
                                Confirmar
                            </base-button>
                        </div>
                    </form>
                </template>
            </card>
        </modal>
    </div>
    </div>
</template>
<script>
const UNIDAD_MEDIDA = [
    { id: '1', nombre: 'LITROS', abreviatura: 'LT', text: 'LITROS', value: '1'},
    { id: '2', nombre: 'METROS', abreviatura: 'MT', text: 'METROS', value: '2'},
    { id: '3', nombre: 'KILOS', abreviatura: 'K', text: 'KILOS', value: '3'},
    { id: '4', nombre: 'LIBRAS', abreviatura: 'L', text: 'LIBRAS', value: '4'},
    { id: '5', nombre: 'GRAMOS', abreviatura: 'G', text: 'GRAMOS', value: '5'},
    { id: '6', nombre: 'CENTIMETROS', abreviatura: 'CM', text: 'CENTIMETROS', value: '6'}
]
    import {mapState} from 'vuex'
    import axios from 'axios'
export default {
    
    name: 'RegistroItemProducto',
    props: {
        verModal: {
            type: Boolean,
            required: true
        }
    },
    data () {
        return {
            activo: false,
            model: {
                nombre: undefined,
                id: null,
                unidadMedidaId: undefined,
                stockMinimo: undefined,
                estado: 'ACTIVO'
            },
            unidadesMedida: UNIDAD_MEDIDA
        }
    },
    computed: {
        ...mapState(['servidorProducto', 'servidorSeguridad']),
        esActivo () {
            return this.activo
        },
        validarNombre () {
            if (this.model.nombre === '' ) {
                return false
            }
            else if (this.model.nombre === undefined) {
                return undefined
            }
            return true
        },
        validarStockMinimo () {
            if (this.model.stockMinimo === '' || this.model.stockMinimo < 0 || this.model.stockMinimo >= 1000) {
                return false
            }
            else if (this.model.stockMinimo === undefined) {
                return undefined
            }
            return true
        },
        validarUnidadMedida () {
            if (this.model.unidadMedidaId === '') {
                return false
            }
            else if (this.model.unidadMedidaId === undefined) {
                return undefined
            }
            return true
        }
    },
    watch: {
        verModal () {
            this.activo = this.verModal
        },
        activo () {
            this.$emit('esActivo', this.activo)
        }
    },
    methods: {
        agregar () {
            if (this.validacion()) {
                this.$toast.info({
                    title: 'No se puede registrar el Item',
                    message: 'Existen campos vacios o no validos dentro del formulario'
                })
                return
            }
            const producto = {
                producto: this.model,
                marcas: []
            }
            console.log(producto)
            this.$emit('agregarItem', producto)
            this.limpiar()
            this.activo = false
        },
        limpiar () {
            this.model = {
                nombreBanco: '',
                tipoCuenta: '',
                numeroCuenta: ''
            }
        },
        validacion () {
            if (this.validarNombre && this.validarDescripcion && this.validarUnidadMedida) {
                return true
            }
            return false
        },
        async apiUnidadesMedidas () {
            this.unidadesMedida = []
            const u = (await axios.get(this.servidorProducto + '/producto/unidad-medida', {
                params: {
                    estado: 'ACTIVO'
                }
            })).data.data
            const self = this
            console.log(u)
            u.forEach(function (medida) {
                const aux = {
                    ...medida
                }
                self.unidadesMedida.push(aux)
            })
        }
    },
    async created () {
        await this.apiUnidadesMedidas()
    }
}
</script>