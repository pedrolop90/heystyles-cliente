<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Crear de Cargo</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <div class="row">
                                <div class="col-lg-4">
                                    <base-input alternative=""
                                        label="Nombre"
                                        placeholder="Nuevo cargo"
                                        input-classes="form-control-alternative"
                                        v-model="model.nombre"
                                    />
                                </div>
                            </div>
                            <div v-show="model.nombre.length > 2">
                                <h6 class="heading-small text-muted mb-4">Seleccione los Permisos</h6>
                                <b-table striped hover selectable :fields="columnasPermisos" :items="permisos" @row-selected="seleccionado" responsive="sm" select-mode="multi" ref="tabla">
                                </b-table>
                            </div>
                            
                            <div class="text-right" >
                                <base-button outline type="success" v-show="model.nombre.length > 2" @click="crearPermiso()">
                                    Registrar Cargo
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
            id: null,
            nombre: '',
            idSecurity: null,
            nivel: 0,
            permisos: []
        },
        columnasPermisos: [
            {key: 'nombre', label: 'Nombre'},
            {key: 'descripcion', label: 'descripcion'}
        ],
        permisos: undefined
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'servidorSeguridad'])
    },
    watch: {
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
        async crearPermiso () {
            const self = this
            axios.post(this.servidorAcceso + 'usuarios/cargos', {
                cargo: self.model,
                permisos: self.model.permisos
            })
            .then(response => {
                consle.log('hola')
                this.$router.push('cargo/')
                this.$toast.success({
                    title: 'Exito',
                    message: 'Se ha registrado el cargo satisfatoriamente'
                })
            })
            .catch(error => {
                this.$toast.error({
                    title: error.response.data.message,
                    message: error.response.data.errors[0].message
                })
            })
            // this.$store.commit('modificarCargos', cargo)
            this.$router.push('/cargo/')
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