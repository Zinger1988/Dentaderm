const initMap = () => {
  const mapContainer = document.getElementById("map");
  mapContainer.style = "position: relative";

  if (!mapContainer) return;

  maptilersdk.config.apiKey = "bZSD1sQDv0eSO7OJuHXT";
  const map = new maptilersdk.Map({
    container: mapContainer.id,
    style:
      "https://api.maptiler.com/maps/4d844cf8-762e-4501-bf23-f367565743c9/style.json?key=bZSD1sQDv0eSO7OJuHXT",
    center: [30.3878189, 50.4959581], // starting position [lng, lat]
    zoom: 9,
    navigationControl: false,
  });

  map.touchPitch.disable();
  map.keyboard.enable();
  map.keyboard.disableRotation();

  const createMessageContainer = ({ text, imageUrl }) => {
    const containerEl = document.createElement("div");
    const imageEl = document.createElement("img");
    const textEl = document.createElement("p");

    containerEl.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      background-color: rgba(0,0,0,.6);
      color: white;
      gap: 20px;
      pointer-events: none;
    `;

    textEl.style.cssText = `font-size: 16px; font-weight: bold`;

    imageEl.style.cssText = `
      display: block;
      height: 56px;
    `;

    imageEl.src = imageUrl;

    imageUrl && containerEl.append(imageEl);
    textEl.textContent = text;
    containerEl.append(textEl);

    return containerEl;
  };

  const dragTipMessage = createMessageContainer({
    text: "Touch with two fingers to drag the map",
    imageUrl: "/assets/images/2-fingers-touch.svg",
  });

  const zoomMessageContainer = createMessageContainer({
    text: "Use CTRL + Mousewheel to zoom the map",
    imageUrl: "/assets/images/ctrl-wheel.svg",
  });

  let activeTouches = 0;
  let fadeoutTimeout = null;
  let hasDoubleTouch = null;
  const popups = [];

  const closeAllPopups = () => {
    popups.forEach((popup) => popup.remove());
    popups.length = 0;
  };

  map.on("wheel", (e) => {
    map.scrollZoom.disable();
    if (e.originalEvent.ctrlKey) {
      map.scrollZoom.enable();
    }
  });

  mapContainer.addEventListener("wheel", (e) => {
    if (fadeoutTimeout) clearTimeout(fadeoutTimeout);

    if (e.ctrlKey) {
      e.preventDefault();
      zoomMessageContainer.remove();
    } else {
      mapContainer.prepend(zoomMessageContainer);
      fadeoutTimeout = setTimeout(() => {
        zoomMessageContainer.remove();
      }, 2000);
    }
  });

  map.on("click", (e) => closeAllPopups());

  map.on("touchmove", (e) => {
    activeTouches = e.originalEvent.touches.length;
    if (fadeoutTimeout) clearTimeout(fadeoutTimeout);

    if (activeTouches < 2 && activeTouches != 0 && !hasDoubleTouch) {
      map.dragPan.disable();
      mapContainer.prepend(dragTipMessage);
      fadeoutTimeout = setTimeout(() => {
        activeTouches = 0;
        dragTipMessage.remove();
        map.dragPan.enable();
        hasDoubleTouch = null;
      }, 2000);
    } else {
      dragTipMessage.remove();
      map.dragPan.enable();
    }
  });

  map.on("touchend", (e) => {
    if (e.originalEvent.touches.length >= 1) {
      hasDoubleTouch = true;
    } else {
      hasDoubleTouch = null;
    }
  });

  const el = document.createElement("div");
  el.className = "marker";
  el.style.backgroundImage = "url(./assets/images/marker.svg)";
  el.style.width = "36px";
  el.style.height = "36px";

  const coords = [
    [30.4511244, 50.5203333],
    [30.5386361, 50.4385711],
    [30.2384241, 50.5206251],
  ];

  const clinics = [
    {
      label: "Київ, вул. Вишгородська, 56/2",
      coords: [30.4511244, 50.5203333],
    },
    {
      label: "Київ, вул. Кловський узвіз, 7а",
      coords: [30.5386361, 50.4385711],
    },
    {
      label: "Ірпінь, вул. Соборна, 107",
      coords: [30.2384241, 50.5206251],
    },
  ];

  clinics.forEach((coord) => {
    const { label, coords } = coord;
    const element = el.cloneNode(true);
    const marker = new maptilersdk.Marker({ element })
      .setLngLat(coords)
      .addTo(map);

    marker.getElement().addEventListener("click", (e) => {
      closeAllPopups();
      e.stopPropagation();

      const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
        `<span style='color: black'>${label}</span>`
      );
      popups.push(popup);

      popup.setLngLat(coords).addTo(map);
    });
  });
};

const tabs = () => {
  const containers = document.querySelectorAll(".tabs");

  containers.forEach((item) => {
    const labelsWrapper = item.querySelector(".tabs-head");
    const labelItems = Array.from(labelsWrapper.querySelectorAll(".tabs-btn"));
    const activeLabel =
      labelItems.find((item) => item.classList.contains("active")) ||
      labelItems[0];

    const contentWrapper = item.querySelector(".tabs-content");

    function setActiveTab(labelItems, activeLabel, contentWrapper) {
      activeLabel.classList.add("active");

      labelItems.forEach((label) => {
        if (label !== activeLabel) {
          label.classList.remove("active");
        }
      });

      const tabId = activeLabel.dataset.tabTarget;
      const contentItems =
        contentWrapper.querySelectorAll(".tabs-content-item");
      const activeContent = contentWrapper.querySelector(
        `[data-tab-content=${tabId}]`
      );

      contentItems.forEach((item) => {
        if (item !== activeContent) {
          item.classList.remove("active");
        }
      });

      activeContent.classList.add("active");
    }

    setActiveTab(labelItems, activeLabel, contentWrapper);

    labelItems.forEach((item) =>
      item.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveTab(labelItems, e.currentTarget, contentWrapper);
      })
    );
  });
};

const initReviewCarousel = () => {
  const sliderContainer = document.querySelector(
    ".reviews-carousel .reviews-carousel__swiper"
  );

  if (!sliderContainer) return;

  const reviewsCarousel = new Swiper(
    ".reviews-carousel .reviews-carousel__swiper",
    {
      grabCursor: true,
      keyboardControl: true,
      lazy: true,
      loop: true,
      mousewheelControl: true,
      slidesPerView: 3,
      speed: 10000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1400: {
          slidesPerView: 3,
        },
      },
    }
  );

  reviewsCarousel.on("touchEnd", (swiper) => {
    updateExpand(swiper);
  });

  reviewsCarousel.on("beforeTransitionStart", (swiper) => {
    updateExpand(swiper);
  });
};

const initReviewCarouselAlt = () => {
  const sliderContainer = document.querySelector(
    ".reviews-carousel--alt .reviews-carousel__swiper"
  );

  if (!sliderContainer) return;

  const wrapper = sliderContainer.closest(".reviews-section__container");
  const customPagination = wrapper.querySelector(
    ".reviews-section__pagination"
  );
  const reviewsCarousel = new Swiper(
    ".reviews-carousel--alt .reviews-carousel__swiper",
    {
      grabCursor: true,
      keyboardControl: true,
      freeMode: false,
      loop: true,
      mousewheelControl: true,
      spaceBetween: 40,
      slidesPerView: 3,
      breakpoints: {
        0: {
          slidesPerView: 1,
          freeMode: true,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 1,
        },
        1400: {
          slidesPerView: 2,
        },
      },
      on: {
        init: function (swiper) {
          const carouselNextBtn = wrapper.querySelector(
            ".reviews-section__nav-btn--next"
          );
          const carouselPrevBtn = wrapper.querySelector(
            ".reviews-section__nav-btn--prev"
          );

          carouselNextBtn.addEventListener("click", () => swiper.slideNext());
          carouselPrevBtn.addEventListener("click", () => swiper.slidePrev());
        },
      },
    }
  );

  reviewsCarousel.on("slideChange", (swiper) => {
    updatePagination(customPagination, swiper);
  });

  reviewsCarousel.on("touchEnd", (swiper) => {
    updateExpand(swiper);
  });

  reviewsCarousel.on("beforeTransitionStart", (swiper) => {
    updateExpand(swiper);
  });

  updatePagination(customPagination, reviewsCarousel);
};

const updateExpand = (swiper) => {
  const { previousIndex, slides } = swiper;
  const slide = slides[previousIndex];

  if (!slide) return;

  const expandPanel = slide.querySelector(".expand-container__panel--expanded");

  if (!expandPanel) return;

  const expandBtn = slide.querySelector(".expand-container__btn");
  expandBtn.click();
};

const initCardCarousel = () => {
  const sliderSelector = `
  .card-carousel--doctors .card-carousel__swiper,
  .card-carousel--service-doctors .card-carousel__swiper,
  .card-carousel--blog .card-carousel__swiper,
  .card-carousel--awards .card-carousel__swiper,
  .card-carousel--reviews .card-carousel__swiper`;

  const sliderContainer = document.querySelectorAll(sliderSelector);

  if (sliderContainer.length === 0) {
    return;
  }

  const baseOptions = {
    lazy: true,
    grabCursor: true,
    spaceBetween: 50,
    freeMode: true,
    on: {
      init: function (swiper) {
        const wrapper = swiper.el.closest(".card-carousel");

        const cardCarouselNextBtn = wrapper.querySelector(
          ".card-carousel__nav--next"
        );
        const cardCarouselPrevBtn = wrapper.querySelector(
          ".card-carousel__nav--prev"
        );

        cardCarouselNextBtn?.addEventListener("click", () =>
          swiper.slideNext()
        );
        cardCarouselPrevBtn?.addEventListener("click", () =>
          swiper.slidePrev()
        );
      },
    },
  };

  const doctorsCarouselOptions = {
    slidesPerView: 4,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 28,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 28,
      },
      1400: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  };

  const servicedoctorsCarouselOptions = {
    slidesPerView: 3,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 28,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 28,
      },
    },
  };

  const awardsCarouselOptions = {
    slidesPerView: 5,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 28,
      },
      536: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 28,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 28,
      },
      1400: {
        slidesPerView: 5,
        spaceBetween: 40,
      },
    },
  };

  const demoCarouselOptions = {
    slidesPerView: 3,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 28,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 28,
      },
      1400: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
  };

  const discountCarouselOptions = {
    slidesPerView: 4,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 28,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      1400: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
  };

  const photoCarouselOptions = {
    slidesPerView: 4,
    spaceBetween: 0,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1400: {
        slidesPerView: 3,
      },
    },
  };

  const demoCarousel = new Swiper(
    ".card-carousel--demo .card-carousel__swiper",
    {
      ...baseOptions,
      ...demoCarouselOptions,
    }
  );

  const awardsCarousel = new Swiper(
    ".card-carousel--awards .card-carousel__swiper",
    {
      ...baseOptions,
      ...awardsCarouselOptions,
    }
  );

  const blogCarousel = new Swiper(
    ".card-carousel--doctors .card-carousel__swiper, .card-carousel--blog .card-carousel__swiper",
    {
      ...baseOptions,
      ...doctorsCarouselOptions,
    }
  );

  const serviceDoctorsCarousel = new Swiper(
    ".card-carousel--service-doctors .card-carousel__swiper",
    {
      ...baseOptions,
      ...servicedoctorsCarouselOptions,
    }
  );

  const discountCarousel = new Swiper(
    ".card-carousel--discount .card-carousel__swiper",
    {
      ...baseOptions,
      ...discountCarouselOptions,
    }
  );

  const photoCarousel = new Swiper(
    ".card-carousel--photo .card-carousel__swiper",
    {
      ...baseOptions,
      ...photoCarouselOptions,
    }
  );
};

const updatePagination = (paginationContainer, swiper) => {
  paginationContainer.innerHTML = "";
  swiper.slides.forEach((slide, index) => {
    if (slide.classList.contains("swiper-slide-duplicate")) return;

    const bullet = document.createElement("button");
    bullet.classList.add("pagination__bullet");

    if (index === swiper.realIndex) {
      bullet.classList.add("pagination__bullet--active");
    }

    bullet.addEventListener("click", () => {
      swiper.slideToLoop(index);
    });

    paginationContainer.appendChild(bullet);
  });
};

const initReviewSlider = () => {
  const sliderSelector = ".review-slider";
  const sliderContainer = document.querySelector(sliderSelector);

  if (!sliderContainer) {
    return;
  }

  const swiper = new Swiper(".review-slider", {
    lazy: true,
    grabCursor: true,
    slidesPerView: 1,
  });

  const wrapper = swiper.el.closest(".hero-section");
  const customPagination = wrapper.querySelector(".pagination__list");
  const cardCarouselNextBtn = wrapper.querySelector(".pagination__btn--next");
  const cardCarouselPrevBtn = wrapper.querySelector(".pagination__btn--prev");

  cardCarouselNextBtn.addEventListener("click", () => swiper.slideNext());
  cardCarouselPrevBtn.addEventListener("click", () => swiper.slidePrev());

  swiper.on("slideChange", (swiper) => {
    updatePagination(customPagination, swiper);
  });

  swiper.on("touchEnd", (swiper) => {
    updateExpand(swiper);
  });

  swiper.on("beforeTransitionStart", (swiper) => {
    updateExpand(swiper);
  });

  updatePagination(customPagination, swiper);
};

const fluidLabel = () => {
  const labelContainers = document.querySelectorAll(".fluid-label");

  labelContainers.forEach((container) => {
    const title = container.querySelector(".fluid-label__title");
    const control = container.querySelector(".fluid-label__control");

    const isSelect = control.tagName.toLocaleLowerCase() === "select";
    const isActiveInitially = isSelect
      ? !control?.selectedOptions?.[0].value.trim()
      : control.value.trim();
    if (isActiveInitially) {
      container.classList.add("fluid-label--active");
    }

    control.addEventListener("focus", () => {
      container.classList.add("fluid-label--active");
    });

    title.addEventListener("click", () => {
      control.focus();
    });

    control.addEventListener("blur", () => {
      if (!control.value.trim()) {
        container.classList.remove("fluid-label--active");
      }
    });
  });
};

const initMenu = () => {
  const menuBtnContainers = document.querySelectorAll(
    ".sidebar__menu-btn, .header__menu-btn"
  );
  const menuBtn = document.querySelectorAll(".burger-btn");
  const menu = document.querySelector(".menu");

  menuBtnContainers.forEach((container) => {
    container.addEventListener("click", (e) => {
      menu.classList.toggle("menu--active");

      menuBtn.forEach((btn) => btn.classList.toggle("burger-btn--active"));
    });
  });
};

const initFancyBox = () => {
  Fancybox.bind("[data-fancybox]");
};

const initAccordion = () => {
  var accordions = document.querySelectorAll(".accordion");

  accordions.forEach((acc) => {
    acc.addEventListener("click", (e) => {
      const label = e.target.classList.contains("accordion-label")
        ? e.target
        : e.target.closest(".accordion-label");
      if (label) {
        const panel = label.nextElementSibling;

        if (!panel) return;

        if (panel.style.maxHeight) {
          label.classList.remove("label-active");
          panel.classList.remove("panel-active");
          panel.style.maxHeight = null;
        } else {
          label.classList.add("label-active");
          panel.classList.add("panel-active");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      }
    });
  });
};

const toggleExpand = (containerSelector, btnDefaultText, btnActiveText) => {
  const containers = document.querySelectorAll(containerSelector);

  if (!containers.length) {
    return;
  }

  containers.forEach((container) => {
    const panel = container.querySelector(".expand-container__panel");

    if (!panel || panel.scrollHeight - panel.offsetHeight <= 3) {
      panel.classList.add("expand-container__panel--inactive");
      return;
    }

    panel.classList.remove("expand-container__panel--inactive");

    const btn = document.createElement("button");
    const btnText = btnDefaultText ? btnDefaultText : "Розгорнути";
    btn.textContent = btnText;
    btn.classList.add("expand-container__btn", "btn", "btn--default");

    container.append(btn);

    btn.addEventListener("click", (e) => {
      if (panel.style.maxHeight) {
        panel.classList.remove("expand-container__panel--expanded");
        panel.style.maxHeight = null;
        btn.textContent = btnText;
      } else {
        panel.classList.add("expand-container__panel--expanded");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.textContent = btnActiveText ? btnActiveText : "Згорнути";
      }
    });
  });
};

const initAppointmentForms = () => {
  const appointmentForms = document.querySelectorAll(".appointment-form");

  appointmentForms.forEach((formElement) => {
    const select = formElement.querySelector(".nice-select");
    const selectInstance = NiceSelect.bind(select, {
      placeholder: false,
    });

    new FormVaildator({
      formElement,
      controls: [
        {
          name: "clinic",
          validities: [
            { name: "required", message: "Необхідно обрати клініку" },
          ],
        },
        {
          name: "name",
          validities: [{ name: "required", message: "Необхідно вказати ім`я" }],
        },
        {
          name: "tel",
          validities: [
            { name: "required", message: "Необхідно вказати номер телефону" },
          ],
        },
        {
          name: "agreement",
          validities: [{ name: "checked", message: "Потрібна ваша згода" }],
        },
      ],
      validateOn: {
        change: true,
        input: true,
      },
      onSubmit: (e) => {
        const formData = new FormData(e.target);
        const serialized = Object.fromEntries(formData);
        console.log(serialized);

        // TODO: HANDLE FORM
      },
      onReset: (e) => {
        selectInstance.update();
      },
      onErrorChange: handleFormValidityChange,
    });
  });
};

