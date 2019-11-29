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
                        <h2>Crear Item de Producto</h2>
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </div>
                    <form role="form">
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Nombre</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Nombre de la Marca"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.nombre"
                                    :valid="validarNombre">
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Descripción</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Descripción de la Marca"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.descripcion"
                                    :valid="validarDescripcion">
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
export default {
    name: 'RegistroCuentaBanco',
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
                nombre: undefined,
                descripcion: undefined,
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
        validarDescripcion () {
            if (this.model.descripcion === '' ) {
                return false
            }
            else if (this.model.descripcion === undefined) {
                return undefined
            }
            return true
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
            if (!this.validacion()) {
                this.$toast.info({
                    title: 'No se puede agregar la marca',
                    message: 'Existen campos vacios o no validos dentro del formulario'
                })
                return
            }
            this.$emit('agregarMarca', this.model)
            this.limpiar()
            this.activo = false
            this.$toast.info({
                title: 'Exito',
                message: 'Se agrego una nueva marca'
            })
        },
        limpiar () {
            this.model = {
                nombreBanco: '',
                tipoCuenta: '',
                numeroCuenta: ''
            }
        },
        validacion () {
            if (this.validarNombre && this.validarDescripcion) {
                return true
            }
            return false
        }
    }
}
</script>