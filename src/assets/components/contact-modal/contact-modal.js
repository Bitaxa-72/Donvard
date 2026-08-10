const contactModal = document.querySelector("[data-contact-modal]");
const contactModalTriggers = document.querySelectorAll(
  "[data-contact-modal-open]",
);

if (contactModal && contactModalTriggers.length) {
  const contactModalDialog = contactModal.querySelector(".contactModal__dialog");
  const contactModalForm = contactModal.querySelector("[data-contact-modal-form]");
  const contactModalSuccess = contactModal.querySelector(".contactModal__success");
  const contactModalNameInput = contactModal.querySelector('input[name="name"]');
  const contactModalPhoneInput = contactModal.querySelector('input[name="phone"]');
  const contactModalStorageKey = "donvard-contact-form";
  let contactModalCloseTimer = null;
  let contactModalSuccessTimer = null;

  const getContactModalScrollbarWidth = () =>
    window.innerWidth - document.documentElement.clientWidth;

  const setContactModalScrollbarCompensation = () => {
    document.documentElement.style.setProperty(
      "--contact-modal-scrollbar",
      `${getContactModalScrollbarWidth()}px`,
    );
  };

  const getContactModalStorage = () => {
    try {
      return JSON.parse(localStorage.getItem(contactModalStorageKey)) || {};
    } catch {
      return {};
    }
  };

  const setContactModalStorage = () => {
    const data = {
      name: contactModalNameInput?.value || "",
      phone: contactModalPhoneInput?.value || "",
    };

    localStorage.setItem(contactModalStorageKey, JSON.stringify(data));
  };

  const fillContactModalFromStorage = () => {
    const data = getContactModalStorage();

    if (contactModalNameInput && data.name) {
      contactModalNameInput.value = data.name;
    }

    if (contactModalPhoneInput && data.phone) {
      contactModalPhoneInput.value = data.phone;
      contactModalPhoneInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  const closeContactModal = () => {
    if (contactModal.hidden) {
      return;
    }

    contactModal.classList.remove("contactModal--open");
    document.body.classList.remove("contactModal-open");
    window.clearTimeout(contactModalSuccessTimer);

    contactModalCloseTimer = window.setTimeout(() => {
      contactModal.hidden = true;
      contactModalForm.hidden = false;
      contactModalSuccess.hidden = true;
      document.documentElement.style.removeProperty(
        "--contact-modal-scrollbar",
      );
    }, 200);
  };

  const openContactModal = () => {
    setContactModalScrollbarCompensation();
    window.clearTimeout(contactModalCloseTimer);
    window.clearTimeout(contactModalSuccessTimer);
    contactModalForm.hidden = false;
    contactModalSuccess.hidden = true;
    fillContactModalFromStorage();
    contactModal.hidden = false;
    document.body.classList.add("contactModal-open");

    requestAnimationFrame(() => {
      contactModal.classList.add("contactModal--open");
      contactModalDialog?.focus();
    });
  };

  contactModalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", openContactModal);
  });

  contactModal.querySelectorAll("[data-contact-modal-close]").forEach((close) => {
    close.addEventListener("click", closeContactModal);
  });

  contactModalForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    setContactModalStorage();
    contactModalForm.hidden = true;
    contactModalSuccess.hidden = false;

    contactModalSuccessTimer = window.setTimeout(() => {
      closeContactModal();
    }, 2000);
  });

  contactModalNameInput?.addEventListener("input", setContactModalStorage);
  contactModalPhoneInput?.addEventListener("input", setContactModalStorage);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !contactModal.hidden) {
      closeContactModal();
    }
  });
}
