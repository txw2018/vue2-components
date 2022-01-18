<template>
  <popup v-model="show"></popup>
</template>
<script>
import Popup from '../index.vue'
export default {
  components: {
    Popup
  },
  data () {
    return {
      show: true
    }
  }
}
</script>
