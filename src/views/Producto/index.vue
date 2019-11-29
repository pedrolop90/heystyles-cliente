<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Productos</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <h6 class="heading-small text-muted mb-4">Lista de Productos</h6>
                            <b-table striped hover :fields="camposTablaProducto" :items="itemsProductos" responsive="sm" selected-variant="active">
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
                            <div class="text-right" >
                                <base-button outline type="secondary" @click="gestionarItems()" >
                                    <i class="fa fa-users" aria-hidden="true"></i>
                                    Gestionar Items de Productos
                                </base-button>
                                <base-button outline type="secondary" @click="gestionarMarca()" >
                                    <i class="fa fa-users" aria-hidden="true"></i>
                                    Gestionar Marcas
                                </base-button>
                                <base-button outline type="secondary" @click="abrirFormularioRegistro()" >
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                    Registrar Producto
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
import 'flatpickr/dist/flatpickr.css'
import {mapState} from 'vuex'
import axios from 'axios'
import moment from 'moment'
import Modificar from './modificar'
  export default {
    components: {
        Modificar
    },
    name: 'Producto',
    data() {
      return {
        model: {
            nombre: '',
            descripcion: '',
            telefono: '',
            direccion: '',
            email: '',
            fechaLimitePago: 0,
            id: undefined
        },
        itemsProductos: [
            { nombre: 'Pegante Super 200 ml amarillo', marca: 'CABALLO', unidadMedida: 'ML', stockMinimo: '50' },
            { nombre: 'Rollo de tela de Suela color negro calibre 86 X 100 METROS', marca: 'TOCAN', unidadMedida: 'MTR', stockMinimo: '100' }
        ],
        camposTablaProducto: [
            { key: 'nombre', label: 'Producto' },
            { key: 'marca', label: 'Marca' },
            { key: 'unidadMedida', label: 'Unidad' },
            { key: 'stockMinimo', label: 'Stock Minimo' },
            'Eliminar'
        ],
        cargos: undefined,
        cargosAux: [
            {id: '1', nombre: 'Gerente'},
            {id: '2', nombre: 'Secretaria'},
            {id: '3', nombre: 'Bodeguero'}
        ]
      }
    },
    computed: {
        ...mapState(['servidorProducto', 'usuarios'])
    },
    methods: {
        async listarAux () {
            const usuarios = this.usuarios
            this.formatearItemsAux( usuarios )
        },
        async apiProductos () {
            const productos = (await axios.get(this.servidorProducto + 'producto/marca-producto')).data.data
            this.itemsProductos = []
            this.formatearItems( productos )
        },
        abrirFormularioRegistro () {
            this.$router.push('./registro')
        },
        gestionarMarca () {
            this.$router.push({
                name: 'marca'
            })
        },
        gestionarItems () {
            this.$router.push({
                name: 'items'
            })
        },
        formatearItems (productos) {
            const self = this
            productos.forEach( function(p) {
                const item = {
                    ...p.producto,
                    marca: p.marca.nombre,
                    unidadMedida: p.producto.unidadMedida.abreviatura,
                    unidadMedidaId: p.producto.unidadMedida.id,
                    idMarca: p.marca.id
                }
                self.itemsProductos.push(item)
            })
        },
        formatearItemsAux (Productos) {
            const self = this
            Productos.forEach( function(Producto) {
                const cargoItem = self.cargosAux.find(function (cargo){
                    console.log(Producto.cargoId)
                    return cargo.id === Producto.marcaId 
                })
                const item = {
                    ...Producto,
                    cargo: cargoItem.nombre
                }
                self.itemsProductos.push(item)
            })
        },
        async eliminarProducto (producto) {
            console.log(producto)
            const marcasDelProducto = (await axios.get(this.servidorProducto + '/producto/producto/' + producto.id + '/marcas')).data.data
            const self = this
            const listaIdMarcas = []
            let repetida = false
            marcasDelProducto.forEach(function (m) {
                if (m.id !== producto.idMarca) {
                    console.log(m.id + '  ' + producto.idMarca)
                    listaIdMarcas.push(m.id)
                }
            })
            axios.put(self.servidorProducto + 'producto/producto', {
                producto: {
                    ...producto
                },
                marcas: listaIdMarcas
            })
            .then(response => {
                self.$toast.success({
                    title: 'Registro de Marca Exitosa',
                    message: 'Se registro la Marca Correctamente'
                })
                self.apiProductos()
            })
            .catch(error => {
                self.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
        },
    },
    watch: {
    },
    created: function() {
        this.apiProductos()
        // this.listarAux()
    }
  }
</script>