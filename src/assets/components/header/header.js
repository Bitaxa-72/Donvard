(function () {
  const header = document.querySelector(".header");

  if (!header) {
    return;
  }

  const burger = header.querySelector(".burger");
  const mobileMenu = header.querySelector(".mobile-menu");
  const menuToggles = header.querySelectorAll(".mobile-menu__toggle");

  const updateMobileMenuOffset = () => {
    header.style.setProperty("--mobile-menu-top", `${header.offsetHeight}px`);
  };

  burger?.addEventListener("click", () => {
    const isOpen = header.classList.toggle("header--mobile-menu-open");

    burger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu?.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      updateMobileMenuOffset();
    } else {
      header.style.removeProperty("--mobile-menu-top");
    }
  });

  window.addEventListener("resize", () => {
    if (header.classList.contains("header--mobile-menu-open")) {
      updateMobileMenuOffset();
    }
  });

  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest(".mobile-menu__group");
      const isOpen = !group?.classList.contains("mobile-menu__group--open");

      menuToggles.forEach((item) => {
        const itemGroup = item.closest(".mobile-menu__group");

        itemGroup?.classList.remove("mobile-menu__group--open");
        item.setAttribute("aria-expanded", "false");
      });

      if (isOpen) {
        group?.classList.add("mobile-menu__group--open");
        toggle.setAttribute("aria-expanded", "true");
      }

    });
  });
})();
