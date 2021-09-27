<template>
    <pull-change :disabled="disabled">
        <van-list
          v-bind="$attrs"
          v-on="$listeners"
        >
        <van-cell v-for="item in data" :key="item" :title="item" />
        </van-list>
    </pull-change>
</template>

<script>
import Vue from 'vue'
import { List, Cell } from 'vant'
import PullChange from '@/components/pull-change/index'

Vue.use(List)
Vue.use(Cell)

export default {
  name: 'list',
  components: {
    PullChange
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {

    }
  },
  computed: {
    disabled () {
      return !this.finished
    }
  },
  methods: {
    onLoad () {
      this.$emit('load')
    }
  }
}
</script>

<style lang='scss'>

</style>
