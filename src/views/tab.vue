<template>
  <div class="tab">
    <header>666</header>
    <section>
      <div class="content">
        <div class="other"></div>
        <div class="list-wrap">
          <ul class="tab-wrap">
            <li
              :class="{ active: index === current }"
              v-for="(item, index) in list"
              :key="index"
              @click="tabChange(index)"
            >
              {{ item.name }}
            </li>
          </ul>
          <van-swipe
            ref="swipeRef"
            @change="onChange"
            :loop="false"
            class="my-swipe"
            indicator-color="white"
          >
            <van-swipe-item v-for="(item, index) in list" :key="index">
              <list
                v-model="item.loading"
                :finished="item.finished"
                @load="load"
                :data="item.list"
              ></list>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </section>
    <footer></footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import { Swipe, SwipeItem } from 'vant'
import List from '@/components/list/list.vue'
Vue.use(Swipe)
Vue.use(SwipeItem)
const dataTab = [
  {
    name: '特价',
    finished: false,
    loading: false,
    list: [],
    pos: 0
  },
  {
    name: '换购',
    finished: false,
    loading: false,
    list: [],
    pos: 0
  },
  {
    name: '套餐',
    finished: false,
    loading: false,
    list: [],
    pos: 0
  },
  {
    name: '拼团',
    finished: false,
    loading: false,
    list: [],
    pos: 0
  }
]
export default {
  name: 'Tab',
  components: {
    List
  },
  data () {
    return {
      list: [],
      current: 0
    }
  },
  created () {
    this.list = dataTab
    this.list.forEach((item) => {
      for (let i = 0; i < 10; i++) {
        item.list.push(item.list.length + 1 + item.name)
      }
    })
  },
  methods: {
    load () {
      const currentList = this.list[this.current]
      console.log(currentList)
      setTimeout(() => {
        if (currentList.finished === true) return

        for (let i = 0; i < 10; i++) {
          currentList.list.push(currentList.list.length + 1 + currentList.name)
        }

        // 加载状态结束
        currentList.loading = false

        // 数据全部加载完成
        if (currentList.list.length >= 40) {
          currentList.finished = true
        }
      }, 1000)
    },
    tabChange (index) {
      this.current = index
      this.$refs.swipeRef.swipeTo(index)
    },
    onChange (index) {
      this.current = index
    }
  }
}
</script>
<style lang="scss" scoped>
.tab {
  height: 100vh;
  display: flex;
  flex-direction: column;
  header {
    height: 60px;
    background: black;
  }
  section {
    flex: 1;
    overflow: scroll;
    .other {
      height: 500px;
      background: blue;
    }
    .list-wrap {
      height: calc(100vh - 120px);
      li {
        width: 25%;
        text-align: center;
      }
      .active {
        color: red;
      }
      .tab-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
      }
      .my-swipe {
        height: calc(100% - 50px);
        overflow-y: scroll;
      }
    }
  }

  footer {
    height: 60px;
    background: black;
  }
}
</style>