const initConnectedCarousel = () => {
  const slidersSelectors = [
    ".connected-carousel__text-carousel .swiper",
    ".connected-carousel__image-carousel .swiper",
  ];

  const hasSlideElements = slidersSelectors
    .map((selector) => document.querySelector(selector))
    .every((slideElement) => slideElement);

  if (!hasSlideElements) {
    return;
  }

  const textSwiper = new Swiper(".connected-carousel__text-carousel .swiper", {
    lazy: true,
    slidesPerView: 1,
    grabCursor: true,
    breakpoints: {
      0: {
        autoHeight: true,
      },
      768: {
        autoHeight: false,
      },
    },
  });

  const imageSwiper = new Swiper(
    ".connected-carousel__image-carousel .swiper",
    {
      lazy: true,
      grabCursor: false,
      effect: "flip",
      slidesPerView: 1,
      allowTouchMove: false,
    }
  );

  const wrapper = textSwiper.el.closest(".connected-carousel__text-carousel");
  const customPagination = wrapper.querySelector(".pagination__list");
  const cardCarouselNextBtn = wrapper.querySelector(".pagination__btn--next");
  const cardCarouselPrevBtn = wrapper.querySelector(".pagination__btn--prev");

  cardCarouselNextBtn.addEventListener("click", () => {
    textSwiper.slideNext();
  });
  cardCarouselPrevBtn.addEventListener("click", () => {
    textSwiper.slidePrev();
  });

  textSwiper.on("slideChange", ({ activeIndex }) => {
    imageSwiper.slideTo(activeIndex);
  });

  textSwiper.on("slideChange", () =>
    updatePagination(customPagination, textSwiper)
  );

  updatePagination(customPagination, textSwiper);
};

