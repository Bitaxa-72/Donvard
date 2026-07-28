const categoryToggles = document.querySelectorAll(
  '.catalog__category-toggle'
)

categoryToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const category = toggle.closest('.catalog__category')
    const subcategories = category?.querySelector(
      '.catalog__subcategories'
    )
    const isOpen = category?.classList.toggle(
      'catalog__category--open'
    )

    subcategories?.classList.toggle(
      'catalog__subcategories--active',
      isOpen
    )
    toggle.setAttribute('aria-expanded', String(isOpen))
  })
})

const tabButtons = document.querySelectorAll(
  '.catalog:not(.catalog--category) .catalog__tubs-btn'
)
const catalogSections = document.querySelectorAll(
  '.catalog:not(.catalog--category) .catalog__section'
)
const catalogTabStorageKey = 'catalog-active-tab'

const setActiveTab = (activeIndex) => {
  tabButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === activeIndex

    button.classList.toggle(
      'catalog__tubs-btn-blue',
      isActive
    )
    button.setAttribute('aria-pressed', String(isActive))
  })

  catalogSections.forEach((section, sectionIndex) => {
    section.classList.toggle(
      'catalog__section--active',
      sectionIndex === activeIndex
    )
  })
}

const savedTabIndex = Number(
  window.localStorage.getItem(catalogTabStorageKey)
)

if (
  Number.isInteger(savedTabIndex) &&
  savedTabIndex >= 0 &&
  savedTabIndex < tabButtons.length
) {
  setActiveTab(savedTabIndex)
}

tabButtons.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    setActiveTab(index)
    window.localStorage.setItem(
      catalogTabStorageKey,
      String(index)
    )
  })
})
