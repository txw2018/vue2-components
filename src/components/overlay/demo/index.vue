<template>

<div style="width: 100vw; height: 100vh;">
    <button  @click="show = true">显示遮罩层</button>
  <Overlay :show="show" @click="show = false"></Overlay>
  <ul> <li v-for=" i in 50" :key="i">{{i}}</li></ul>
</div>
</template>
<script>
import Overlay from '../index.vue'
export default {
  name: 'OverlayDemo',
  components: { Overlay },
  data () {
    return {
      show: false
    }
  },
  methods: {

  }
}
</script>
