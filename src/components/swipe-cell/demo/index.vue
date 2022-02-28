<template>
    <div>
        <SwipeCell>
            <template #left>
                <div style="background-color: red;">左边左边</div>
            </template>
            <div>向左右滑动</div>
            <template #right>
                <div style="background-color: red;">右边右边</div>
            </template>
        </SwipeCell>
    </div>
</template>
<script>
import SwipeCell from '../index.vue'
export default {
  name: 'SwipeCellDemo',
  components: {
    SwipeCell
  }
}
</script>
<style lang="scss" scoped>
div{
    height: 50px;
}</style>
