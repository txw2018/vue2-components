<script>
import { isDef, noop } from '@/helpers/util'
import { preventDefault } from '@/helpers/event'
import { inherit } from '@/helpers/functional'

function preventTouchMove (event) {
  preventDefault(event, true)
}
export default {
  name: 'Overlay',
  functional: true,
  props: {
    show: Boolean,
    zIndex: [Number, String],
    duration: [Number, String],
    className: null,
    customStyle: Object,
    lockScroll: {
      type: Boolean,
      default: true
    }
  },
  render (h, context) {
    console.log(context)
    const style = {
      zIndex: context.props.zIndex,
      ...context.props.customStyle
    }
    if (isDef(context.props.duration)) {
      style.animationDuration = `${context.props.duration}s`
    }
    return (
        <transition name="fade">
            <div
            vShow={context.props.show}
            style={style}
            class={`overlay ${context.props.className}`}
            onTouchmove={context.props.lockScroll ? preventTouchMove : noop}
            {...inherit(context, true)}
            >
            {context.slots.default}
            </div>
        </transition>
    )
  }
}
</script>
<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);

}
</style>
