<template>
    <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Usuarios</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <h6 class="heading-small text-muted mb-4">Seleccione para modificar</h6>
                            <b-table striped hover selectable :fields="camposTablaUsuario" :items="itemsUsuarios" @row-selected="seleccionado" responsive="sm" selected-variant="active" select-mode="single" >
                                
                            </b-table>
                            <div class="text-right" >
                                <base-button outline type="secondary" @click="gestionarCargos()" >
                                    <i class="fa fa-users" aria-hidden="true"></i>
                                    Gestionar Cargos
                                </base-button>
                                <base-button outline type="secondary" @click="abrirFormularioRegistro()" >
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                    Registrar
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
import 'flatpickr/dist/flatpickr.css'
import {mapState} from 'vuex'
import axios from 'axios'
import moment from 'moment'
import Modificar from './modificar'
  export default {
    components: {
        Modificar
    },
    name: 'index',
    data() {
      return {
        model: {
            nombre: '',
            descripcion: '',
            telefono: '',
            direccion: '',
            email: '',
            fechaLimitePago: 0,
            id: undefined
        },
        itemsUsuarios: [],
        camposTablaUsuario: [
            { key: 'numeroDocumento', label: 'Documento' },
            { key: 'nombres', label: 'Nombres' },
            { key: 'apellidos', label: 'Apellidos' },
            { key: 'email', label: 'Email' },
            { key: 'telefono', label: 'Telefono' },
            { key: 'cargo', label: 'Cargo'}
        ],
        cargos: undefined,
        cargosAux: [
            {id: '1', nombre: 'Gerente'},
            {id: '2', nombre: 'Secretaria'},
            {id: '3', nombre: 'Bodeguero'}
        ]
      }
    },
    computed: {
        ...mapState(['servidorAcceso', 'usuarios', 'sesionActiva'])
    },
    methods: {
        async listarAux () {
            const usuarios = this.usuarios
            this.formatearItemsAux( usuarios )
        },
        async listar () {
            const headers = { usuario: this.sesionActiva.numeroDocumento}
            const usuarios = (await axios.get(this.servidorAcceso + 'usuarios/usuarios', headers)).data.data
            console.log('<<<<<' + usuarios)
            this.formatearItems( usuarios )
        },
        abrirFormularioRegistro () {
            this.$router.push('/usuario/registro')
        },
        gestionarCargos () {
            this.$router.push({
                name: 'cargo'
            })
        },
        formatearItems (usuarios) {
            const self = this
            usuarios.forEach( function(usuario) {
                const item = {
                    ...usuario.usuario,
                    cargo: usuario.cargo.nombre
                }
                self.itemsUsuarios.push(item)
            })
        },
        formatearItemsAux (usuarios) {
            const self = this
            usuarios.forEach( function(usuario) {
                const cargoItem = self.cargosAux.find(function (cargo){
                    console.log(usuario.cargoId)
                    return cargo.id === usuario.cargoId 
                })
                const item = {
                    ...usuario,
                    cargo: cargoItem.nombre
                }
                self.itemsUsuarios.push(item)
            })
        },
        seleccionado (item) {
            this.$router.push({
                name: 'usuarioModificar',
                params: {
                    usuario: item[0]
                }
            })
            console.log('me clickeaste ' + item[0])
        }
    },
    watch: {
    },
    created: function() {
        this.listar()
        // this.listarAux()
    }
  }
</script>