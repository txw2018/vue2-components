import { TouchMixin } from '../touch'
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
    }
  }
}
