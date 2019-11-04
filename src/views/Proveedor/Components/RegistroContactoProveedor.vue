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
                        <h2>Datos de Contacto</h2>
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </div>
                    <form role="form">
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Nombres</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Nombres contacto"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.nombres">
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Apellidos</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Apellidos"
                                    addon-left-icon="fa fa-university"
                                    v-model="model.apellidos">
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Tipo Documento</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Tipo Documento"
                                    addon-left-icon="fa fa-list-ul">
                            <select class="form-control" v-model="model.tipoDocumento">
                                <option v-for="item in tipoDocumentos" :key="item.value" :value="item.value" >{{ item.text }}</option>
                            </select>
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Numero de Documento</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Numero de documento"
                                    addon-left-icon="fa fa-info"
                                    v-model="model.numeroDocumento">
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Email</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Email"
                                    addon-left-icon="fa fa-info"
                                    v-model="model.email">
                        </base-input>
                        <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                            <small>Telefono</small>
                        </div>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Numero de telefono"
                                    addon-left-icon="fa fa-info"
                                    v-model="model.telefono">
                        </base-input>
                        <div class="mb-3">
                            <div class="text-left text-muted mb-4" style="margin-bottom: 0px !important;">
                                <small>Fecha de Nacimiento</small>
                            </div>
                            <base-input alternative=""
                                placeholder="Fecha de Nacimiento"
                                input-classes="form-control-alternative">
                                <flat-picker slot-scope="{focus, blur}"
                                    @on-open="focus"
                                    @on-close="blur"
                                    :config="{allowInput: true}"
                                    class="form-control datepicker"
                                    v-model="model.fechaNacimiento">
                                </flat-picker>
                            </base-input>
                        </div>
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
const TIPO_DOCUMENTO = [
    {value: 'CC', text: 'Cedula'},
    {value: 'TI', text: 'Tarjeta de Identidad'}
]
import flatPicker from 'vue-flatpickr-component'
import moment from 'moment'

export default {
    name: 'RegistroContactoProveedor',
    components: { flatPicker },
    props: {
        verModalContacto: {
            type: Boolean,
            required: true
        }
    },
    data () {
        return {
            activo: false,
            tipoDocumentos: TIPO_DOCUMENTO,
            model: {
                nombres: '',
                apellidos: '',
                tipoDocumento: '',
                numeroDocumento: '',
                email: '',
                telefono: '',
                fechaNacimiento: moment().format('YYYY-MM-DD'),
                idPersona: null,
                id: null
            }
        }
    },
    create () {
        console.log('secreo')
    },
    computed: {
        esActivo () {
            return this.activo
        }
    },
    watch: {
        verModalContacto () {
            console.log('entre')
            this.activo = this.verModalContacto
        },
        activo () {
            this.$emit('esActivoModalContacto', this.activo)
        }
    },
    methods: {
        agregar () {
            console.log('entrew ' + this.model)
            this.$emit('agregarContacto', this.model)
            this.limpiar()
            this.activo = false
            this.$toast.info({
                title: 'Exito',
                message: 'Se agrego un nuevo contacto'
            })
        },
        limpiar () {
            this.model = {
                nombreBanco: '',
                tipoCuenta: '',
                numeroCuenta: ''
            }
        }
    }
}
</script>