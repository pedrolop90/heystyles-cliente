<template>
  <div>
        <div class="container-fluid mt--5">
            <div class="row">
                <div class="col-xl-12 order-xl-1" v-if="!notificacionSeleccionado">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Notificaciones</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <div>
                                <h6 class="heading-small text-muted mb-4">Lista de Notificaciones</h6>
                                  <b-table
                                    :fields="columnas"
                                    :items="notificaciones"
                                    @row-selected="seleccionado"
                                    selectable
                                    select-mode="single">
                                    <template slot="estado" slot-scope="data">
                                      {{ buscarEstado(data.item.estado) }}
                                    </template>
                                  </b-table>
                                </div>
                        </template>
                    </card>
                </div>
                <ver :notificacion="notificacionSeleccionado" v-if="notificacionSeleccionado" @retroceder="retroceder"/>
            </div>
        </div>
    </div>
</template>
<script>
const ESTADOS = [
    { estado: 'SIN_LEER', descripcion: 'NO LEIDO'},
    { estado: 'LEIDO', descripcion: 'LEIDO'}
]
import {mapState} from 'vuex'
import axios from 'axios'
import ver from './ver'
export default {
  props:{},
  components: {
    axios,
    ver
  },
  data() {
      return {
        notificaciones: [],
        cantidad: 0,
        columnas: [
            { key: 'nombre', label: 'Asunto' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'estado', label: 'Estado' },
        ],
        estados: ESTADOS,
        verNotificacion: false,
        notificacionSeleccionado: undefined
      }
  },
  computed: {
    ...mapState(['servidorNotificacion']),
    notificaciones () {
        if (notificaciones !== null) {

            this.cantidad = this.notificaciones.length
        }
    }
  },
  methods: {
      async retroceder () {
        await this.cargarNotificaciones()
        this.notificacionSeleccionado = undefined
      },
      seleccionado (item) {
        this.notificacionSeleccionado = item[0]
      },
      async cargarNotificaciones () {
        this.notificaciones = (await axios.get(this.servidorNotificacion + '/notificaciones')).data.data
      },
      buscarEstado (estadoMensaje) {
        const estado = this.estados.find(function (e){
          return e.estado === estadoMensaje
        })
        return estado.descripcion
      }
  },
  async created () {
      await this.cargarNotificaciones()
  }

}
</script>