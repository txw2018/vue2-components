<script>
export default {
  name: 'form',
  provide () {
    return {
      vanForm: this
    }
  },

  data () {
    return {
      fields: []
    }
  }

}
</script>
