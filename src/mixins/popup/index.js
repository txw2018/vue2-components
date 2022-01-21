import { getScroller } from '@/helpers/dom'
import { removeNode } from '@/helpers/dom/node'
import { off, on, preventDefault } from '@/helpers/event'
import { TouchMixin } from '../touch'
import { context } from './context'
import {
  openOverlay,
  closeOverlay,
  updateOverlay,
  removeOverlay
} from './overlay'
export const popupMixinProps = {
  // Initial rendering animation
  transitionAppear: Boolean,
  // whether to show popup
  value: Boolean,
  // whether to show overlay
  overlay: Boolean,
  // overlay custom style
  overlayStyle: Object,
  // overlay custom class name
  overlayClass: String,
  // whether to close popup when overlay is clicked
  closeOnClickOverlay: Boolean,
  // z-index
  zIndex: [Number, String],
  // prevent body scroll
  lockScroll: {
    type: Boolean,
    default: true
  },
  // whether to lazy render
  lazyRender: {
    type: Boolean,
    default: true
  }
}
export function PopupMixin (options = {}) {
  return {
    mixins: [
      TouchMixin
    ],
    provide () {
      return {
        vanPopup: this
      }
    },
    props: popupMixinProps,
    data () {
      this.onReopenCallback = []
      return {
        inited: this.value
      }
    },

    computed: {
      shouldRender () {
        return this.inited || !this.lazyRender
      }
    },
    watch: {
      value (val) {
        const type = val ? 'open' : 'close'
        this.inited = this.inited || this.value
        this[type]()

        if (!options.skipToggleEvent) {
          this.$emit(type)
        }
      },

      overlay: 'renderOverlay'
    },
    mounted () {
      if (this.value) {
        this.open()
      }
    },
    activated () {
      if (this.shouldReopen) {
        this.$emit('input', true)
        this.shouldReopen = false
      }
    },
    beforeDestroy () {
      removeOverlay(this)

      if (this.opened) {
        this.removeLock()
      }

      if (this.getContainer) {
        removeNode(this.$el)
      }
    },
    /* istanbul ignore next */
    deactivated () {
      if (this.value) {
        this.close()
        this.shouldReopen = true
      }
    },
    methods: {
      open () {
        if (this.opened) {
          return
        }

        if (!this.zIndex !== undefined) {
          context.zIndex = this.zIndex
        }

        this.opened = true
        this.renderOverlay()
        this.addLock()
        this.onReopenCallback.forEach(callback => {
          callback()
        })
      },
      addLock () {
        if (this.lockScroll) {
          on(document, 'touchstart', this.touchStart)
          on(document, 'touchmove', this.touchMove)

          if (!context.lockCount) {
            document.body.classList.add('overflow-hidden')
          }
          context.lockCount++
        }
      },
      removeLock () {
        if (this.lockScroll && context.lockCount) {
          context.lockCount--
          off(document, 'touchstart', this.touchStart)
          off(document, 'touchmove', this.touchMove)
          if (!context.lockCount) {
            document.body.classList.remove('overflow-hidden')
          }
        }
      },
      close () {
        if (!this.opened) {
          return
        }
        closeOverlay(this)
        this.opened = false
        this.removeLock()
        this.$emit('input', false)
      },
      onTouchMove (event) {
        this.touchMove(event)
        const direction = this.deltaY > 0 ? '10' : '01'
        const el = getScroller(event.target, this.$el)
        const { scrollHeight, offsetHeight, scrollTop } = el
        let status = '11'

        if (scrollTop === 0) {
          status = offsetHeight >= scrollHeight ? '00' : '01'
        } else if (scrollTop + offsetHeight >= scrollHeight) {
          status = '10'
        }

        if (
          status !== '11' &&
          this.direction === 'vertical' &&
          !(parseInt(status, 2) & parseInt(direction, 2))
        ) {
          preventDefault(event, true)
        }
      },
      renderOverlay () {
        if (!this.value) {
          return
        }
        this.$nextTick(() => {
          this.updateZIndex(this.overlay ? 1 : 0)
          if (this.overlay) {
            openOverlay(this, {
              zIndex: context.zIndex++,
              duration: this.duration,
              className: this.overlayClass,
              customStyle: this.overlayStyle
            })
          } else {
            closeOverlay(this)
          }
        })
      },
      updateZIndex (value = 0) {
        this.$el.style.zIndex = ++context.zIndex + value
      },
      onReopen (callback) {
        this.onReopenCallback.push(callback)
      }
    }
  }
}
