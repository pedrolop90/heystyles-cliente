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
                                        <select class="form-control" v-model="model.id">
                                            <option v-for="item in cargos" :key="item.id" :value="item.id" >{{ item.nombre }}</option>
                                        </select>
                                    </base-input>
                                </div>
                            </div>
                            <div v-show="model.nombre !== ''">
                                <h6 class="heading-small text-muted mb-4">Seleccione los Permisos</h6>
                                <b-table striped hover selectable :fields="columnasPermisos" :items="permisos" @row-selected="seleccionado" responsive="sm" select-mode="multi" ref="tabla">
                                </b-table>
                            </div>
                            
                            <div class="text-right" >
                                <registro-cargo :verModal="verModal" @esActivo="esActivo"/>
                                <base-button outline type="secondary" @click="verModal = true">
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                    Crear Cargo
                                </base-button>
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
            permisos: []
        },
        columnasPermisos: [
            {key: 'nombre', label: 'Nombre'},
            {key: 'descripcion', label: 'descripcion'}
        ],
        verModal: false,
        cargos: undefined,
        permisos: undefined
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'servidorSeguridad'])
    },
    watch: {
        'model.id': async function () {
            const self = this
            console.log('id ' + this.model.id)
            if (this.model.id === undefined) {
                return
            }
            const datos = (await axios.get(this.servidorAcceso + 'usuarios/cargos/'+self.model.id)).data.data
            this.model = {
                ...datos
            }
            console.log('>-------------<')
            console.log(datos)
            /*
            this.model = {
                ...this.cargos.find(function (cargo) {
                    console.log(cargo.permisos)
                    return cargo.id === self.model.id
                })
            } */
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
                    console.log(p.id)
                    console.log(per.id)
                    if (per.id === undefined) {
                        return false
                    }
                    return p.id === per.id
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
                this.model.permisos.push(element)
            })
            console.log('seleccionado ' + this.model.permisos)
        },
        async asignarPermisos () {
            const cargo = {
                ...this.model
            }
            
            // this.$store.commit('modificarCargos', cargo)
            this.$router.push('/usuario/')
        },
        esActivo (value) {
            this.verModal = value
        },
        async apiCargos () {
            this.cargos = (await axios.get(this.servidorAcceso + '/usuarios/cargos')).data.data
        },
        async apiPermisos () {
            this.permisos = (await axios.get(this.servidorSeguridad + 'Permisos')).data.data
            console.log(this.permisos)
        }
    },
    created () {
        this.apiCargos()
        this.apiPermisos()
    }
}
</script>