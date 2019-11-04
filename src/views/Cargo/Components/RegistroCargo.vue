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
                    <div class="text-center text-muted mb-4">
                        <h2>Registro de Cargo</h2>
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </div>
                    <form role="form">
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Nombre del Cargo</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Nombre del Cargo"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.nombre">
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
import {mapState} from 'vuex'
export default {
    name: 'RegistroCargo',
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
                id: '',
                nombre: '',
                permisos: []
            }
        }
    },
    computed: {
        ...mapState(['cargos']),
        esActivo () {
            return this.activo
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
            console.log('entrew ' + this.model)
            this.model.id = '10'
            this.cargos.push(this.model)
            this.limpiar()
            this.activo = false
            this.$toast.info({
                title: 'Exito',
                message: 'Se agrego un nuevo cargo exitosamente'
            })
        },
        limpiar () {
            this.model = {
                nombre: ''
            }
        }
    }
}
</script>