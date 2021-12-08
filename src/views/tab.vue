<template>
  <div class="tab">
    <header>666</header>
    <section ref="scrollRef">
      <div class="content" >
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
         <div class="other"></div>
          <div class="list-wrap">
            <van-sticky :offset-top="60">
              <ul class="tab-wrap">
                <li
                  :class="{ active: index === currentIndex }"
                  v-for="(item, index) in list"
                  :key="index"
                  @click="tabChange(index)"
                >{{ item.name }}</li>
              </ul>
            </van-sticky>
         <PullChange :disabled="disabled"  @refresh="nextTab">

            <van-list v-model="currentList.loading" :finished="currentList.finished" :finished-text="currentList.finishedText" @load="onLoad">
              <van-cell v-for="item in currentList.list" :key="item" :title="item" />
            </van-list>
         </PullChange>

          </div>
        </van-pull-refresh>
      </div>
    </section>
    <footer></footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import PullChange from '@/components/pull-change/index'
import { PullRefresh, Toast, List, Cell, Sticky } from 'vant'
import { on, off } from '@/helpers/event'

Vue.use(PullRefresh)
Vue.use(Toast)
Vue.use(List)
Vue.use(Cell)
Vue.use(Sticky)
const dataTab = [
  {
    name: '特价',
    finished: false,
    loading: false,
    list: [],
    finishedText: '继续上拉切换下一个促销场次',
    pos: 0
  },
  {
    name: '换购',
    finished: false,
    loading: false,
    list: [],
    finishedText: '继续上拉切换下一个促销场次',
    pos: 0
  },
  {
    name: '套餐',
    finished: false,
    loading: false,
    list: [],
    finishedText: '继续上拉切换下一个促销场次',
    pos: 0
  },
  {
    name: '拼团',
    finished: false,
    loading: false,
    list: [],
    finishedText: '没有更多商品了',
    pos: 0
  }
]
export default {
  name: 'Tab',
  components: {
    PullChange
  },
  data () {
    return {
      list: [],
      currentIndex: 0,
      count: 0,
      isLoading: false,
      loading: false,
      finished: false,
      scrollY: 0
    }
  },
  created () {
    this.list = dataTab
    this.list.forEach((item) => {
      for (let i = 0; i < 20; i++) {
        item.list.push(item.list.length + 1 + item.name)
      }
    })
  },
  mounted () {
    this.scroller = this.$refs.scrollRef
    this.bindEvent()
  },
  watch: {
    currentIndex (newTab, oldTab) {
      this.list[oldTab].pos = this.scrollY // 储存旧的scrollY
      // const memoryPos = this.tabProductData[newTab].pos
      // let keyPos
      // if (this.scrollY >= offsetTop) {
      //   keyPos = Math.max(memoryPos, offsetTop)
      // } else {
      //   keyPos = this.scrollY
      // }
    }
  },
  computed: {
    currentList () {
      return this.list[this.currentIndex]
    },
    disabled () {
      return !this.currentList.finished
    }
  },
  methods: {
    scrollFn () {
      // console.log(this.scroller.scrollTop)
    },
    bindEvent () {
      console.log(this.scroller)
      on(this.scroller, 'scroll', this.scrollFn)
    },
    unBindEvent () {
      off(this.scroller, 'scroll')
    },
    onRefresh () {
      setTimeout(() => {
        Toast('刷新成功')
        this.isLoading = false
        this.count++
      }, 1000)
    },
    onLoad () {
      const currentList = this.list[this.currentIndex]
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
    nextTab () {

    },
    tabChange (index) {
      this.currentIndex = index
    },
    onChange (index) {
      this.currentIndex = index
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
      height: 300px;
      background: blue;
    }
    .list-wrap {
      li {
        width: 25%;
        text-align: center;
      }
      .active {
        color: red;
      }
      .tab-wrap {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
      }
    }
  }

  footer {
    height: 60px;
    background: black;
  }
}
</style>
