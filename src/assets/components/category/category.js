import Swiper from "swiper";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import "swiper/css";

const categorySorts = document.querySelectorAll("[data-category-sort]");
const categorySwipers = document.querySelectorAll(".category__swiper");
const categoryTop = document.querySelector(".category__top");
const categoryControls = document.querySelector(".category__buttons-wrap");
const categoryControlsSlot = document.querySelector(".category__controls-slot");
const categoryControlsMedia = window.matchMedia("(max-width: 992px)");
const categoryViewButtons = document.querySelectorAll("[data-category-view]");
const categorySubviewButtons = document.querySelectorAll(
  "[data-category-subview]",
);
const categoryProductViews = document.querySelectorAll(
  "[data-category-products-view]",
);
const categoryViewStorageKey = "donvard-category-view";
const categorySubviewStorageKey = "donvard-category-subview";
let activeCategoryView = "grid";
let activeCategorySubview = "sections";

const getCategoryStorageValue = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setCategoryStorageValue = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const hasCategoryView = (value) =>
  Array.from(categoryViewButtons).some(
    (button) => button.dataset.categoryView === value,
  );

const hasCategorySubview = (value) =>
  Array.from(categorySubviewButtons).some(
    (button) => button.dataset.categorySubview === value,
  );

const updateCategoryControlsPlace = () => {
  if (!categoryTop || !categoryControls || !categoryControlsSlot) {
    return;
  }

  if (categoryControlsMedia.matches) {
    categoryControlsSlot.append(categoryControls);
    return;
  }

  categoryTop.append(categoryControls);
};

updateCategoryControlsPlace();
categoryControlsMedia.addEventListener("change", updateCategoryControlsPlace);

const setCategoryProductsView = () => {
  const currentProductsView =
    activeCategoryView === "grid" ? activeCategorySubview : activeCategoryView;

  categoryViewButtons.forEach((button) => {
    const isActive = button.dataset.categoryView === activeCategoryView;

    button.classList.toggle("category__view-btn--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  categorySubviewButtons.forEach((button) => {
    const isActive = button.dataset.categorySubview === activeCategorySubview;

    button.classList.toggle("category__view-btn--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  categoryProductViews.forEach((view) => {
    view.hidden = view.dataset.categoryProductsView !== currentProductsView;
  });
};

categoryViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategoryView = button.dataset.categoryView;
    setCategoryStorageValue(categoryViewStorageKey, activeCategoryView);
    setCategoryStorageValue(categorySubviewStorageKey, activeCategorySubview);
    setCategoryProductsView();
  });
});

categorySubviewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategoryView = "grid";
    activeCategorySubview = button.dataset.categorySubview;
    setCategoryStorageValue(categoryViewStorageKey, activeCategoryView);
    setCategoryStorageValue(categorySubviewStorageKey, activeCategorySubview);
    setCategoryProductsView();
  });
});

const activeCategoryViewButton =
  document.querySelector(".category__view-btn--active[data-category-view]") ||
  categoryViewButtons[0];
const activeCategorySubviewButton =
  document.querySelector(".category__view-btn--active[data-category-subview]") ||
  categorySubviewButtons[0];

if (activeCategoryViewButton) {
  activeCategoryView = activeCategoryViewButton.dataset.categoryView;
}

if (activeCategorySubviewButton) {
  activeCategorySubview = activeCategorySubviewButton.dataset.categorySubview;
}

const storedCategoryView = getCategoryStorageValue(categoryViewStorageKey);
const storedCategorySubview = getCategoryStorageValue(categorySubviewStorageKey);

if (hasCategoryView(storedCategoryView)) {
  activeCategoryView = storedCategoryView;
}

if (hasCategorySubview(storedCategorySubview)) {
  activeCategorySubview = storedCategorySubview;
}

setCategoryProductsView();

categorySwipers.forEach((swiperBlock) => {
  const slider = swiperBlock.querySelector(".category__slider");
  const prev = swiperBlock.querySelector(".category__swiper-arrow--prev");
  const next = swiperBlock.querySelector(".category__swiper-arrow--next");

  if (!slider || !prev || !next) {
    return;
  }

  const swiper = new Swiper(slider, {
    modules: [FreeMode, Navigation],
    loop: false,
    slidesPerView: 5,
    spaceBetween: 12,
    freeMode: false,
    navigation: {
      prevEl: prev,
      nextEl: next,
    },
    breakpoints: {
      0: {
        slidesPerView: "auto",
        freeMode: {
          enabled: true,
          momentum: true,
        },
      },
      577: {
        slidesPerView: 2,
        freeMode: false,
      },
      768: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 5,
      },
    },
  });

  const setActiveSlide = (activeTitle) => {
    swiperBlock.querySelectorAll(".category__slide-btn").forEach((button) => {
      button.classList.toggle(
        "category__slide-btn--active",
        button.textContent.trim() === activeTitle,
      );
    });
  };

  const activeButton = swiperBlock.querySelector(".category__slide-btn--active");

  if (activeButton) {
    setActiveSlide(activeButton.textContent.trim());
  }

  swiperBlock.querySelectorAll(".category__slide-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const slide = button.closest(".swiper-slide");
      const slideTitle = button.textContent.trim();

      if (slide) {
        swiper.slideTo(Array.from(swiper.slides).indexOf(slide));
      }

      setActiveSlide(slideTitle);
    });
  });
});