const initHeroSlider = () => {
  const sliderSelector = ".hero-slider";
  const sliderContainer = document.querySelector(sliderSelector);

  if (!sliderContainer) {
    return;
  }

  const swiper = new Swiper(sliderSelector, {
    lazy: true,
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 40,
  });

  const navButtons = swiper.el.querySelectorAll(".hero-card__nav-btn");
  const nextNavBtns = Array.from(navButtons).filter((item) =>
    item.classList.contains("hero-card__nav-btn--next")
  );
  const prevNavBtns = Array.from(navButtons).filter((item) =>
    item.classList.contains("hero-card__nav-btn--prev")
  );

  nextNavBtns.forEach((btn) =>
    btn.addEventListener("click", () => swiper.slideNext())
  );
  prevNavBtns.forEach((btn) =>
    btn.addEventListener("click", () => swiper.slidePrev())
  );

  swiper.on("touchEnd", (swiper) => {
    updateExpand(swiper);
  });

  swiper.on("beforeTransitionStart", (swiper) => {
    updateExpand(swiper);
  });
};

const initCharitySlider = () => {
  const sliderSelector = ".charity-slider";
  const sliderContainers = document.querySelectorAll(sliderSelector);

  if (!sliderContainers.length) {
    return;
  }

  const swiper = new Swiper(sliderSelector, {
    grabCursor: true,
    slidesPerView: "auto",
    loop: true,
    lazy: true,
    // freeMode: true,
  });

  sliderContainers.forEach((container, i) => {
    const parentSection = container.closest(".hero-section__container");

    const nextNavBtn = parentSection.querySelector(".pagination__btn--next");
    const prevNavBtn = parentSection.querySelector(".pagination__btn--prev");

    nextNavBtn.addEventListener("click", () => swiper[i].slideNext());
    prevNavBtn.addEventListener("click", () => swiper[i].slidePrev());
  });
};

const initYouTubeVideo = () => {
  let YouTubeContainers = document.querySelectorAll(".video");

  if (!YouTubeContainers.length) return;

  // Iterate over every YouTube container you may have
  for (let i = 0; i < YouTubeContainers.length; i++) {
    let container = YouTubeContainers[i];
    let imageSource =
      "https://i.ytimg.com/vi/" + container.dataset.videoId + "/hqdefault.jpg";

    // Load the Thumbnail Image asynchronously
    let image = new Image();
    image.src = imageSource;
    image.classList.add("video__poster");
    image.addEventListener("load", function () {
      container.appendChild(image);
    });

    // When the user clicks on the container, load the embedded YouTube video
    container.addEventListener("click", function () {
      let iframe = document.createElement("iframe");

      iframe.classList.add("video__item");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      // Important: add the autoplay GET parameter, otherwise the user would need to click over the YouTube video again to play it
      iframe.setAttribute(
        "src",
        "https://www.youtube.com/embed/" +
          this.dataset.videoId +
          "?rel=0&showinfo=0&autoplay=1"
      );

      // Clear Thumbnail and load the YouTube iframe
      this.innerHTML = "";
      this.appendChild(iframe);
    });
  }
};

const stickyHeader = () => {
  const headers = document.querySelectorAll(".sticky-header");

  if (headers.length === 0) return;

  headers.forEach((header) => {
    const sticky = header.offsetTop + 150;

    const toggleSticky = () => {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky-header--sticky");
      } else {
        header.classList.remove("sticky-header--sticky");
      }
    };

    window.onscroll = function () {
      toggleSticky();
    };

    toggleSticky();
  });
};

