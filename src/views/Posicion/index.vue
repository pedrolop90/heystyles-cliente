<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Almacen</h3>
                                </div>
                            </div>
                        </div>
                        <div class="text-center" v-if="loader">
                            <vue-loaders name="ball-beat" color="blue" scale="2" class="text-center"></vue-loaders>
                        </div>
                        <template>
                            <div class="row">
                                <modificar-lugar :verModalModificar="verModalModificar" :datos="lugarSeleccionado" @esActivoModificar="esActivoModificar" @modificarLugar="modificarLugar"/>
                                <div class="col-lg-4 py-1" v-for="lugar in model.lugares" :key="lugar.id" :value="lugar.id">
                                    <div class="card bg-gradient-primary">
                                        <div class="card-body">
                                            <div class="row">
                                                <span class="h2 font-weight-bold mb-0 text-white my-2">{{ lugar.id}} - {{ lugar.nombre }}</span>
                                            </div>
                                            <b-button pill variant="success" @click="modificarLugarModal(lugar)">Modificar</b-button>
                                            <b-button pill variant="info" @click="gestionarLugar(lugar)" >Gestionar</b-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right" >
                            <registrar-lugar :verModal="verModal" @esActivo="esActivo" @agregarLugar="agregarLugar"/>
                            <base-button outline type="secondary" @click="verModal = true" >
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                    Crear Lugar
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
import RegistrarLugar from './registrar'
import ModificarLugar from './modificar'
export default {
    components: {
        RegistrarLugar,
        ModificarLugar
    },
    data() {
      return {
        model: {
            lugares: []
        },
        loader: false,
        verModal: false,
        verModalModificar: false,
        lugarSeleccionado: {}
      }
    },
    computed: {
        ...mapState(['servidorProducto', 'servidorSeguridad'])
    },
    watch: {
    },
    methods: {
        gestionarLugar (item) {
           console.log(item)
            this.$router.push({
                name: 'gestionarPosicion',
                params: {
                    posicion: item
                }
            })
        },
        modificarLugarModal (lugar) {
            console.log(lugar)
            this.verModalModificar = true
            this.lugarSeleccionado = lugar
        },
        esActivo (value) {
            this.verModal = value
        },
        esActivoModificar (value) {
            this.verModalModificar = value
        },
        async apiLugares () {
            const c = (await axios.get(this.servidorProducto + '/producto/lugar',{
                params: {
                    estado: 'ACTIVO'
                }
            })).data.data
            c.sort(function (a, b){
                if (a.posicion > b.posicion) {
                    return 1
                } else if (a.posicion < b.posicion) {
                    return -1
                }
                return 0
            })
            this.model.lugares = c
        },
        async agregarLugar (informacion) {
            const marca = {
                ...informacion
            }
            const self = this
            axios.post(this.servidorProducto + 'producto/lugar', {
                ...marca
            })
            .then(response => {
                this.$toast.success({
                    title: 'Exito',
                    message: 'Se ha registrado elLugar satisfatoriamente'
                })
                self.model.lugares = []
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
            this.loader = true
            await this.apiLugares()
            this.loader = false
            // this.$store.commit('modificarCargos', cargo)
            // this.$router.push('/marca/')
        },
        async modificarLugar (informacion) {
            const marca = {
                ...informacion
            }
            const self = this
            await axios.put(this.servidorProducto + 'producto/lugar', {
                ...marca
            })
            .then(response => {
                this.$toast.success({
                    title: 'Exito',
                    message: 'Se ha modificado el Lugar satisfatoriamente'
                })
                self.model.lugares = []
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
            this.loader = true
            await this.apiLugares()
            this.loader = false
            // this.$store.commit('modificarCargos', cargo)
            // this.$router.push('/marca/')
        }
    },
    async created () {
        this.loader = true
        await this.apiLugares()
        this.loader = false
    }
}
</script>