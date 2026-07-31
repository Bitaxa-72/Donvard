const phoneInputs = document.querySelectorAll("[data-phone-mask]");
const phoneMask = "+7 (000) 000-00-00";
const citySelects = document.querySelectorAll("[data-city-select]");
const cityOptions = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Красноярск",
  "Челябинск",
  "Самара",
  "Уфа",
  "Ростов-на-Дону",
  "Краснодар",
  "Омск",
  "Воронеж",
  "Пермь",
  "Волгоград",
];

const getPhoneDigits = (value) =>
  value.replace(/\D/g, "").replace(/^7/, "").replace(/^8/, "").slice(0, 10);

const formatPhone = (value) => {
  const digits = getPhoneDigits(value);

  if (!digits) {
    return "";
  }

  let result = "+7";

  if (digits.length > 0) {
    result += ` (${digits.slice(0, 3)}`;
  }

  if (digits.length >= 3) {
    result = `+7 (${digits.slice(0, 3)})`;
  }

  if (digits.length > 3) {
    result += ` ${digits.slice(3, 6)}`;
  }

  if (digits.length > 6) {
    result += `-${digits.slice(6, 8)}`;
  }

  if (digits.length > 8) {
    result += `-${digits.slice(8, 10)}`;
  }

  return result;
};

const updatePhoneView = (input) => {
  const phone = input.closest(".checkout__phone");
  const value = phone?.querySelector("[data-phone-mask-value]");
  const rest = phone?.querySelector("[data-phone-mask-rest]");

  if (!value || !rest) {
    return;
  }

  value.textContent = input.value;
  rest.textContent = phoneMask.slice(input.value.length);
};

phoneInputs.forEach((input) => {
  updatePhoneView(input);

  input.addEventListener("beforeinput", (evt) => {
    if (
      evt.inputType !== "deleteContentBackward" ||
      input.selectionStart !== input.selectionEnd ||
      input.selectionStart === 0
    ) {
      return;
    }

    const cursor = input.selectionStart;

    if (/\d/.test(input.value[cursor - 1])) {
      return;
    }

    const digits = getPhoneDigits(input.value);
    const digitIndex = getPhoneDigits(input.value.slice(0, cursor)).length - 1;

    if (digitIndex < 0) {
      return;
    }

    input.value = formatPhone(
      `${digits.slice(0, digitIndex)}${digits.slice(digitIndex + 1)}`,
    );
    input.setSelectionRange(input.value.length, input.value.length);
    updatePhoneView(input);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    evt.preventDefault();
  });

  input.addEventListener("input", () => {
    input.value = formatPhone(input.value);
    updatePhoneView(input);
  });

  input.addEventListener("blur", () => {
    if (!input.value.replace(/\D/g, "")) {
      input.value = "";
      updatePhoneView(input);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
});

const normalizeCity = (value) => value.trim().toLowerCase();

citySelects.forEach((city) => {
  const input = city.querySelector("[data-city-input]");
  const toggle = city.querySelector("[data-city-toggle]");
  const list = city.querySelector("[data-city-list]");

  if (!input || !toggle || !list) {
    return;
  }

  const closeList = () => {
    city.classList.remove("checkout__city--open");
    input.setAttribute("aria-expanded", "false");
    list.hidden = true;
  };

  const openList = () => {
    city.classList.add("checkout__city--open");
    input.setAttribute("aria-expanded", "true");
    list.hidden = false;
  };

  const renderList = () => {
    const search = normalizeCity(input.value);
    const items = cityOptions.filter((option) =>
      normalizeCity(option).includes(search),
    );

    list.innerHTML = "";

    items.forEach((option) => {
      const item = document.createElement("li");
      const button = document.createElement("button");

      item.className = "checkout__city-item";
      button.className = "checkout__city-option";
      button.type = "button";
      button.textContent = option;

      button.addEventListener("mousedown", (evt) => {
        evt.preventDefault();
        input.value = option;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        closeList();
      });

      item.append(button);
      list.append(item);
    });

    if (document.activeElement === input || document.activeElement === toggle) {
      list.hidden = items.length === 0;
      city.classList.toggle("checkout__city--open", items.length > 0);
      input.setAttribute("aria-expanded", String(items.length > 0));
    }
  };

  input.addEventListener("focus", () => {
    renderList();
    if (list.children.length > 0) {
      openList();
    }
  });

  input.addEventListener("input", renderList);

  input.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape") {
      closeList();
    }
  });

  city.addEventListener("focusout", (evt) => {
    if (!city.contains(evt.relatedTarget)) {
      closeList();
    }
  });

  toggle.addEventListener("mousedown", (evt) => {
    evt.preventDefault();
  });

  toggle.addEventListener("click", () => {
    input.focus();

    if (city.classList.contains("checkout__city--open")) {
      closeList();
      return;
    }

    renderList();
    if (list.children.length > 0) {
      openList();
    }
  });

  document.addEventListener("mousedown", (evt) => {
    if (!city.contains(evt.target)) {
      closeList();
    }
  });
});

const checkoutForms = document.querySelectorAll(".checkout__inner");
const checkoutStorageKey = "donvard_checkout_form";

const getStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getCheckoutFields = (form) =>
  form.querySelectorAll("input[name], textarea[name], select[name]");

const saveCheckoutForm = (form) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const data = {};

  getCheckoutFields(form).forEach((field) => {
    if (field.type === "radio") {
      if (field.checked) {
        data[field.name] = field.value;
      }

      return;
    }

    if (field.type === "checkbox") {
      data[field.name] = field.checked;
      return;
    }

    data[field.name] = field.value;
  });

  storage.setItem(checkoutStorageKey, JSON.stringify(data));
};

const restoreCheckoutForm = (form) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const savedData = storage.getItem(checkoutStorageKey);

  if (!savedData) {
    return;
  }

  let data = {};

  try {
    data = JSON.parse(savedData);
  } catch {
    return;
  }

  getCheckoutFields(form).forEach((field) => {
    if (!Object.prototype.hasOwnProperty.call(data, field.name)) {
      return;
    }

    if (field.type === "radio") {
      field.checked = data[field.name] === field.value;
      return;
    }

    if (field.type === "checkbox") {
      field.checked = Boolean(data[field.name]);
      return;
    }

    field.value = data[field.name];
  });

  phoneInputs.forEach(updatePhoneView);
};

checkoutForms.forEach((form) => {
  restoreCheckoutForm(form);

  form.addEventListener("input", () => {
    saveCheckoutForm(form);
  });

  form.addEventListener("change", () => {
    saveCheckoutForm(form);
  });
});