const initSmoothScrollToAnchor = () => {
  const anchors = document.querySelectorAll('a[href^="#"]');

  if (!anchors.length === 0) return;

  const smoothScroll = (target) => {
    const element = document.getElementById(target);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: "smooth",
      });
    }
  };

  anchors.forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      event.preventDefault();
      const target = anchor.getAttribute("href").substring(1);
      smoothScroll(target);
    });
  });
};

const debounce = (fn, timeout) => {
  let isDebounce = false;

  return () => {
    if (!isDebounce) {
      isDebounce = true;
      setTimeout(() => {
        isDebounce = false;
        fn();
      }, timeout);
    }
  };
};

const initBeforeAfterSlider = () => {
  const container = document.querySelector(".before-after");

  if (!container) return;

  const slider = container.querySelector(".before-after__slider");
  const beforeContainerEl = container.querySelector(
    ".before-after__before-container"
  );
  const buttonEl = container.querySelector(".before-after__slider-button");

  const handleSlide = (val) => {
    beforeContainerEl.style.width = `${val}%`;
    buttonEl.style.left = `${val}%`;
  };

  slider.addEventListener("input", (e) => {
    handleSlide(e.target.value);
  });

  handleSlide(50);
};

const getOffsetTop = (element) => {
  const rect = element.getBoundingClientRect();
  const pageEl = document.querySelector(".page");
  const scrollTop = pageEl.scrollTop;
  return rect.top + scrollTop;
};

const pageNavigation = () => {
  const page = document.querySelector(".page");
  const containers = document.querySelectorAll("[data-nav-id]");
  const navListWrapper = document.querySelector(".nav-content__nav");
  const navList = document.querySelector(".nav-content__list");

  if (containers.length === 0 || !navList) return;

  const navItems = [];
  let lastScrollPos = 0;

  const setActive = (entryNavId) => {
    navItems.forEach((navItem) => {
      const { navId: itemNavId } = navItem.dataset;

      if (entryNavId === itemNavId) {
        navListWrapper.scrollTo({
          left: navItem.offsetLeft,
        });

        navItem.classList.add("nav-content__nav-item--active");
      } else {
        navItem.classList.remove("nav-content__nav-item--active");
      }
    });
  };

  const calcContainerPos = () => {
    let scollTopPos = page.scrollTop;

    containers.forEach((c) => {
      const windowCenterY = window.innerHeight / 3;
      const { top, bottom } = c.getBoundingClientRect();
      const isScrollingUp = scollTopPos < lastScrollPos;

      if ((isScrollingUp && bottom < windowCenterY) || top < windowCenterY) {
        setActive(c.dataset.navId);
      }
    });

    lastScrollPos = scollTopPos;
  };

  const debouncedNavHandler = debounce(calcContainerPos, 50);
  page.addEventListener("scroll", debouncedNavHandler);

  containers.forEach((container, i) => {
    const { navId } = container.dataset;

    const listEl = document.createElement("li");
    listEl.classList.add("nav-content__nav-item", "wow", "fadeInDown");
    listEl.dataset.wowDelay = `${i / 20}s`;
    listEl.dataset.navId = navId;

    const navEl = document.createElement("span");
    navEl.classList.add("nav-content__nav-btn");
    navEl.textContent = navId;

    navEl.addEventListener("click", () => {
      page.scrollTo({
        top: getOffsetTop(container) - window.innerHeight / 3 + 10,
        behavior: "smooth",
      });
    });

    listEl.append(navEl);

    navItems.push(listEl);
  });

  navList.append(...navItems);

  calcContainerPos();
};

const calcNavContentMargin = () => {
  const navContentEl = document.querySelector(".nav-content");
  const bannerEl = document.querySelector(".banner--service");

  if (!navContentEl || !bannerEl) return;

  navContentEl.style.marginTop = `${bannerEl.clientHeight}px`;

  window.addEventListener(
    "resize",
    debounce(() => {
      navContentEl.style.marginTop = `${bannerEl.clientHeight}px`;
    }, 250)
  );

  window.addEventListener("scroll", () => console.log("scroll"), true);

  bannerEl.addEventListener("scroll", () => console.log("scroll"), true);
};

