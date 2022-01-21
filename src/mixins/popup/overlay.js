import { removeNode } from '@/helpers/dom/node'
import { mount } from '@/helpers/functional'
import { Overlay } from '../../components/overlay'
import { context } from './context'

const defaultConfig = {
  className: '',
  customStyle: {}
}

function mountOverlay (vm) {
  return mount(Overlay, {
    on: {
      click () {
        vm.$emit('click-overlay')
        if (vm.closeOnClickOverlay) {
          if (vm.onClickOverlay) {
            vm.onClickOverlay()
          } else {
            vm.close()
          }
        }
      }
    }
  })
}

export function updateOverlay (vm) {
  const item = context.find(vm)

  if (item) {
    const el = vm.$el
    const { config, overlay } = item
    if (el && el.parentNode) {
      el.parentNode.insertBefore(overlay.$el, el)
    }
    Object.assign(overlay, defaultConfig, config, { show: true })
  }
}

export function openOverlay (vm, config) {
  const item = context.find(vm)
  if (item) {
    item.config = config
  } else {
    const overlay = mountOverlay(vm)
    context.stack.push({ vm, config, overlay })
  }
  updateOverlay(vm)
}

export function closeOverlay (vm) {
  const item = context.find(vm)
  if (item) {
    item.overlay.show = false
  }
}

export function removeOverlay (vm) {
  const item = context.find(vm)
  if (item) {
    removeNode(item.overlay.$el)
    context.remove(vm)
  }
}
