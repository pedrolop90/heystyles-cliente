<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Gestion de Cargos</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <div>
                                <h6 class="heading-small text-muted mb-4">Lista de Marcas</h6>
                                <div class="text-right" >
                                    <registrar-marca :verModal="verModal" @esActivo="esActivo" @agregarMarca="agregarMarca"/>
                                        <base-button outline type="secondary" @click="verModal = true" >
                                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                        Crear Marca
                                    </base-button>
                                </div>
                                <b-table hover small striped :fields="columnasMarcas" :items="marcas">
                                        <template slot="Eliminar" slot-scope="data">
                                            <base-button
                                                outline
                                                type="warning"
                                                @click="eliminarMarca(data.item)"
                                                v-b-popover.hover.top="'Eliminar Esta Marca'">
                                                <i class="fa fa-window-close fa-lg" aria-hidden="true"></i>
                                            </base-button>
                                        </template>
                                </b-table>
                                <div class="text-center" v-if="loader">
                                    <vue-loaders name="ball-beat" color="blue" scale="2" class="text-center"></vue-loaders>
                                </div>
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
import RegistrarMarca from './registrar'
export default {
    components: {
      RegistrarMarca
    },
    data() {
      return {
        model: {
            id: '',
            nombre: '',
            idSecurity: null,
            nivel: null,
            permisos: []
        },
        columnasMarcas: [
            { key: 'nombre', label: 'Nombre' },
            { key: 'descripcion', label: 'descripcion' },
            'Eliminar'
        ],
        verModal: false,
        marcas: [],
        permisos: undefined,
        marcaSeleccionado: '',
        loader: false
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
                console.log(datos)
                this.model.id = datos.cargo.id
                this.model.nombre = datos.cargo.nombre
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
        async apiMarcas () {
            const m = (await axios.get(this.servidorProducto + '/producto/marca', {
                params: {
                    estado: 'ACTIVO'
                }
            })).data.data
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
        },
        async apiPermisos () {
            this.permisos = (await axios.get(this.servidorSeguridad + 'Permisos', {
                params: {
                    estado: 'ACTIVO'
                }
            })).data.data
        },
        crearMarca () {
            this.$router.push('marca/registrar')
        },
        eliminarMarca (marca) {
            const self = this
            axios.delete(this.servidorProducto + 'producto/marca/' + marca.id)
            .then(response => {
                this.$toast.success({
                    title: 'Eliminación Exitosa',
                    message: 'Se elimino La marca correctamente'
                })
                self.marcas = []
                self.apiMarcas()
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
            // this.$router.push('usuario/')
        },
        agregarMarca (informacion) {
            const marca = {
                ...informacion
            }
            // this.marcas.push(marca)
            const self = this
            axios.post(this.servidorProducto + 'producto/marca', {
                ...marca
            })
            .then(response => {
                this.$toast.success({
                    title: 'Exito',
                    message: 'Se ha registrado la Marca satisfatoriamente'
                })
                self.marcas = []
                self.apiMarcas()
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
            // this.$store.commit('modificarCargos', cargo)
            this.$router.push('/marca/')
        },
    },
    async created () {
        this.loader = true
        await this.apiMarcas()
        // this.apiPermisos()
        this.loader = false
    }
}
</script>