const serviceSearch = function () {
  const searchBar = document.querySelector(".prices-page__search");

  if (!searchBar) return;

  const searchControl = searchBar.querySelector(".search-panel__control");
  const searchReset = searchBar.querySelector(".search-panel__reset");
  const dropdownList = searchBar.querySelector(".search-panel__dropdown");
  const services = Array.from(document.querySelectorAll("[data-service-name]"));

  function searchServices(brandsCollection) {
    if (searchControl.value.trim()) {
      const regex = new RegExp(searchControl.value.trim(), "ig");

      return brandsCollection.reduce((acc, cur) => {
        const match = Array.from(cur.dataset.serviceName.matchAll(regex));
        if (match.length > 0) {
          acc.push({
            ref: cur,
            marked: markString(match),
          });
        }
        return acc;
      }, []);
    }
  }

  function markString(matcher) {
    if (matcher.length) {
      return matcher.reduce((acc, cur, i, arr) => {
        if (i === 0) {
          acc += cur.input.slice(0, cur.index);
        }

        acc += `<b style="font-weight: 700;">${cur.input.slice(
          cur.index,
          cur.index + cur[0].length
        )}</b>`;

        if (arr[i + 1]) {
          acc += cur.input.slice(cur.index + cur[0].length, arr[i + 1].index);
        } else {
          acc += cur.input.slice(
            cur.index + cur[0].length,
            cur.input.length + 1
          );
        }

        return acc;
      }, "");
    }
  }

  function scrollToService(serviceEl) {
    const page = document.querySelector(".page");
    page.scrollTo({
      top: getOffsetTop(serviceEl) - 250,
      left: 0,
      behavior: "smooth",
    });
  }

  searchControl.addEventListener("input", () => {
    dropdownList.innerHTML = "";

    if (searchControl.value.trim()) {
      const foundedBrands = searchServices(services);

      if (foundedBrands.length) {
        dropdownList.style = "display: flex;";
        searchReset.style = "display: block;";

        const fragment = new DocumentFragment();

        foundedBrands.forEach((item) => {
          const ddBrand = document.createElement("div");
          ddBrand.classList.add("search-panel__dropdown-link");
          ddBrand.innerHTML = item.marked;
          ddBrand.scrollToRef = item.ref;

          fragment.append(ddBrand);
        });

        dropdownList.append(fragment);
      } else {
        searchReset.style = "";
        dropdownList.style = "";
      }

      searchReset.style = "display: block;";
    }
  });

  searchControl.addEventListener("input", (e) => {
    if (!e.target.value.trim()) {
      searchReset.click();
    }

    if (!e.key.match(/[\wа-яії'\s-]/i)) {
      return false;
    }
  });

  dropdownList.addEventListener("click", (e) => {
    const target = e.target.classList.contains("search-panel__dropdown-link")
      ? e.target
      : e.target.closest(".search-panel__dropdown-link");

    if (target) {
      const accordionLabel = target.scrollToRef.closest(
        ".prices__item:not(.prices__item--sub)"
      ).firstElementChild;
      const accordionPanel = target.scrollToRef.closest(".accordion__panel");

      if (!accordionLabel.classList.contains("label-active")) {
        accordionLabel.classList.add("label-active");
        accordionPanel.classList.add("panel-active");
        accordionPanel.style.maxHeight = accordionPanel.scrollHeight + "px";
      }

      scrollToService(target.scrollToRef);
      target.scrollToRef
        .closest(".prices__link")
        .classList.add("service-search-target");
      searchControl.value = target.textContent;
      dropdownList.innerHTML = "";
      dropdownList.style = "";
    }
  });

  searchReset.addEventListener("click", () => {
    searchControl.value = "";
    searchReset.style = "";
    dropdownList.innerHTML = "";
    dropdownList.style = "";
  });

  document.addEventListener("click", (e) => {
    const activeSearchElem = document.querySelector(".service-search-target");

    if (
      e.target !== dropdownList &&
      !e.target.closest(".search-panel__dropdown")
    ) {
      dropdownList.style = "";
    }

    if (
      activeSearchElem &&
      e.target !== dropdownList &&
      !e.target.classList.contains("search-panel__dropdown-link") &&
      !e.target.closest(".search-panel__dropdown-link") &&
      e.target !== activeSearchElem
    ) {
      activeSearchElem
        .closest(".prices__link")
        .classList.remove("service-search-target");
    }
  });
};

const articleRating = () => {
  const wrapper = document.querySelector(".article-rating");

  if (!wrapper) return;

  const storedArticleId = localStorage.getItem("dentaderm_voted_article_id");
  const articleId = document.getElementById("inp_blog_id").value;

  const manipulatePrevSibling = (el, cb) => {
    cb(el);

    if (el.previousElementSibling) {
      return manipulatePrevSibling(el.previousElementSibling, cb);
    }

    return;
  };

  const manipulateNextSibling = (el, cb) => {
    if (el.nextElementSibling) {
      cb(el.nextElementSibling);
      return manipulateNextSibling(el.nextElementSibling, cb);
    }

    return;
  };

  function renderRatingBanner(container, id) {
    clearContainer(container);
    const ratingEls = [];

    Array(5)
      .fill(null)
      .forEach((_, i) => {
        const elWrapper = document.createElement("div");
        elWrapper.classList.add("article-rating__star");
        elWrapper.innerHTML = `<svg class="article-rating__star-icon icon">
        <use href="/assets/icons.svg#star-solid" />
      </svg>`;

        const elRatingMark = document.createElement("div");
        elRatingMark.classList.add("article-rating__star-mark");
        elRatingMark.textContent = i + 1;

        elWrapper.prepend(elRatingMark);
        ratingEls.push(elWrapper);

        elWrapper.addEventListener("mouseenter", (e) => {
          manipulatePrevSibling(e.target, (el) => {
            el.classList.add("active");
          });
          manipulateNextSibling(e.target, (el) => {
            el.classList.remove("active");
          });
        });

        elWrapper.addEventListener("click", (e) => {
          container.setAttribute("data-mark", i + 1);
        });
      });

    container.append(...ratingEls);

    container.addEventListener("mouseleave", () => {
      const mark = parseInt(container.getAttribute("data-mark")) || 0;

      ratingEls.forEach((el, i) => {
        if (i >= mark) {
          el.classList.remove("active");
        } else {
          el.classList.add("active");
        }
      });
    });

    container.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("article-rating__star") ||
        e.target.closest(".article-rating__star")
      ) {
        const rating = container.getAttribute("data-mark");
        postRating(container, id, rating);
      }
    });
  }

  function clearContainer(container) {
    container.innerHTML = "";
    container.className = "article-rating";
  }

  function renderSuccess(container, articleId) {
    clearContainer(container);
    container.classList.add("article-rating--success");

    container.innerHTML = `
      <svg class="icon article-rating__icon">
        <use href="/assets/icons.svg#success-outline" />
      </svg>
      <span class="article-rating__message">${
        articleId ? "Ви вже оцінювали дану статтю" : "Дякуємо за Вашу оцінку!"
      }</span>
    `;
  }

  function renderLoader(container) {
    clearContainer(container);
    container.classList.add("article-rating--info");

    container.innerHTML = `
      <svg class="icon article-rating__icon">
        <use href="/assets/icons.svg#spinner" />
      </svg>
      <span class="article-rating__message">Будь ласка, почекайте...</span>
    `;
  }

  function renderError(container, message) {
    clearContainer(container);
    container.classList.add("article-rating--error");

    container.innerHTML = `
      <svg class="icon article-rating__icon">
        <use href="/assets/icons.svg#warning-outline" />
      </svg>
      <span class="article-rating__message">${message}</span>
    `;
  }

  async function postRating(container, articleId, rating) {
    try {
      const formData = new FormData();
      formData.append("blog_id", articleId);
      formData.append("rating", rating);

      renderLoader(container);

      const res = await fetch("/ui/ukr/blogs/helpers/rating_create.aspx", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Виникла помилка. Будь ласка, спробуйте пізніше.");
      }

      renderSuccess(container);
      localStorage.setItem("dentaderm_voted_article_id", articleId);
    } catch (e) {
      renderError(container, e.message);
    }
  }

  if (storedArticleId === articleId) {
    renderSuccess(wrapper, articleId);
  } else {
    renderRatingBanner(wrapper, articleId);
  }
};

new WOW({
  scrollContainer: ".page",
}).init();

const initQuestionnaireForm = () => {
  const formElement = document.querySelector(".questionnaire-form");

  if (!formElement) return;

  const selects = formElement.querySelectorAll(".nice-select");
  const selectInstances = Array.from(selects).map((select) =>
    NiceSelect.bind(select, {
      placeholder: false,
    })
  );

  const texElementsConfig = prepareFieldConfig(
    formElement,
    "[name^='text-'], [name^='sex'], [name^='birth-date']",
    [{ name: "required", message: "Це поле необхідно заповнити" }]
  );

  const radioElementsConfig = prepareFieldConfig(
    formElement,
    "[name^='radio-']",
    [{ name: "checked", message: "Необхідно обрати один з варіантів" }]
  );

  const emailElementsConfig = prepareFieldConfig(
    formElement,
    "[name^='email']",
    [
      { name: "required", message: "Необхідно вказати email" },
      { name: "email", message: "Не вірний email" },
    ]
  );

  new FormVaildator({
    formElement,
    controls: [
      ...texElementsConfig,
      ...radioElementsConfig,
      ...emailElementsConfig,
    ],
    validateOn: {
      change: true,
      input: true,
    },
    onSubmit: (e) => {
      const formData = new FormData(e.target);
      const pdfDefinition = createQuestionnairePDFConfig(formData);
      pdfMake.createPdf(pdfDefinition).open();

      // TODO: HANDLE FORM
    },
    onSubmitError: () => {
      const page = document.querySelector(".page");
      const errorMessages = document.querySelectorAll(".validator__error-item");

      if (errorMessages.length !== 0) {
        page.scrollTo({
          top: errorMessages[0].offsetTop - 350,
          behavior: "smooth",
        });
      }
    },
    onReset: (e) => {
      selectInstances.forEach((instance) => instance.update());
    },
    onErrorChange: handleFormValidityChange,
  });

  // If customer is younger than 18 show field for custodian name
  const birthDateField = formElement.querySelector("[name='birth-date']");
  const custorianField = formElement.querySelector("#custodian_name");

  custorianField.style.display = birthDateField.value
    ? isAdult(birthDateField.value)
      ? "none"
      : "block"
    : "none";

  birthDateField.addEventListener("change", (e) => {
    console.log("change");
    custorianField.style.display = e.currentTarget.value
      ? isAdult(e.currentTarget.value)
        ? "none"
        : "block"
      : "none";
  });

  // Change question dropdown visibility if corresponding radio elem is checked
  const radioItems = formElement.querySelectorAll(".questionnaire-form__radio");
  radioItems.forEach((item) => {
    const parentContainer = item.closest(".questionnaire-form__question");
    const dropdownContainer = parentContainer.querySelector(
      ".questionnaire-form__dropdown"
    );

    if (!dropdownContainer) return;

    dropdownContainer.style.display =
      item.checked && item.value === "Так" ? "block" : "none";

    item.addEventListener("change", (e) => {
      if (e.currentTarget.checked && e.currentTarget.value === "Ні") {
        const controls = dropdownContainer.querySelectorAll(".input-text");
        const radios = dropdownContainer.querySelectorAll(
          ".questionnaire-form__radio"
        );

        radios.forEach((radio) => (radio.checked = false));
        controls.forEach((controls) => (controls.value = ""));
      }

      dropdownContainer.style.display =
        e.currentTarget.checked && e.currentTarget.value === "Так"
          ? "block"
          : "none";
    });
  });

  // Show female only section if corresponding select value is selected
  const femaleOnlySection = formElement.querySelector("#female-only");
  const sexSelect = formElement.querySelector("[name='sex']");

  handleFemaleOnlySection(sexSelect);

  sexSelect.addEventListener("change", (e) =>
    handleFemaleOnlySection(e.currentTarget)
  );

  function handleFemaleOnlySection(selectEl) {
    if (selectEl.value !== "female") {
      const dropdowns = femaleOnlySection.querySelectorAll(
        ".questionnaire-form__dropdown"
      );
      const radios = femaleOnlySection.querySelectorAll(
        ".questionnaire-form__radio"
      );
      const controls = femaleOnlySection.querySelectorAll(".input-text");

      radios.forEach((radio) => (radio.checked = false));
      controls.forEach((controls) => (controls.value = ""));
      dropdowns.forEach((dropdown) => (dropdown.style.display = "none"));
    }

    femaleOnlySection.style.display =
      selectEl.value === "female" ? "block" : "none";
  }
};

