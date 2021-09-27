<template>
  <div ref="wrapper" class="scroll-wrapper">
    <div class="scroll-content">
      <div ref="listWrapper" class="scroll-list-wrapper">
         <slot>
           <ul class="scroll-list">
            <li
              class="scroll-item border-bottom-1px"
              v-for="(item, index) in data"
              :key="index"
              @click="clickItem(item)">{{item}}
            </li>
          </ul>
         </slot>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { USE_TRANSITION } from '@/helpers/constants'
import { getRect } from '@/helpers/dom'
import { camelize } from '@/helpers/util'
BScroll.use(ObserveDOM)

// 滚动方向
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

// 事件名
const EVENT_CLICK = 'click'
const EVENT_PULLING_DOWN = 'pulling-down'
// const EVENT_PULLING_UP = 'pulling-up'

// 滚动事件
const EVENT_SCROLL = 'scroll'
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_BEFORE_SCROLL_START, EVENT_SCROLL_END]

// better-scroll默认配置
const DEFAULT_OPTIONS = {
  observeDOM: true,
  click: true,
  probeType: 1,
  scrollbar: false,
  pullDownRefresh: false,
  pullUpLoad: false
}
export default {
  name: 'scroll',
  provide () {
    return {
      parentScroll: this
    }
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    scrollEvents: {
      type: Array,
      default () {
        return []
      },
      validator (arr) {
        return arr.every((item) => {
          return SCROLL_EVENTS.indexOf(item) !== -1
        })
      }
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      beforePullDown: true,
      isPullingDown: false
    }
  },
  computed: {
    pullDownRefresh () {
      return this.options.pullDownRefresh
    }

  },
  watch: {
    data () {
      setTimeout(() => {
        // this.forceUpdate(true)
      }, this.refreshDelay)
    }
  },
  activated () {
    /* istanbul ignore next */
    this.enable()
  },
  deactivated () {
    /* istanbul ignore next */
    this.disable()
  },
  mounted () {
    this.$nextTick(() => {
      this.initScroll()
    })
  },
  beforeDestroy () {
    this.destroy()
  },
  methods: {
    initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this._calculateMinHeight()
      const dynamicOptions = {
        scrollY: this.direction === DIRECTION_V,
        scrollX: this.direction === DIRECTION_H,
        probeType: this.needListenScroll ? 3 : 1,
        useTransition: USE_TRANSITION
      }
      const options = Object.assign({}, DEFAULT_OPTIONS, dynamicOptions, this.options)

      this.scroll = new BScroll(this.$refs.wrapper, options)
      // 监听滚动事件
      this._listenScrollEvents()

      // 下拉事件
      if (this.pullDownRefresh) {
        this._onPullDownRefresh()
        this._pullDownRefreshChangeHandler()
      }
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    refresh () {
      this._calculateMinHeight()
      this.scroll && this.scroll.refresh()
    },
    destroy () {
      this.scroll && this.scroll.destroy()
      this.scroll = null
    },
    clickItem (item) {
      this.$emit(EVENT_CLICK, item)
    },
    _calculateMinHeight () {
      const { wrapper, listWrapper } = this.$refs
      const pullUpLoad = this.pullUpLoad
      const pullDownRefresh = this.pullDownRefresh
      let minHeight = 0
      if (pullDownRefresh || pullUpLoad) {
        const wrapperHeight = getRect(wrapper).height
        minHeight = wrapperHeight + 1
        if (pullUpLoad && pullUpLoad.visible) {
          // minHeight = wrapperHeight + 1 - pullUpHeight, then pullUpLoad text is visible
          // when content's height is not larger than wrapper height
          minHeight -= this.pullUpHeight
        }
      }
      listWrapper.style.minHeight = `${minHeight}px`
    }
  },
  // 滚动事件
  _listenScrollEvents () {
    if (!this.scrollEvents.length) return
    this.scrollEvents.forEach(event => {
      this.scroll.on(camelize(event), (...args) => {
        this.$emit(event, ...args)
      })
    })
  },
  // 下拉刷新事件
  _onPullDownRefresh () {
    this.scroll.on('pullingDown', this._pullDownHandle)
  },
  _pullDownHandle () {
    this.beforePullDown = false
    this.isPullingDown = true
    this.$emit(EVENT_PULLING_DOWN)
  }
}
</script>

<style lang="scss" scoped>

</style>
