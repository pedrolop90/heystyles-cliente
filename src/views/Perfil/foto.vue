<template>
    <div class="clearfix">
        <b-img v-bind="foto" fluid-grow rounded="circle" right/>
    </div>
</template>
<script>
export default {
  props: [ 'imagen', 'extension' ],
  components: {},
  data() {
      return {
          foto: {
              src: this.imagen,
              blankColor: '#777',
              width: 75,
              height: 75,
              class: 'm1'
          }
      }
  }
}
</script>