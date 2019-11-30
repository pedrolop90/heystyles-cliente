<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Gestionar Item de Producto</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <div>
                                <h6 class="heading-small text-muted mb-4">Lista de Items</h6>

                                
                                <b-table striped hover small :fields="columnasItem" :items="productos" v-if="verTabla">
                                        <template slot="Editar" slot-scope="data">
                                            <modificar-item :verModal="data.item.editar" :unidadesMedidaProp="unidadesMedida" :producto="data.item" @esActivo="data.item.editar = true" @esInactivo="data.item.editar = false" @modificarItem="modificarItem"/>
                                            <base-button outline type="secondary" @click="data.item.editar = true" >
                                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                                Editar
                                            </base-button>
                                        </template>
                                        <template slot="Eliminar" slot-scope="data">
                                            <base-button
                                                outline
                                                type="warning"
                                                @click="eliminarProducto(data.item)"
                                                v-b-popover.hover.top="'Eliminar Producto'">
                                                <i class="fa fa-window-close fa-lg" aria-hidden="true"></i>
                                            </base-button>
                                        </template>
                                </b-table>
                            </div>
                            <div class="text-right" >
                                <base-button outline type="secondary" @click="crearFactura()" >
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                    Crear Factura
                                </base-button>
                            </div>
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
import RegistrarFactura from './registrar.vue'
export default {
    components: {
        RegistrarFactura,
    },
    data() {
      return {
        model: {
            id: '',
            nombre: '',
        },
        columnasItem: [
            { key: 'id', label: 'Codigo' },
            { key: 'nombreProveedor', label: 'Proveedor' },
            { key: 'fechaLimitePago', label: 'Fecha Limite' },
            { key: 'valorTotal', label: 'Total' },
        ],
        verModal: false,
        productos: [],
        verModalEditar: [],
        permisos: undefined,
        marcaSeleccionado: '',
        unidadesMedida: [],
        verTabla: false,
        valor: false
      }
    },
    computed: {
        ...mapState(['servidorFactura', 'servidorSeguridad'])
    },
    watch: {
        'model.id': {
            handler: async function () {
                
            }
        },
        'model.permisos': function () {
            this.mostrarTabla = true
            this.$refs.tabla.clearSelected()
            const self = this
            let index = -1
            if (this.model.permisos === undefined) {
                return
            }
            this.model.permisos.forEach(function (per) {
                index = -1
                const encontrado = self.permisos.find(function (p) {
                    index++
                    console.log(p.id + ' - ' + per)
                    console.log(p.id === per)
                    if (per === undefined) {
                        return false
                    }
                    return p.id === per
                })
                if (encontrado) {
                    self.$refs.tabla.selectRow(index)
                }
            })
        }
    },
    methods: {
        seleccionado (items) {
            this.model.permisos = []
            items.forEach(element => {
                this.model.permisos.push(element.id)
            })
            console.log('seleccionado ' + this.model.permisos)
        },
        async asignarPermisos () {
            const self = this
            axios.put(this.servidorProducto + 'usuarios/cargos', {
                ...self.model,
                permisos: self.model.permisos
            }).then(response => (
                this.$toast.success({
                    title: 'Actualizacion Exitosa',
                    message: 'Cargo Actualizado Exitosamente'
                })
            ))
            // this.$store.commit('modificarCargos', cargo)
            this.$router.push('/usuario/')
        },
        esActivo (value) {
            this.verModal = value
        },
        esActivoEditar (value) {
            console.log(value)
            //this.verModalEditar = value
        },
        async apiCargos () {
            const c = (await axios.get(this.servidorProducto + '/usuarios/cargos')).data.data
            const self = this
            c.forEach(function (cargo) {
                const aux = {
                    ...cargo,
                    text: cargo.nombre,
                    value: cargo.id
                }
                console.log(aux)
                self.cargos.push(aux)
            })
        },
        async apiFacturas () {
            this.verTabla = false
            this.productos = []
            this.verModalEditar = []
            const self = this
            const arrayProducto = []
            this.facturas = (await axios.get(this.servidorFactura + '/factura/factura')).data.data
            this.facturas.forEach(function (item) {
                const p = {
                    ...item.factura,
                    nombreProveedor: item.proveedor.proveedor.nombre
                }
                arrayProducto.push(p)
            }) 
            this.productos = arrayProducto
            this.verTabla = true
        },
        crearMarca () {
            this.$router.push('marca/registrar')
        },
        eliminarProducto (producto) {
            const self = this
            axios.delete(this.servidorFactura + 'producto/producto/' + producto.id)
            .then(response => {
                this.$toast.success({
                    title: 'Eliminación Exitosa',
                    message: 'Se elimino el cargo correctamente'
                })
            self.apiProductos()
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
        },
        modificarItem (informacion) {
            const self = this
            axios.post(this.servidorProducto + '/producto/producto', {
                ...informacion
            })
            .then(response => {
                this.$toast.success({
                    title: 'Registro Exitoso',
                    message: 'Se creo el Item correctamente'
                })
                self.apiProductos()
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
        },
        crearFactura () {
            this.$router.push('/factura/registrar')
        }
    },
    created () {
        this.apiFacturas()
    }
}
</script>