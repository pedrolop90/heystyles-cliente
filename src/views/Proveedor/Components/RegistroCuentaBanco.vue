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
                        <h2>Datos de Cuenta Bancaria</h2>
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </div>
                    <form role="form">
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Nombre del banco</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Nombre del Banco"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.nombreBanco"
                                    :valid="validarNombreBanco">
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Tipo de Cuenta</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Tipo de Cuenta"
                                    addon-left-icon="fa fa-list-ul"
                                    :valid="validarTipoCuenta">
                            <select class="form-control" v-model="model.tipoCuenta">
                                <option v-for="item in tiposCuenta" :key="item.value" :value="item.value" >{{ item.text }}</option>
                            </select>
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Numero de Cuenta</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Numero de Cuenta"
                                    addon-left-icon="fa fa-info"
                                    v-model="model.numeroCuenta"
                                    :valid="validarNumeroCuenta">
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
const TIPO_CUENTA = [
    {value: 'CA', text: 'Cuenta de Ahorro'},
    {value: 'CC', text: 'Cuenta Corriente'},
    {value: 'C', text: 'Convenio'}
]
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
            tiposCuenta: TIPO_CUENTA,
            model: {
                nombreBanco: undefined,
                tipoCuenta: undefined,
                numeroCuenta: undefined,
                proveedorId: null,
                id: null
            }
        }
    },
    computed: {
        esActivo () {
            return this.activo
        },
        validarNombreBanco () {
            if (this.model.nombreBanco === '' ) {
                return false
            }
            else if (this.model.nombreBanco === undefined) {
                return undefined
            }
            return true
        },
        validarTipoCuenta () {
            if (this.model.tipoCuenta === '' ) {
                return false
            }
            else if (this.model.tipoCuenta === undefined) {
                return undefined
            }
            return true
        },
        validarNumeroCuenta () {
            if (this.model.numeroCuenta === '' ) {
                return false
            }
            else if (this.model.numeroCuenta === undefined) {
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
                    title: 'No se puede agregar la cuenta de banco',
                    message: 'Existen campos vacios o no validos dentro del formulario'
                })
                return
            }
            console.log('entrew ' + this.model)
            this.$emit('agregarCuenta', this.model)
            this.limpiar()
            this.activo = false
            this.$toast.info({
                title: 'Exito',
                message: 'Se agrego una nueva cuenta bancaria'
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
            if (this.validarNombreBanco && this.validarTipoCuenta && this.validarNumeroCuenta) {
                return true
            }
            return false
        }
    }
}
</script>