categorySorts.forEach((sort) => {
  const input = sort.querySelector(".category__sort-input");
  const toggle = sort.querySelector("[data-category-sort-toggle]");
  const value = sort.querySelector("[data-category-sort-value]");
  const list = sort.querySelector("[data-category-sort-list]");
  const options = sort.querySelectorAll("[data-category-sort-option]");

  if (!input || !toggle || !value || !list || options.length === 0) {
    return;
  }

  const closeSort = () => {
    sort.classList.remove("category__sort--open");
    toggle.setAttribute("aria-expanded", "false");
    list.hidden = true;
  };

  const openSort = () => {
    sort.classList.add("category__sort--open");
    toggle.setAttribute("aria-expanded", "true");
    list.hidden = false;
  };

  const toggleSort = () => {
    if (sort.classList.contains("category__sort--open")) {
      closeSort();
      return;
    }

    openSort();
  };

  toggle.addEventListener("click", toggleSort);

  options.forEach((option) => {
    option.addEventListener("click", () => {
      input.value = option.dataset.value || "";
      value.textContent = option.textContent.trim();

      options.forEach((currentOption) => {
        currentOption.classList.toggle(
          "category__sort-option--active",
          currentOption === option,
        );
      });

      closeSort();
      toggle.focus();
    });
  });

  sort.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape") {
      closeSort();
      toggle.focus();
    }
  });

  document.addEventListener("click", (evt) => {
    if (!sort.contains(evt.target)) {
      closeSort();
    }
  });
});

const productModalTriggers = document.querySelectorAll(".product__loop");

