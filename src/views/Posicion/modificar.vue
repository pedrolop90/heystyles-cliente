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
                        <h2>Modificar Posición</h2>
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </div>
                    <form role="form">
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Nombre</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Nombre del Lugar"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.nombre"
                                    :valid="validarNombre"
                                    max-length="15">
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Posición</small>
                        </div>
                        <base-input 
                            alternative=""
                            type="number"
                            placeholder="Posición"
                            input-classes="form-control-alternative"
                            v-model="model.posicion"
                            min= -100
                            max= 100
                            :valid="validarPosicion"
                        />
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
export default {
    name: 'ModificarLugar',
    props: {
        verModalModificar: {
            type: Boolean,
            required: true
        },
        datos: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            activo: false,
            model: {
                nombre: undefined,
                posicion: 0,
                estado: "ACTIVO",
                id: null
            }
        }
    },
    computed: {
        esActivo () {
            return this.activo
        },
        validarNombre () {
            if (this.model.nombre === '' ) {
                return false
            }
            else if (this.model.nombre === undefined) {
                return undefined
            }
            return true
        },
        validarPosicion () {
            try {
                if (this.model.posicion === '') {
                    return false
                }
                if (this.model.posicion >= -100 && this.model.posicion <= 100) {
                    return true
                }
            } catch (error) {
                return false
            }
            return false
        }
    },
    watch: {
        verModalModificar () {
            this.activo = this.verModalModificar
        },
        activo () {
            this.$emit('esActivoModificar', this.activo)
        },
        datos () {
            this.model = {
                ...this.datos
            }
        }
    },
    methods: {
        agregar () {
            if (!this.validacion()) {
                this.$toast.info({
                    title: 'No se puede modificar el Lugar',
                    message: 'Existen campos vacios o no validos dentro del formulario'
                })
                return
            }
            this.$emit('modificarLugar', this.model)
            this.limpiar()
            this.activo = false
        },
        limpiar () {
            this.model = {
                nombre: '',
                posicion: '',
                estado: "ACTIVO",
                id: null
            }
        },
        validacion () {
            if (this.validarNombre && this.validarPosicion) {
                return true
            }
            return false
        }
    }
}
</script>