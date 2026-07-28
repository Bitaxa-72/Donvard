document.querySelectorAll('.productInfo').forEach((productInfo) => {
  const buttons = productInfo.querySelectorAll('[data-productInfo-tab]')
  const panels = productInfo.querySelectorAll('[data-productInfo-panel]')

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentTab = button.dataset.productinfoTab

      buttons.forEach((item) => {
        item.classList.toggle('productInfo__btn--active', item === button)
      })

      panels.forEach((panel) => {
        panel.classList.toggle(
          'productInfo__tab--active',
          panel.dataset.productinfoPanel === currentTab
        )
      })
    })
  })
})
