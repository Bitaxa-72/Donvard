const cartFlyDuration = 700

const getCenter = (rect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2
})

const getFlySource = (trigger) => {
  const scope = trigger.closest(
    '[data-cart-fly-scope], .category__product-card, .productHero, article, section'
  )

  return (
    scope?.querySelector('.productHero__slider .swiper-slide-active img') ||
    scope?.querySelector('[data-cart-fly-img]') ||
    scope?.querySelector('.product__img') ||
    scope?.querySelector('.productHero__image') ||
    trigger.querySelector('img') ||
    trigger.querySelector('svg')
  )
}

const createFlyItem = (source, sourceRect) => {
  const sourceTag = source?.tagName.toLowerCase()

  if (sourceTag === 'img') {
    const item = document.createElement('img')

    item.className = 'cartFly__item'
    item.src = source.currentSrc || source.src
    item.alt = ''

    return item
  }

  const item = document.createElement('span')

  item.className = 'cartFly__item cartFly__item--dot'
  item.style.width = `${Math.min(sourceRect.width, 24)}px`
  item.style.height = item.style.width

  return item
}

const animateToCart = (trigger, target) => {
  const source = getFlySource(trigger)
  const sourceRect = (source || trigger).getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const startCenter = getCenter(sourceRect)
  const endCenter = getCenter(targetRect)
  const flyItem = createFlyItem(source, sourceRect)
  const startWidth = Math.min(Math.max(sourceRect.width, 24), 120)
  const ratio = sourceRect.height / sourceRect.width || 1
  const startHeight = Math.min(Math.max(startWidth * ratio, 24), 120)

  flyItem.style.width = `${startWidth}px`
  flyItem.style.height = `${startHeight}px`
  flyItem.style.left = `${startCenter.x - startWidth / 2}px`
  flyItem.style.top = `${startCenter.y - startHeight / 2}px`

  document.body.append(flyItem)

  const deltaX = endCenter.x - startCenter.x
  const deltaY = endCenter.y - startCenter.y

  const animation = flyItem.animate(
    [
      {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)'
      },
      {
        opacity: 0.15,
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.18)`
      }
    ],
    {
      duration: cartFlyDuration,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    }
  )

  animation.addEventListener('finish', () => {
    flyItem.remove()
    target.classList.add('cartFly__target--pulse')
  })

  target.addEventListener(
    'animationend',
    () => {
      target.classList.remove('cartFly__target--pulse')
    },
    { once: true }
  )
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-cart-fly]')

  if (!trigger) {
    return
  }

  const target = document.querySelector('[data-cart-target]')

  if (!target) {
    return
  }

  animateToCart(trigger, target)
})
