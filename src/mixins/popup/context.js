export const context = {
  zIndex: 2000,
  lockCount: 0,
  stack: [],
  find (vm) {
    return this.stack.filter(item => item.vm === vm)[0]
  },
  remove: function remove (vm) {
    const item = this.find(vm)
    if (!item) return
    item.vm = null
    item.overlay = null
    const index = this.stack.indexOf(item)
    this.stack.splice(index, 1)
  }
}
