
import { TouchMixin } from '@/mixins/touch'
import { on, off, preventDefault } from '@/helpers/event'
import { getScroller, isHidden } from '@/helpers/dom'
import './index.scss'

const OFFSET_HEIGHT = 50
export default {
  name: 'pull-change',
  mixins: [TouchMixin],

  props: {
    offset: {
      type: [Number, String],
      default: OFFSET_HEIGHT
    },
    disabled: {
      type: Boolean,
      default: true
    },
    animationDuration: {
      type: [Number, String],
      default: 300
    },
    data: {
      type: Array
    }

  },
  data () {
    return {
      duration: 0,
      distance: 0,
      isReachEdge: false
    }
  },
  mounted () {
    if (!this.scroller) {
      this.scroller = getScroller(this.$el)
    }
    this.bindEvent()
    this.bindTouchEvent(this.$refs.track)
    const node = this.$refs.bottom
    this.observer = new IntersectionObserver(this.insideViewportCb)
    this.observer.observe(node)
  },
  activatedk () {
    this.bindEvent()
  },
  deactivated () {
    this.unBindEvent()
  },
  beforeDestory () {
    this.unBindEvent()
  },
  watch: {
    data () {
      this.setStatus(0)
    }
  },
  methods: {
    insideViewportCb (entries) {
      entries.forEach(element => {
        // 在viewport里面
        if (element.intersectionRatio > 0) {
          console.log(123)
          this.isReachEdge = true
        } else {
          this.isReachEdge = false
        }
      })
    },
    check () {
      // this.$nextTick(() => {
      //   if (this.disabled || !this.$refs.bottom) return
      //   const { $el: el, scroller } = this
      //   let scrollerRect
      //   if (scroller.getBoundingClientRect) {
      //     scrollerRect = scroller.getBoundingClientRect()
      //   } else {
      //     scrollerRect = {
      //       top: 0,
      //       bottom: scroller.innerHeight
      //     }
      //   }
      //   const scrollerHeight = scrollerRect.bottom - scrollerRect.top

      //   if (!scrollerHeight || isHidden(el)) {
      //     return false
      //   }
      //   const bottomRect = this.$refs.bottom.getBoundingClientRect()

      //   this.isReachEdge = bottomRect.bottom === scrollerRect.bottom
      // })
    },
    ease (distance) {
      const pullDistance = this.offset

      if (distance > pullDistance) {
        if (distance < pullDistance * 2) {
          distance = pullDistance + (distance - pullDistance) / 2
        } else {
          distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4
        }
      }

      return Math.round(distance)
    },
    setStatus (distance) {
      this.distance = distance
      console.log(distance, this.offset)
      this.status = distance < this.offset
        ? 'pulling'
        : 'loosing'
    },
    checkPullStart (event) {
      if (this.isReachEdge) {
        this.duration = 0
        this.touchStart(event)
      }
    },
    onTouchStart (event) {
      if (!this.disabled) {
        this.checkPullStart(event)
      }
    },
    onTouchMove (event) {
      if (this.disabled) {
        return
      }

      if (!this.isReachEdge) {
        this.checkPullStart(event)
      }

      this.touchMove(event)
      if (this.isReachEdge && !this.disabled && this.deltaY <= 0 && this.direction === 'vertical') {
        preventDefault(event)

        this.setStatus(this.ease(-this.deltaY))

        this.$nextTick(() => {
          this.$emit('update', this.status === 'loosing')
        })
      }
    },
    onTouchEnd (event) {
      if (!this.disabled && this.isReachEdge && this.deltaY) {
        this.duration = this.animationDuration
        console.log(this.status)
        if (this.status === 'loosing') {
          this.setStatus(0)
          // ensure value change can be watched
          this.$nextTick(() => {
            this.$emit('update', false)
            this.$emit('refresh')
          })
        } else {
          this.setStatus(0)
        }
      }
    },
    bindEvent () {
      on(this.scroller, 'scroll', this.check)
    },
    unBindEvent () {
      off(this.scroller, 'scroll')
    },
    genStatus () {
      return <div>{this.status === 'loosing' ? '松开切换' : '继续上拉'}</div>
    },
    genBottom () {
      if (!this.disabled) {
        return <div ref='bottom' class="bottom"></div>
      }
    }
  },
  render () {
    const trackStyle = {
      transitionDuration: `${this.duration}ms`,
      transform: this.distance ? `translate3d(0,${-this.distance}px, 0)` : ''
    }
    return (
      <div class="wrapper">
        <div ref='track' class='track' style={trackStyle}>
          {this.$slots.default}
          {/* {this.genBottom()} */}
          <div ref='bottom' class="bottom"></div>
        </div>
      </div>
    )
  }
}