if (productModalTriggers.length) {
  const productModal = document.createElement("div");

  productModal.className = "productModal";
  productModal.hidden = true;
  productModal.innerHTML = `
    <button class="productModal__overlay" type="button" aria-label="Закрыть быстрый просмотр" data-product-modal-close></button>
    <div class="productModal__dialog" role="dialog" aria-modal="true" aria-label="Быстрый просмотр товара" tabindex="-1" data-cart-fly-scope>
      <div class="productModal__left">
        <div class="productModal__top">
          <span class="productModal__ad"></span>
          <div class="productModal__actions"></div>
        </div>
        <div class="productModal__slider swiper">
          <div class="productModal__slides swiper-wrapper"></div>
        </div>
        <div class="productModal__pagination"></div>
        <div class="productModal__price"></div>
        <div class="productModal__footer"></div>
      </div>
      <div class="productModal__line"></div>
      <div class="productModal__right">
        <button class="productModal__close" type="button" aria-label="Закрыть быстрый просмотр" data-product-modal-close></button>
        <h2 class="productModal__title"></h2>
        <div class="productModal__specification productHero__specification"></div>
      </div>
    </div>
  `;

  document.body.append(productModal);

  const modalDialog = productModal.querySelector(".productModal__dialog");
  const modalAd = productModal.querySelector(".productModal__ad");
  const modalActions = productModal.querySelector(".productModal__actions");
  const modalSlider = productModal.querySelector(".productModal__slider");
  const modalSlides = productModal.querySelector(".productModal__slides");
  const modalPagination = productModal.querySelector(
    ".productModal__pagination",
  );
  const modalPrice = productModal.querySelector(".productModal__price");
  const modalFooter = productModal.querySelector(".productModal__footer");
  const modalTitle = productModal.querySelector(".productModal__title");
  const modalSpecification = productModal.querySelector(
    ".productModal__specification",
  );
  let productModalSwiper = null;
  let productModalCloseTimer = null;
  let productModalSlideCount = 0;

  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  const setProductModalScrollbarCompensation = () => {
    document.documentElement.style.setProperty(
      "--product-modal-scrollbar",
      `${getScrollbarWidth()}px`,
    );
  };

  const destroyProductModalSwiper = () => {
    if (!productModalSwiper) {
      return;
    }

    productModalSwiper.destroy(true, true);
    productModalSwiper = null;
  };

  const closeProductModal = () => {
    if (productModal.hidden) {
      return;
    }

    productModalSwiper?.autoplay?.stop();
    productModal.classList.remove("productModal--open");
    document.body.classList.remove("productModal-open");

    productModalCloseTimer = window.setTimeout(() => {
      productModal.hidden = true;
      destroyProductModalSwiper();
      document.documentElement.style.removeProperty(
        "--product-modal-scrollbar",
      );
    }, 200);
  };

  const updateProductModalFlyImage = () => {
    modalSlides.querySelectorAll(".productModal__image").forEach((image) => {
      image.removeAttribute("data-cart-fly-img");
    });

    modalSlider
      .querySelector(".swiper-slide-active .productModal__image")
      ?.setAttribute("data-cart-fly-img", "");
  };

  const updateProductModalPagination = () => {
    const activeIndex = productModalSwiper?.realIndex || 0;

    modalPagination
      .querySelectorAll(".productModal__pagination-btn")
      .forEach((button, index) => {
        const isActive = index === activeIndex;

        button.classList.toggle(
          "productModal__pagination-btn--active",
          isActive,
        );
        button.setAttribute("aria-pressed", String(isActive));
      });
  };

  const createProductModalPagination = () => {
    modalPagination.replaceChildren();

    for (let index = 0; index < productModalSlideCount; index += 1) {
      const button = document.createElement("button");

      button.className = "productModal__pagination-btn";
      button.type = "button";
      button.setAttribute("aria-label", `Фото товара ${index + 1}`);
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", () => {
        productModalSwiper?.slideToLoop(index);
        productModalSwiper?.autoplay?.start();
      });

      modalPagination.append(button);
    }

    updateProductModalPagination();
  };

  const initProductModalSwiper = () => {
    destroyProductModalSwiper();

    productModalSwiper = new Swiper(modalSlider, {
      modules: [Autoplay],
      loop: true,
      slidesPerView: 1,
      speed: 300,
      grabCursor: true,
      simulateTouch: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      on: {
        init() {
          updateProductModalFlyImage();
          updateProductModalPagination();
        },
        slideChange() {
          updateProductModalFlyImage();
          updateProductModalPagination();
        },
      },
    });
  };

  const fillProductModalSlider = (card) => {
    const images = Array.from(
      card.querySelectorAll(".product__img, .product__type2-img img"),
    );
    const sourceImages = images.length ? images : [null];
    const modalImages = Array.from({ length: 4 }, (_, index) => {
      return sourceImages[index % sourceImages.length];
    });

    modalSlides.replaceChildren();
    modalPagination.replaceChildren();

    modalImages.forEach((image) => {
      const slide = document.createElement("div");
      const modalImage = document.createElement("img");

      slide.className = "productModal__slide swiper-slide";
      modalImage.className = "productModal__image";
      modalImage.src = image?.currentSrc || image?.src || "/img/product.jpg";
      modalImage.alt = image?.alt || "";
      modalImage.width = 204;
      modalImage.height = 190;

      slide.append(modalImage);
      modalSlides.append(slide);
    });

    productModalSlideCount = modalImages.length;
    createProductModalPagination();
  };

  const cloneProductModalActions = (card) => {
    const actions = card.querySelector(".product__actions")?.cloneNode(true);

    modalActions.replaceChildren();

    if (!actions) {
      return;
    }

    actions.querySelector(".product__loop")?.remove();
    modalActions.append(...actions.children);
  };

  const getProductModalSpecification = (card, titleText) => {
    const specification = card.querySelector(".product__specification");

    if (specification) {
      return specification;
    }

    return (
      Array.from(document.querySelectorAll(".category__product-card")).find(
        (productCard) =>
          productCard.querySelector(".product__title")?.textContent.trim() ===
          titleText,
      )?.querySelector(".product__specification") ||
      document.querySelector(".category__product-card .product__specification")
    );
  };

  const openProductModal = (trigger) => {
    const card = trigger.closest(".category__product-card, .product__type2");
    const ad = card?.querySelector(".product__ad");
    const title = card?.querySelector(".product__title");
    const price = card?.querySelector(".product__price");
    const footer = card?.querySelector(".product__footer");

    if (!card || !title || !price || !footer) {
      return;
    }

    const titleText = title.textContent.trim();
    const specification = getProductModalSpecification(card, titleText);

    modalAd.className = ad?.className || "productModal__ad";
    modalAd.classList.add("productModal__ad");
    modalAd.textContent = ad?.textContent.trim() || "";
    modalAd.hidden = !modalAd.textContent;
    modalTitle.textContent = titleText;
    modalPrice.textContent = price.textContent.trim();
    modalFooter.replaceChildren(footer.cloneNode(true));
    modalSpecification.replaceChildren();

    if (specification) {
      modalSpecification.append(
        ...Array.from(specification.children).map((item) =>
          item.cloneNode(true),
        ),
      );
    }

    cloneProductModalActions(card);
    fillProductModalSlider(card);
    setProductModalScrollbarCompensation();
    window.clearTimeout(productModalCloseTimer);
    productModal.hidden = false;
    document.body.classList.add("productModal-open");

    requestAnimationFrame(() => {
      productModal.classList.add("productModal--open");
      initProductModalSwiper();
      modalDialog.focus();
    });
  };

  productModalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openProductModal(trigger);
    });
  });

  productModal.querySelectorAll("[data-product-modal-close]").forEach((close) => {
    close.addEventListener("click", closeProductModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !productModal.hidden) {
      closeProductModal();
    }
  });
}
