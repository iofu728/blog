// 极简 v-ripple(Vuetify 1 语义):按下时在元素内插入 span.ripple__container 播放扩散动画,
// 样式来自冻结的 vendor-vuetify.css 的 _ripples 部分。
function showRipple(el, event) {
  const rect = el.getBoundingClientRect()
  const diameter = Math.max(rect.width, rect.height) * 2
  const x = (event.clientX || rect.left + rect.width / 2) - rect.left - diameter / 2
  const y = (event.clientY || rect.top + rect.height / 2) - rect.top - diameter / 2

  const container = document.createElement('span')
  container.className = 'ripple__container'
  const animation = document.createElement('span')
  animation.className = 'ripple__animation ripple__animation--enter'
  animation.style.width = `${diameter}px`
  animation.style.height = `${diameter}px`
  animation.style.transform = `translate(${x}px, ${y}px) scale(0)`
  container.appendChild(animation)
  el.appendChild(container)

  requestAnimationFrame(() => {
    animation.classList.remove('ripple__animation--enter')
    animation.classList.add('ripple__animation--visible')
    animation.style.transform = `translate(${x}px, ${y}px) scale(1)`
  })

  const clear = () => {
    animation.classList.remove('ripple__animation--visible')
    setTimeout(() => container.remove(), 400)
    el.removeEventListener('pointerup', clear)
    el.removeEventListener('pointerleave', clear)
  }
  el.addEventListener('pointerup', clear)
  el.addEventListener('pointerleave', clear)
}

export default {
  mounted(el) {
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
    }
    el._rippleHandler = e => showRipple(el, e)
    el.addEventListener('pointerdown', el._rippleHandler)
  },
  unmounted(el) {
    el.removeEventListener('pointerdown', el._rippleHandler)
  }
}
