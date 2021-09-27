export function getRect (el) {
  return {
    top: el.offsetTop,
    left: el.offsetLeft,
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

const overflowScrollReg = /scroll|auto/i
export function getScroller (el, root = window) {
  let node = el

  while (
    node &&
    node.tagName !== 'HTML' &&
    node.tagName !== 'BODY' &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflowY)) {
      return node
    }
    node = node.parentNode
  }

  return root
}

export function getScrollTop (el) {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0)
}

export function isHidden (el) {
  const style = window.getComputedStyle(el)
  const hidden = style.display === 'none'

  // offsetParent returns null in the following situations:
  // 1. The element or its parent element has the display property set to none.
  // 2. The element has the position property set to fixed
  const parentHidden = el.offsetParent === null && style.position !== 'fixed'

  return hidden || parentHidden
}
