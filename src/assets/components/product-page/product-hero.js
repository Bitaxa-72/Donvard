import Swiper from 'swiper'
import { Autoplay, Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'

document
  .querySelectorAll('.productHero__gallery')
  .forEach((gallery) => {
    const thumbs = new Swiper(
      gallery.querySelector('.productHero__thumbs'),
      {
        modules: [Navigation],
        loop: true,
        slidesPerView: 3,
        spaceBetween: 34,
        watchSlidesProgress: true
      }
    )

    new Swiper(
      gallery.querySelector('.productHero__slider'),
      {
        modules: [Autoplay, Navigation, Thumbs],
        loop: true,
        slidesPerView: 1,
        autoplay: {
          delay: 6000
        },
        navigation: {
          prevEl: gallery.querySelector(
            '.productHero__arrow--prev'
          ),
          nextEl: gallery.querySelector(
            '.productHero__arrow--next'
          )
        },
        thumbs: {
          swiper: thumbs
        }
      }
    )
  })

document.querySelectorAll('.productHero__descr').forEach((descr) => {
  const button = descr.querySelector('.productHero__more')
  const text = descr.querySelector('.productHero__descr-text')

  const updateButtonVisibility = () => {
    if (!button || !text) {
      return
    }

    const isOpen = descr.classList.contains('productHero__descr--open')

    if (isOpen) {
      descr.classList.remove('productHero__descr--open')
    }

    const isOverflowing = text.scrollHeight > text.clientHeight + 1

    if (isOpen) {
      descr.classList.add('productHero__descr--open')
    }

    button.classList.toggle('productHero__more--hidden', !isOverflowing)
  }

  button?.addEventListener('click', () => {
    const isOpen = descr.classList.toggle('productHero__descr--open')

    button.textContent = isOpen ? 'Свернуть' : 'Подробнее'
  })

  requestAnimationFrame(updateButtonVisibility)
  window.addEventListener('resize', updateButtonVisibility)
})

document
  .querySelectorAll('.productHero__specification')
  .forEach((specification) => {
    const button = specification.querySelector(
      '.productHero__specification-more'
    )
    const items = specification.querySelectorAll(
      '[data-productHero-specification-item]'
    )

    if (!button) {
      return
    }

    const updateItemsVisibility = () => {
      const isOpen = specification.classList.contains(
        'productHero__specification--open'
      )

      items.forEach((item, index) => {
        item.classList.toggle(
          'productHero__specification-item--hidden',
          !isOpen && index >= 5
        )
      })
    }

    button.classList.toggle('productHero__more--hidden', items.length <= 5)

    updateItemsVisibility()

    button.addEventListener('click', () => {
      const isOpen = specification.classList.toggle(
        'productHero__specification--open'
      )

      button.textContent = isOpen ? 'Свернуть' : 'Все характеристики'
      updateItemsVisibility()
    })
})
