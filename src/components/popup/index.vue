<script>
import { isDef } from '@/helpers/util'
export default {
  name: 'Popup',
  props: {
    round: Boolean,
    duration: [Number, String],
    closeable: Boolean,
    transition: String,
    safeAreaInsetBottom: Boolean,
    closeIcon: {
      type: String,
      default: 'cross'
    },
    closeIconPosition: {
      type: String,
      default: 'top-right'
    },
    position: {
      type: String,
      default: 'center'
    },
    overlay: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    }
  },
  render () {
    const { round, position, duration } = this
    const isCenter = position === 'center'

    const transitionName =
            this.transition ||
            (isCenter ? 'fade' : `popup-slide-${position}`)

    const style = {}
    if (isDef(duration)) {
      const key = isCenter ? 'animationDuration' : 'transitionDuration'
      style[key] = `${duration}s`
    }

    return (
            <transition
                appear={this.transitionAppear}
                name={transitionName}
                onAfterEnter={this.onOpened}
                onAfterLeave={this.onClosed}
            >
              <div
                vShow={this.value}
                style={style}
                class={{
                  round,
                  [position]: position,
                  'safe-area-inset-bottom': this.safeAreaInsetBottom
                }}
              >
              </div>
            </transition>
    )
  }
}
</script>