function isAdult(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  let monthDiff = today.getMonth() - birth.getMonth();
  let dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 18;
}

function prepareFieldConfig(formElement, selector, config) {
  const fieldElements = formElement.querySelectorAll(selector);
  const fieldElementsConfigs = Array.from(fieldElements)
    .filter((elem, index, arr) => {
      const targetIndex = arr.findIndex(
        (targetElem) => targetElem.name === elem.name
      );
      return index === targetIndex;
    })
    .map((elem) => ({
      name: elem.name,
      validities: config,
    }));

  return fieldElementsConfigs;
}

function handleFormValidityChange({ controls, errors }) {
  Object.entries(controls).forEach(([controlName, controlEls]) => {
    const errorsList = errors[controlName];
    const hasErrors = errorsList.length !== 0;
    const parentWrapper = controlEls[0].element.closest(
      "[data-validity-group]"
    );

    const errorContainer =
      parentWrapper.querySelector(".validator__errors") ||
      createErrorContainer();
    parentWrapper.append(errorContainer);

    if (hasErrors) {
      errorContainer.innerHTML = "";
      errorsList.forEach((error) => {
        errorContainer.innerHTML += `<p class="validator__error-item">${error}</p>`;
      });
    } else {
      errorContainer.innerHTML = "";
    }
  });

  function createErrorContainer() {
    const container = document.createElement("div");
    container.classList.add("validator__errors");
    return container;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  articleRating();
  initMap();
  tabs();
  initCardCarousel();
  initReviewSlider();
  fluidLabel();
  initMenu();
  initFancyBox();
  initAccordion();
  initAppointmentForms();
  initConnectedCarousel();
  initHeroSlider();
  toggleExpand(".expand-container");
  toggleExpand(".ceo-container", "Читати повністю", "згорнути");
  initYouTubeVideo();
  stickyHeader();
  initCharitySlider();
  initSmoothScrollToAnchor();
  initBeforeAfterSlider();
  initReviewCarousel();
  initReviewCarouselAlt();
  pageNavigation();
  serviceSearch();
  serviceSearch();
  initQuestionnaireForm();
  new Modal(".modal", null, (activeModal) => {
    const appointmentForm = activeModal.querySelector(".appointment-form");
    appointmentForm?.reset();
  });
});

