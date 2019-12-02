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
                            <div class="row">
                                <div class="col-lg-4">
                                    <base-input label="Cargos">
                                        <b-form-select class="form-control" v-model="cargoSeleccionado" :options="cargos">
                                        </b-form-select>
                                    </base-input>
                                </div>
                                <div class="col-lg-8">
                                    <base-button class="my-4" outline type="info" @click="crearCargo()">
                                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                        Crear Cargo
                                    </base-button>
                                    <base-button class="my-4" outline type="warning" @click="eliminarCargo()">
                                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                        Eliminar Cargo
                                    </base-button>
                                </div>
                            </div>
                            <div v-show="model.nombre !== ''">
                                <h6 class="heading-small text-muted mb-4">Seleccione los Permisos</h6>
                                <b-table striped hover selectable :fields="columnasPermisos" :items="permisos" @row-selected="seleccionado" responsive="sm" select-mode="multi" ref="tabla">
                                </b-table>
                            </div>
                            
                            <div class="text-right" >
                                <base-button outline type="success" v-show="model.nombre !== ''" @click="asignarPermisos()">
                                    Asignar Permisos
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
import RegistroCargo from './Components/RegistroCargo'
import axios from 'axios'
export default {
    components: {RegistroCargo},
    data() {
      return {
        model: {
            id: '',
            nombre: '',
            idSecurity: null,
            nivel: null,
            permisos: []
        },
        columnasPermisos: [
            {key: 'nombre', label: 'Nombre'},
            {key: 'descripcion', label: 'descripcion'}
        ],
        verModal: false,
        cargos: [],
        permisos: undefined,
        cargoSeleccionado: ''
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'servidorSeguridad'])
    },
    watch: {
        cargoSeleccionado : async function () {
            const self = this
                this.model.id = this.cargoSeleccionado
                const datos = (await axios.get(this.servidorAcceso + 'usuarios/cargos/'+self.model.id)).data.data
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
            console.log('entre ----')
            let index = -1
            if (this.model.permisos === undefined) {
                return
            }
            this.model.permisos.forEach(function (per) {
                index = -1
                console.log('----------------')
                console.log('')
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
            axios.put(this.servidorAcceso + 'usuarios/cargos', {
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
        async apiCargos () {
            const c = (await axios.get(this.servidorAcceso + '/usuarios/cargos')).data.data
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
        async apiPermisos () {
            this.permisos = (await axios.get(this.servidorSeguridad + 'Permisos')).data.data
            console.log(this.permisos)
        },
        crearCargo () {
            this.$router.push('cargo/registrar')
        },
        eliminarCargo () {
            axios.delete(this.servidorAcceso + 'usuarios/cargos/' + this.model.id)
            .then(response => {
                this.$toast.success({
                    title: 'Eliminación Exitosa',
                    message: 'Se elimino el cargo correctamente'
                })
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
            this.$router.push('usuario/')
        }
    },
    created () {
        this.apiCargos()
        this.apiPermisos()
    }
}
</script>