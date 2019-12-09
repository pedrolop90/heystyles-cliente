<template>
                <div class="col-xl-12 order-xl-1">
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
                                <h6 class="heading-small text-muted mb-4">Ver Notificacion</h6>
                                  <div class="col-lg-12">
                                    <base-input alternative=""
                                     label="Asunto"
                                     placeholder="Asunto"
                                     input-classes="form-control-alternative"
                                     disabled
                                     v-model="asunto"
                                    />
                                  </div>
                                  <div class="col-lg-12">
                                    <textarea
                                        class="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows="3"
                                        placeholder="Descripción"
                                        v-model="descripcion">
                                    </textarea>
                                  </div>
                                  <div class="row float-right py-2">
                                    <base-button
                                        outline
                                        @click="retroceder()"
                                        type="warning">
                                        Atras
                                    </base-button>
                                    </div>
                            </div>
                        </template>
                    </card>
                </div>
</template>
<script>
const ESTADOS = [
    { estado: 'SIN_LEER', descripcion: 'NO LEIDO'},
    { estado: 'LEIDO', descripcion: 'LEIDO'}
]
export default {
  props:{
      notificacion: {
          type: Object,
          required: true
      }
  },
  components: {
  },
  data() {
      return {
        descripcion: undefined,
        asusto: undefined,
        estados: ESTADOS
      }
  },
  computed: {
  },
  methods: {
      retroceder() {
          console.log('hola')
          this.$emit('retroceder')
      },
      buscarEstado (estadoMensaje) {
        const estado = this.estados.find(function (e){
          return e.estado === estadoMensaje
        })
        return estado.descripcion
      }
  },
  async created () {
      this.descripcion = this.notificacion.descripcion
      this.estado = this.buscarEstado(this.notificacion.estado)
      this.asunto = this.notificacion.asunto
  }

}
</script>