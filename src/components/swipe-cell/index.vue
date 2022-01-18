<script>
import { TouchMixin } from '@/mixins/touch'
import { preventDefault } from '@/helpers/event'
import { range } from '@/helpers/format/number'
import { ClickOutsideMixin } from '@/mixins/click-outside'

const THRESHOLD = 0.15
export default {
  mixins: [
    TouchMixin,
    ClickOutsideMixin({
      event: 'touchstart',
      method: 'onClick'
    })
  ],
  props: {
    onClose: Function,
    disabled: Boolean,
    leftWidth: [Number, String],
    rightWidth: [Number, String],
    beforeClose: Function,
    stopPropagation: Boolean,
    name: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      offset: 0,
      dragging: false
    }
  },
  mounted () {
    this.bindTouchEvent(this.$el)
  },
  computed: {
    computedLeftWidth () {
      return +this.leftWidth || this.getWidthByRef('left')
    },

    computedRightWidth () {
      return +this.rightWidth || this.getWidthByRef('right')
    }
  },
  methods: {
    getWidthByRef (ref) {
      if (this.$refs[ref]) {
        const rect = this.$refs[ref].getBoundingClientRect()
        return rect.width
      }

      return 0
    },
    onClick (position = 'outside') {
      this.$emit('click', position)

      if (this.opened && !this.lockClick) {
        if (this.beforeClose) {
          this.beforeClose({
            position,
            name: this.name,
            instance: this
          })
        } else if (this.onClose) {
          this.onClose(position, this, { name: this.name })
        } else {
          this.close(position)
        }
      }
    },
    getClickHandler (position, stop) {
      return (event) => {
        if (stop) {
          event.stopPropagation()
        }
        this.onClick(position)
      }
    },
    genLeftPart () {
      const content = this.$slots.left
      if (content) {
        return (
          <div
            ref="left"
             class="swipe-cell__left"
            onClick={this.getClickHandler('left', true)}
            >
            {content}
          </div>
        )
      }
    },
    genRightPart () {
      const content = this.$slots.right
      if (content) {
        return (
          <div
            ref="right"
            class="swipe-cell__right"
            onClick={this.getClickHandler('right', true)}
            >
            {content}
          </div>
        )
      }
    },
    onTouchStart (event) {
      if (this.disabled) {
        return
      }

      this.startOffset = this.offset
      this.touchStart(event)
    },
    onTouchMove (event) {
      if (this.disabled) {
        return
      }
      this.touchMove(event)
      if (this.direction === 'horizontal') {
        this.dragging = true
        this.lockClick = true
        const isPrevent = !this.opened || this.deltaX * this.startOffset < 0

        if (isPrevent) {
          preventDefault(event, this.stopPropagation)
        }
        this.offset = range(
          this.deltaX + this.startOffset,
          -this.computedRightWidth,
          this.computedLeftWidth
        )
      }
    },
    onTouchEnd (event) {
      if (this.disabled) {
        return
      }
      if (this.dragging) {
        this.toggle(this.offset > 0 ? 'left' : 'right')
        this.dragging = false
        setTimeout(() => {
          this.lockClick = false
        }, 0)
      }
    },
    toggle (direction) {
      const offset = Math.abs(this.offset)
      const threshold = this.opened ? 1 - THRESHOLD : THRESHOLD
      const { computedLeftWidth, computedRightWidth } = this
      if (computedRightWidth &&
        direction === 'right' &&
        offset > computedRightWidth * threshold
      ) {
        this.open('right')
      } else if (
        computedLeftWidth &&
        direction === 'left' &&
        offset > computedLeftWidth * threshold
      ) {
        this.open('left')
      } else {
        this.close(direction)
      }
    },
    open (position) {
      const offset =
        position === 'left' ? this.computedLeftWidth : -this.computedRightWidth
      this.opened = true
      this.offset = offset
    },
    close (position) {
      this.offset = 0

      if (this.opened) {
        this.opened = false
        this.$emit('close', {
          position,
          name: this.name
        })
      }
    }
  },
  render () {
    const wrapperStyle = {
      transform: `translate3d(${this.offset}px, 0, 0)`,
      transitionDuration: this.dragging ? '0s' : '0.6s'
    }
    return (
      <div class="swipe-cell" onClick={this.getClickHandler('cell')}>
        <div class="swipe-cell__wrapper" style={wrapperStyle}>
          {this.genLeftPart()}
          {this.$slots.default}
          {this.genRightPart()}
        </div>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.swipe-cell {
  position: relative;
  overflow: hidden;
  cursor: grab;
  &__wrapper {
    transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1);
    transition-property: transform;
  }

  &__left,
  &__right {
    position: absolute;
    top: 0;
    height: 100%;
  }

  &__left {
    left: 0;
    transform: translate3d(-100%, 0, 0);
  }

  &__right {
    right: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
