import Vue from 'vue'

const inheritKey = [
  'ref',
  'key',
  'style',
  'class',
  'attrs',
  'refInFor',
  'nativeOn',
  'directives',
  'staticClass',
  'staticStyle'
]
const mapInheritKey = { nativeOn: 'on' }
export function inherit (
  context,
  inheritListeners
) {
  console.log(context)
  const result = inheritKey.reduce((obj, key) => {
    if (context.data[key]) {
      obj[mapInheritKey[key] || key] = context.data[key]
    }
    return obj
  }, {})

  if (inheritListeners) {
    result.on = result.on || {}
    Object.assign(result.on, context.data.on)
  }

  return result
}

export function mount (Component, data) {
  const instance = new Vue({
    el: document.createElement('div'),
    props: Component.props,
    render (h) {
      return h(Component, {
        props: this.$props,
        ...data
      })
    }
  })
  document.body.appendChild(instance.$el)
  return instance
}
