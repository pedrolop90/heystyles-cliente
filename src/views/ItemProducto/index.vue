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
                                <div class="text-right" >
                                    <registrar-item :verModal="verModal" @esActivo="esActivo" @agregarItem="agregarItem"/>
                                    <base-button outline type="secondary" @click="verModal = true" >
                                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                        Crear Item
                                    </base-button>
                                </div>
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
                                        <template slot="unidadMedida" slot-scope="data">
                                            {{ data.item.unidadMedida.abreviatura }}
                                        </template>
                                </b-table>
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
import RegistrarItem from './registrar.vue'
import ModificarItem from './modificar.vue'
export default {
    components: {
        RegistrarItem,
        ModificarItem
    },
    data() {
      return {
        model: {
            id: '',
            nombre: '',
        },
        columnasItem: [
            { key: 'nombre', label: 'Nombre' },
            { key: 'stockMinimo', label: 'Stock Minimo' },
            { key: 'unidadMedida', label: 'Unidad de Medidad' },
            'Editar',
            'Eliminar'
        ],
        verModal: false,
        verModalEditar: [],
        productos: [
            { nombre: 'Pegante Super 200 ml amarillo', descripcion: 'Pegante Super 200 ml amarillo', unidadMedida: 'ML', stockMinimo: '50' },
            { nombre: 'Rollo de tela de Suela color negro calibre 86 X 100 METROS', descripcion: 'Rollo de tela de Suela color negro calibre 86 X 100 METROS', unidadMedida: 'MTR', stockMinimo: '100' }
        ],
        permisos: undefined,
        marcaSeleccionado: '',
        unidadesMedida: [],
        verTabla: false,
        valor: false
      }
    },
    computed: {
        ...mapState(['servidorProducto', 'servidorSeguridad'])
    },
    watch: {
        cargoSeleccionado : async function () {
            const self = this
                this.model.id = this.cargoSeleccionado
                console.log('id ' + this.model.id)
                const datos = (await axios.get(this.servidorProducto + 'usuarios/cargos/'+self.model.id)).data.data
                this.model = {
                    ...datos
                }
                this.model.id = datos.cargo.id
                this.model.nombre = datos.cargo.nombre
                /*
                this.model = {
                    ...this.cargos.find(function (cargo) {
                        console.log(cargo.permisos)
                        return cargo.id === self.model.id
                    })
                } */
        },
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
        async apiProductos () {
            this.verTabla = false
            this.verModalEditar = []
            const self = this
            const arrayProducto = []
            this.productos = (await axios.get(this.servidorProducto + '/producto/producto')).data.data
            this.productos.forEach(function (item) {
                const p = {
                    ...item,
                    editar: false,
                    unidadMedidaId: item.unidadMedida.id
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
            axios.delete(this.servidorProducto + 'producto/producto/' + producto.id)
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
        agregarItem (informacion) {
            const self = this
            axios.put(this.servidorProducto + '/producto/producto', {
                ...informacion
            })
            .then(response => {
                this.$toast.success({
                    title: 'Modificacion Exitosa',
                    message: 'Se modifico el Item correctamente'
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
        async apiUnidadesMedidas () {
            this.unidadesMedida = []
            const u = (await axios.get(this.servidorProducto + '/producto/unidad-medida')).data.data
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
    created () {
        this.apiProductos()
        this.apiUnidadesMedidas()
    }
}
</script>