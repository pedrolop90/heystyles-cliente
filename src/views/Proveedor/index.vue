<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Proveedores</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <h6 class="heading-small text-muted mb-4">Seleccione para modificar</h6>
                            <div class="text-right" >
                                <base-button outline type="secondary" @click="abrirFormularioRegistro()" >
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                    Registrar
                                </base-button>
                            </div>
                            <b-table striped hover selectable :fields="camposTablaProveedor" :items="itemsProveedores" @row-selected="seleccionado"/>
                            <div class="text-center" v-if="loader">
                                <vue-loaders name="ball-beat" color="blue" scale="2" class="text-center"></vue-loaders>
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
  export default {
    components: {
    },
    name: 'Proveedor',
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
        itemsProveedores: [],
        camposTablaProveedor: [
            { key: 'nombre', label: 'Nombre' },
            { key: 'direccion', label: 'Dirección' },
            { key: 'telefono', label: 'Telefono' },
            { key: 'email', label: 'Correo' }
        ],
        loader: false
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'proveedor'])
    },
    methods: {
        async consultar () {
            this.itemsProveedores = (await axios.get(this.servidorAcceso + 'usuarios/proveedores', {   
                params: {
                    estado: 'ACTIVO', 
                }
            })).data.data
        },
        abrirFormularioRegistro () {
            this.$router.push('/proveedor/registro')
        },
        seleccionado (item) {
            this.$router.push({
                name: 'modificarProveedor',
                params: {
                    proveedorOriginal: item[0]
                }
            })
        }
    },
    watch: {
    },
    created: async function() {
        this.loader = true
        await this.consultar()
        // this.itemsProveedores = this.proveedor
        this.loader = false
    }
  }
</script>