function createQuestionnairePDFConfig(formData) {
  const mappedFormData = new FormData();
  for ([key, value] of formData) {
    mappedFormData.append(key, !!value ? value : "—");
  }
  const data = Object.fromEntries(mappedFormData);

  return {
    header: (currentPage, pageCount) => [
      {
        absolutePosition: { x: 0, y: 30 },
        columns: [
          {
            svg: `
              <svg  width="62" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 94 72" style="enable-background:new 0 0 94 72;" xml:space="preserve">
              <path d="M46.1,34.2l0.8,2.1h-1.7L46.1,34.2L46.1,34.2z M69.5,34.9c0-0.3-0.1-0.5-0.3-0.6c-0.2-0.1-0.4-0.2-0.7-0.2h-1.2v1.7h1.1
                c0.3,0,0.6-0.1,0.7-0.2C69.4,35.4,69.5,35.2,69.5,34.9z M75.7,65.4c-17.3,11.3-40.1,7.7-53.2-7.7c-1.8-2.1-4.9-2.6-7.3-1.1l-3.7,2.4
                c-2.8,1.8-6.7,0.8-8-2.3C-4.5,39,1.4,17.6,18.3,6.6c17.3-11.3,40.1-7.7,53.2,7.7c1.8,2.1,4.9,2.6,7.3,1.1l3.7-2.4
                c2.8-1.8,6.7-0.8,8,2.3C98.5,32.9,92.6,54.4,75.7,65.4z M18.5,35.6c0-0.3,0-0.6-0.1-0.9c-0.1-0.3-0.3-0.5-0.5-0.7
                c-0.2-0.2-0.4-0.3-0.7-0.4c-0.3-0.1-0.6-0.1-0.9-0.2h-1.5v4.2h1.5c0.3,0,0.6,0,0.9-0.1c0.3-0.1,0.5-0.3,0.7-0.4
                c0.2-0.2,0.3-0.4,0.5-0.7C18.4,36.2,18.5,35.9,18.5,35.6z M25.5,37.2H23v-1.4h2.2v-0.5H23v-1.2h2.4v-0.5h-3.1v4.2h3.2V37.2z
                M33.2,33.5h-0.6v3.3L30,33.5h-0.6v4.2h0.6v-3.2l2.5,3.2h0.6V33.5z M40.8,33.5H37v0.6h1.6v3.7h0.6v-3.7h1.6V33.5z M48.2,37.8
                l-1.8-4.2h-0.8l-1.8,4.2h0.7l0.4-1h2.2l0.4,1H48.2z M55.8,35.6c0-0.3,0-0.6-0.1-0.9c-0.1-0.3-0.3-0.5-0.5-0.7
                c-0.2-0.2-0.4-0.3-0.7-0.4c-0.3-0.1-0.6-0.1-1-0.2H52v4.2h1.5c0.3,0,0.6,0,0.9-0.1c0.3-0.1,0.5-0.3,0.7-0.4c0.2-0.2,0.3-0.4,0.5-0.7
                C55.7,36.2,55.8,35.9,55.8,35.6z M62.9,37.2h-2.6v-1.4h2.2v-0.5h-2.2v-1.2h2.4v-0.5h-3.1v4.2h3.2V37.2z M70.3,37.7l-1.1-1.6
                c0.3-0.1,0.5-0.2,0.7-0.5c0.2-0.2,0.3-0.5,0.3-0.8c0-0.2,0-0.4-0.1-0.6c-0.1-0.2-0.2-0.3-0.3-0.4c-0.1-0.1-0.3-0.2-0.5-0.3
                c-0.2-0.1-0.4-0.1-0.7-0.1h-1.8v4.2h0.7v-1.4h1.2l1,1.4H70.3z M78.5,33.5h-0.7l-1.5,2.2l-1.4-2.2h-0.7v4.2h0.6v-3.3h0.1l1.3,2h0.3
                l1.3-2h0.1v3.3h0.6V33.5z M53.5,34.1h-0.8v3.1h0.8v0c0.2,0,0.5,0,0.7-0.1c0.2-0.1,0.4-0.2,0.5-0.3c0.1-0.1,0.3-0.3,0.3-0.5
                c0.1-0.2,0.1-0.4,0.1-0.7c0-0.5-0.1-0.9-0.4-1.2C54.5,34.2,54,34.1,53.5,34.1z M16.2,34.1h-0.8v3.1h0.8v0c0.2,0,0.5,0,0.7-0.1
                c0.2-0.1,0.4-0.2,0.5-0.3c0.1-0.1,0.3-0.3,0.3-0.5s0.1-0.4,0.1-0.7c0-0.5-0.1-0.9-0.4-1.2C17.1,34.2,16.7,34.1,16.2,34.1z"/>
              </svg>
          `,
            margin: [40, -10, 0, 0],
          },
          {
            text: [
              "вул. Вишгородська/Полярна 56/2 (літера А), прим. 110, м. Київ\n",
              "вул. Кловський узвіз, буд. 7 (літера А), м. Київ\n",
              "вул. Соборна, 107, прим. 37, м. Ірпінь, Київська обл.\n",
              "+38 (097) 420-30-30\n",
              "info@dentaderm.ua\n",
              "https://www.dentaderm.ua",
            ],
            style: "headerRight",
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 40,
            y1: 90,
            x2: 555,
            y2: 90,
            lineWidth: 1,
            color: "gray",
          },
        ],
      },
    ],
    footer: (currentPage, pageCount) => [
      {
        canvas: [
          {
            type: "line",
            x1: 40,
            y1: 15,
            x2: 555,
            y2: 15,
            lineWidth: 1,
            color: "gray",
          },
        ],
      },
      {
        margin: [0, 10, 0, 0],
        columns: [
          {
            text: `© Dentaderm ${new Date().getFullYear()}`,
            style: ["footerLeft", "fontSmall"],
          },
          {
            text: `Сторінка ${currentPage} з ${pageCount}`,
            style: ["footerRight", "fontSmall"],
          },
        ],
      },
    ],
    pageMargins: [40, 110, 40, 60],
    content: [
      { text: "Візитна картка пацієнта", style: ["header1", "textCenter"] },
      {
        text: [
          "Я, ",
          {
            text: `${data["text-01"]} ${data["text-02"]} ${data["text-03"]}`,
            style: "italic",
          },
        ],
        style: "paragraph",
      },
      {
        text: [
          "Дата та рік народження: ",
          { text: `${data["birth-date"]}, `, style: "italic" },
          "адреса проживання: ",
          { text: data["text-07"], style: "italic" },
        ],
        style: "paragraph",
      },
      {
        text: [
          "Контактний телефон: ",
          {
            text: `${data["text-06"]}, `,
            style: ["italic"],
          },
          "email: ",
          {
            text: data["email"],
            link: `mailto:${data["email"]}`,
            style: "italic",
          },
        ],
        style: "paragraph",
      },
      {
        text: [
          data["text-05"] !== "—"
            ? "Прізвище, ініціали законного представника (для пацієнтів до 18 років): "
            : "",
          data["text-05"] !== "—"
            ? { text: data["text-05"], style: "italic" }
            : "",
        ],
        style: "paragraph",
      },
      {
        text: "надаю добровільну згоду на:",
        style: ["paragraph", "bold"],
      },
      {
        style: "list",
        ul: [
          {
            text: 'проведення обстеження і діагностики (рентгенодіагностика, фото- та відеодіагностика, діагностика тканин пародонту із застосуванням інфільтраційної анестезії (за потребою), апаратурна діагностика тощо) мене або моєї дитини з подальшим виготовленням діагностичної моделі та складанням плану лікування; відеозйомку із аудіозаписом із збереженням результатів, які проводяться за допомогою камер відеоспостереження на території ПП "Дента Дерм", ТОВ "Дента-Д". Збір, обробка, використання та зберігання моїх персональних даних персоналом ПП "Дента Дерм", ТОВ "Дента-Д" здійснюються в цілях охорони здоров’я, для забезпечення лікування і надання медичних послуг та в цілях охорони як допоміжний засіб запобігання протиправним діям;',
            style: "listItem",
          },
          {
            text: 'використання фото- та відеорезультатів мого лікування для комунікації між медичними та іншими працівниками ПП "Дента Дерм", ТОВ "Дента-Д" в лікувальних та інших цілях; відправлення мені на ознайомлення планів лікування та/або інших документів медичного характеру у будь-який месенджер (Telegram, Viber, WhatsApp), прив’язаний до мого номеру телефону;',
            style: "listItem",
          },
          {
            text: "лікування під час встановленого в Україні режиму воєнного стану та карантину у зв’язку із пандеміями та епідеміями. Я розумію та погоджуюся, що через застосування вищезазначених обмежувальних заходів, а також особливий режим роботи та обслуговування пацієнтів, існує ймовірність, що я не зможу отримати стоматологічну допомогу у повному обсязі, але я все одно надаю свою згоду на проведення лікування.",
            style: "listItem",
          },
        ],
      },
      {
        text: "Своїм власним підписом я також підтверджую факт ознайомлення з наступними документами правового характеру, які знаходяться в Куточку споживача:",
        style: ["paragraph", "bold"],
      },
      {
        style: "list",
        ul: [
          {
            text: 'Публічний договір-оферта про надання медичних стоматологічних послуг, затверджений Наказом директора ПП "Дента Дерм" від 01.09.2023 р. №1-МЗ, Наказом директора ТОВ "Дента-Д" від 02.10.2023 р. №1-МЗ;',
            style: "listItem",
          },
          {
            text: 'Перелік та вартість послуг (Прейскурант) ПП "Дента Дерм", ТОВ "Дента-Д";',
            style: "listItem",
          },
          {
            text: 'Правила внутрішнього розпорядку (перебування та обслуговування пацієнтів) в Медичному центрі ПП "Дента Дерм", затвердженіНаказом директора ПП "Дента Дерм" від 01.09.2023 р. №2-МЗ, Наказом директора ТОВ "Дента-Д" від 02.10.2023 р. №2-МЗ;',
            style: "listItem",
          },
          {
            text: 'Положення про гарантійні зобов’язання Медичного центру ПП "Дента Дерм", затверджене Наказом директора від 01.09.2023 р.№1-МЗ, Медичного центру ТОВ "Дента-Д", затверджене Наказом директора ТОВ "Дента-Д" від 02.10.2023 р. №2-МЗ',
            style: "listItem",
          },
          {
            text: 'Основні споживчі властивості на основні стоматологічні послуги Медичного центру ПП "Дента Дерм", затверджені Наказом директора від 01.09.2023 р. №2-МЗ, Медичного центру ТОВ "Дента-Д", затверджені Наказом директора від 02.10.2023 р. № 2-МЗ.',
            style: "listItem",
          },
        ],
      },
      {
        text: "Дата   _________________________________________________",
        style: "signatureText",
        margin: [10, 25, 0, 14],
      },
      {
        text: "Підпис пацієнта   ______________________________________",
        style: "signatureText",
        margin: [10, 10, 0, 20],
      },
      { text: "", pageBreak: "before" },
      { text: "Анкета про стан здоров'я", style: ["header1", "textCenter"] },
      {
        text: `${data["text-01"]} ${data["text-02"]} ${data["text-03"]}`,
        style: ["header2", "textCenter"],
      },
      { text: "Серцево-судинноі захворювання", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Чи маєте Ви підвищений / понижений тиск?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-02"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Який саме",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["text-radio-02"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви кардіостимулятор?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-03"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви захворювання серця, порушення серцевого ритму?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-04"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви вроджені вади серця?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-05"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви в анамнезі перенесені інфаркт / інсульт?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-06"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      {
        text: "Чи Ви хворієте або хворіли наступними хворобами:",
        style: "header2",
      },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Цукровий діабет",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-07"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання крові (тривалі кровотечі, незгортання крові, анемія тощо)",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-08"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання очей (глаукома, відшарування сітківки тощо)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-09"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "ЛОР-захворювання (гайморит, синусит тощо)",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-10"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Онкологічні захворювання",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-11"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання дихальної системи",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-12"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Нервові захворювання",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-13"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання печінки",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-14"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Ревматизм, артрит, болі в суглобах, суглобове протезування",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-15"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання щитоподібної залози",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-16"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання нирок",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-17"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання шлунково-кишкового тракту",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-18"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Туберкульоз",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-19"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Гепатит (жовтяниця) А, В, С. (Зазначте який тип та рік захворювання)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-20"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Тип гепатиту",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["text-radio-20"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "СНІД (AIDS)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-21"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Герпетичні ураження губ",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-22"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Скільки разів на рік?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["text-radio-22"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання шкіри (псоріаз, екзема, невідомого походження, тощо)",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-23"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Чи були у Вас напади епілепсії?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-24"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи приймаєте Ви ліки, що покращують / погіршують згортання крові?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-25"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи приймаєте Ви будь-які інші медикаменти?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-26"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви непереносимість до окремих ліків?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-27"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи Ви палите?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-28"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи Ви вживаєте міцні алкогольні напої частіше двох разів на тиждень?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-29"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи вживаєте Ви наркотичні речовини?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-30"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи вживаєте Ви психотропні речовини, в т.ч. транквілізатори, антидепресанти?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-31"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте наразі будь-які інші захворювання?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-32"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи були у Вас або маєте неприємні відчуття в суглобах нижньої щелепи? (Якщо так, то оберіть, які саме: біль / клацання / шум / інший дискомфорт)",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-33"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи були Ви оперовані?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-34"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "інтубація була проведена через:",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-35"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви шкідливі звички, пов’язані із зубами (гризете олівці, ручки, губи, щоки, нігті, скрегіт або надмірне стискання зубів)?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-36"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи відчували Ви самовільні больові відчуття в зубах, які через деякий час проходили без звернення до лікаря-стоматолога?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-37"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Стосується тільки жінок:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Ви вагітні? (Якщо так, то вкажіть термін)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-38"] || "—",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Строк вагітності",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["text-radio-38"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи годуєте Ви груддю?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-39"] || "—",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте розлади меноциклу, в т.ч. клімакс, менопауза?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-40"] || "—",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи приймаєте Ви пероральні контрацептиви?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-41"] || "—",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Протягом якого часу?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["text-radio-41"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      {
        text: "Алергологічний анамнез (згідно з Наказом МОЗ України від 30.12.2015 № 916). Чи скаржитеся Ви на:",
        style: "header2",
      },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Напади ядухи (задишка, спричинювана деякими захворюваннями серця або бронхів; астма)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-42"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Задишки чи тяжкого дихання",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-43"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Задушливого кашлю",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-44"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Періодичні хрипи (свисти), які чути на відстані",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-45"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Часту чи постійну закладеність носа",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-46"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Виділення з носа без простуди",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-47"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Висипи на шкірі",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-48"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Почервоніння шкіри",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-49"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Набряки шкіри",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-50"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Відчуття свербежу шкіри",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-51"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Болі у животі",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-52"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Нудота",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-53"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Алергічний дерматит",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-54"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Часті діареї",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-55"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Втрата свідомості",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-56"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Помітне різке зниження артеріального тиску",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-57"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Затруднення дихання",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-58"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "В який період виникають скарги?",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-59"] || "—",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Чи скаржитеся Ви на:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Свербіння та / або почервоніння очей",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-60"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Свербіння та / або почервоніння повік",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-61"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Свербіння та / або почервоніння носа",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-62"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Усі вищенаведені скарги виникають після:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Застосування ЛЗ (лікарських засобів)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-63"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Харчових продуктів",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-64"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Побутової хімії",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-65"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Контакту з різними речовинами на виробництві",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-66"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "інші речовини",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-67"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "У Вас раніше були виявлені:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Бронхіальна астма",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-68"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Алергічний риніт",
                style: ["fontSmall", "cell"],
              },
              {
                text: data["radio-69"],
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Небезпечні реакції на укуси комах",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-70"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Непереносимість харчових продуктів:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Чи існують харчові продукти, харчові домішки, які Ви не переносите?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: data["radio-70"],
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Інші скарги:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: data["issues"],
                style: ["cellGray100", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      {
        text: "Дата   _________________________________________________",
        style: "signatureText",
        margin: [0, 25, 0, 14],
      },
      {
        text: "Підпис пацієнта   ______________________________________",
        style: "signatureText",
        margin: [0, 10, 0, 20],
      },
      {
        text: "Лікарі, які ознайомлені з анамнезом пацієнта:",
        style: "header2",
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 18, 0, 16],
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 10, 0, 14],
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 10, 0, 14],
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 10, 0, 14],
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 14, 0, 0],
      },
    ],
    styles: {
      header1: {
        fontSize: 13,
        bold: true,
        margin: [0, 0, 0, 14],
      },
      header2: {
        fontSize: 11,
        bold: true,
        margin: [0, 5, 0, 5],
      },
      paragraph: {
        fontSize: 8,
        margin: [0, 0, 0, 12],
      },
      textCenter: {
        alignment: "center",
      },
      list: {
        margin: [0, 0, 0, 12],
      },
      listItem: {
        fontSize: 8,
        margin: [0, 0, 0, 6],
      },
      signatureLine: {
        margin: [60, 0, 60, 0],
      },
      signatureText: {
        fontSize: 7,
        italics: true,
      },
      spacer: {
        fontSize: 8,
        margin: [0, 8, 0, 0],
      },
      table: {
        margin: [0, 4, 0, 12],
      },
      cellGray100: {
        fillColor: "#e9e9e9",
      },
      cellHead: {
        fillColor: "#555",
        color: "white",
        margin: [2, 2, 2, 2],
      },
      cell: {
        margin: [2, 1, 2, 1],
      },
      fontSmall: {
        fontSize: 7,
      },
      bold: {
        bold: true,
      },
      italic: {
        italics: true,
      },
      footer: {
        border: [false, true, false, false],
        borderColor: "#000000",
      },
      footerLeft: {
        italics: true,
        alignment: "left",
        margin: [40, 0, 0, 0],
      },
      footerRight: {
        alignment: "right",
        margin: [0, 0, 40, 0],
        color: "gray",
      },
      headerLeft: {
        alignment: "left",
        margin: [40, 0, 0, 0],
      },
      headerRight: {
        alignment: "right",
        margin: [0, 0, 40, 0],
        fontSize: 7,
      },
    },
  };
}
