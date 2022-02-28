<template>
   <div>
    <tab-list v-model="data"></tab-list>
   </div>

</template>
<script>
import TabList from '@/components/tab-list'
import List from './list'
export default {
  name: 'tab-list-demo',
  components: {

    TabList
  },
  data () {
    return {
      data: List
    }
  },
  created () {
    console.log(List)
  }

}
</script>
<style>

</style>
