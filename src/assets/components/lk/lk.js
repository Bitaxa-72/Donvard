document.querySelectorAll('.lk').forEach((lk) => {
  const tabs = lk.querySelectorAll('[data-lk-tab]')
  const panels = lk.querySelectorAll('[data-lk-panel]')
  const editButton = lk.querySelector('[data-lk-edit]')
  const saveButton = lk.querySelector('[data-lk-save]')
  const editableValues = lk.querySelectorAll('[data-lk-editable]')
  let editSnapshot = new Map()

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '')

    if (digits.startsWith('8')) {
      digits = `7${digits.slice(1)}`
    }

    if (digits.startsWith('7')) {
      digits = digits.slice(1)
    }

    digits = digits.slice(0, 10)

    const code = digits.slice(0, 3)
    const first = digits.slice(3, 6)
    const second = digits.slice(6, 8)
    const third = digits.slice(8, 10)

    let result = '+7'

    if (code) {
      result += ` (${code}`
    }

    if (code.length === 3) {
      result += ')'
    }

    if (first) {
      result += ` ${first}`
    }

    if (second) {
      result += `-${second}`
    }

    if (third) {
      result += `-${third}`
    }

    return result
  }

  const getInputType = (field) => {
    const label = field
      .closest('.lk__main-item')
      ?.querySelector('.lk__main-label')
      ?.textContent.trim()
      .toLowerCase()

    if (label === 'e-mail') {
      return 'email'
    }

    if (label === 'телефон') {
      return 'tel'
    }

    return 'text'
  }

  const setEditMode = () => {
    if (lk.classList.contains('lk--edit')) {
      return
    }

    lk.classList.add('lk--edit')
    editSnapshot = new Map()

    editableValues.forEach((field) => {
      const input = document.createElement('input')
      const label = field
        .closest('.lk__main-item')
        ?.querySelector('.lk__main-label')
        ?.textContent.trim()
      const inputType = getInputType(field)
      const fieldValue = field.textContent.trim()

      editSnapshot.set(field, fieldValue)

      input.className = 'lk__main-input'
      input.type = inputType
      input.value =
        inputType === 'tel'
          ? formatPhone(fieldValue)
          : fieldValue
      input.setAttribute('aria-label', label || 'Поле профиля')

      if (inputType === 'tel') {
        input.inputMode = 'tel'
        input.addEventListener('input', () => {
          input.value = formatPhone(input.value)
        })
      }

      field.classList.add('lk__main-value--edit')
      field.textContent = ''
      field.append(input)
    })
  }

  const setViewMode = () => {
    lk.classList.remove('lk--edit')

    editableValues.forEach((field) => {
      const input = field.querySelector('.lk__main-input')

      if (!input) {
        return
      }

      field.classList.remove('lk__main-value--edit')
      field.textContent = input.value
    })

    editSnapshot.clear()
  }

  const cancelEditMode = () => {
    lk.classList.remove('lk--edit')

    editableValues.forEach((field) => {
      const input = field.querySelector('.lk__main-input')

      if (!input) {
        return
      }

      field.classList.remove('lk__main-value--edit')
      field.textContent = editSnapshot.get(field) || ''
    })

    editSnapshot.clear()
  }

  editButton?.addEventListener('click', setEditMode)
  saveButton?.addEventListener('click', setViewMode)

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const currentTab = tab.dataset.lkTab

      cancelEditMode()

      tabs.forEach((item) => {
        const isActive = item === tab

        item.classList.toggle('lk__nav-item--active', isActive)
        item.setAttribute('aria-pressed', String(isActive))
      })

      panels.forEach((panel) => {
        panel.classList.toggle(
          'lk__tub--active',
          panel.dataset.lkPanel === currentTab
        )
      })
    })
  })
})

document.querySelectorAll('.lk__main-item--password').forEach((item) => {
  const password = item.querySelector('[data-lk-password]')
  const toggle = item.querySelector('[data-lk-password-toggle]')

  if (!password || !toggle) {
    return
  }

  const passwordValue = password.textContent.trim()
  const hiddenValue = '******'
  const mobilePassword = document.createElement('span')

  mobilePassword.className = 'lk__main-password-mobile'
  mobilePassword.hidden = true
  mobilePassword.textContent = passwordValue
  item.append(mobilePassword)

  password.textContent = hiddenValue

  toggle.addEventListener('click', () => {
    const isVisible = toggle.getAttribute('aria-pressed') === 'true'
    const nextIsVisible = !isVisible

    const isMobile = window.matchMedia('(max-width: 576px)').matches

    password.textContent = nextIsVisible && !isMobile ? passwordValue : hiddenValue
    mobilePassword.hidden = !nextIsVisible
    toggle.setAttribute('aria-pressed', String(nextIsVisible))
    toggle.setAttribute(
      'aria-label',
      nextIsVisible ? 'Скрыть пароль' : 'Показать пароль'
    )
  })
})
