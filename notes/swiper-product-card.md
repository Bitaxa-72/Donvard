# Слайдер товара

Swiper уже установлен в проекте.

```html
<div class="swiper product-card-in-stock__slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide product-card-in-stock__slide">
      <img width="204" height="190" alt="" src="/img/product.jpg" />
    </div>
    <div class="swiper-slide product-card-in-stock__slide">
      <img width="204" height="190" alt="" src="/img/product.jpg" />
    </div>
    <div class="swiper-slide product-card-in-stock__slide">
      <img width="204" height="190" alt="" src="/img/product.jpg" />
    </div>
  </div>
  <div class="swiper-pagination product-card-in-stock__pagination"></div>
</div>
```

```css
.product-card-in-stock__slider {
  width: 204px;
}

.product-card-in-stock__slider .product-card-in-stock__slide {
  flex: 0 0 204px;
  width: 204px;
  height: 190px;
  aspect-ratio: 102 / 95;
}

.product-card-in-stock__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card-in-stock__pagination {
  position: static;
  display: flex;
  gap: 13px;
  margin-top: 20px;
}

.product-card-in-stock__pagination .swiper-pagination-bullet {
  width: 29px;
  height: 2px;
  margin: 0;
  border-radius: 0;
  background: #d9e2ef;
  opacity: 1;
}

.product-card-in-stock__pagination .swiper-pagination-bullet-active {
  background: #104e9e;
}
```

```js
import Swiper from 'swiper'
import { Pagination } from 'swiper/modules'
import 'swiper/css'

const productCardInStockSlider = document.querySelector(
  '.product-card-in-stock__slider'
)

if (productCardInStockSlider) {
  new Swiper(productCardInStockSlider, {
    modules: [Pagination],
    loop: true,
    pagination: {
      el: '.product-card-in-stock__pagination',
      clickable: true
    }
  })
}
```
