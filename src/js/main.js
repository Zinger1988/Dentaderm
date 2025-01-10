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
    const marker = new maptilersdk.Marker({ element }).setLngLat(coords).addTo(map);

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
      labelItems.find((item) => item.classList.contains("active")) || labelItems[0];

    const contentWrapper = item.querySelector(".tabs-content");

    function setActiveTab(labelItems, activeLabel, contentWrapper) {
      activeLabel.classList.add("active");

      labelItems.forEach((label) => {
        if (label !== activeLabel) {
          label.classList.remove("active");
        }
      });

      const tabId = activeLabel.dataset.tabTarget;
      const contentItems = contentWrapper.querySelectorAll(".tabs-content-item");
      const activeContent = contentWrapper.querySelector(`[data-tab-content=${tabId}]`);

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

  const reviewsCarousel = new Swiper(".reviews-carousel .reviews-carousel__swiper", {
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
  });

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
  const customPagination = wrapper.querySelector(".reviews-section__pagination");
  const reviewsCarousel = new Swiper(".reviews-carousel--alt .reviews-carousel__swiper", {
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
        const carouselNextBtn = wrapper.querySelector(".reviews-section__nav-btn--next");
        const carouselPrevBtn = wrapper.querySelector(".reviews-section__nav-btn--prev");

        carouselNextBtn.addEventListener("click", () => swiper.slideNext());
        carouselPrevBtn.addEventListener("click", () => swiper.slidePrev());
      },
    },
  });

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

        const cardCarouselNextBtn = wrapper.querySelector(".card-carousel__nav--next");
        const cardCarouselPrevBtn = wrapper.querySelector(".card-carousel__nav--prev");

        cardCarouselNextBtn.addEventListener("click", () => swiper.slideNext());
        cardCarouselPrevBtn.addEventListener("click", () => swiper.slidePrev());
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

  const demoCarousel = new Swiper(".card-carousel--demo .card-carousel__swiper", {
    ...baseOptions,
    ...demoCarouselOptions,
  });

  const awardsCarousel = new Swiper(".card-carousel--awards .card-carousel__swiper", {
    ...baseOptions,
    ...awardsCarouselOptions,
  });

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

  const discountCarousel = new Swiper(".card-carousel--discount .card-carousel__swiper", {
    ...baseOptions,
    ...discountCarouselOptions,
  });
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

const initFormValidator = () => {
  const appointmentForms = document.querySelectorAll(".appointment-form");

  appointmentForms.forEach((formElement) => {
    const select = formElement.querySelector(".nice-select");
    const selectInstance = NiceSelect.bind(select, {
      placeholder: false,
    });

    // prettier-ignore
    new FormVaildator({
      formElement,
      controls: [
        {
          name: "clinic",
          validities: [{ name: "required", message: "Необхідно обрати клініку" }],
        },
        {
          name: "name",
          validities: [{ name: "required", message: "Необхідно вказати ім`я" }],
        },
        {
          name: "tel",
          validities: [{ name: "required", message: "Необхідно вказати номер телефону" }],
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
      }
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

  const imageSwiper = new Swiper(".connected-carousel__image-carousel .swiper", {
    lazy: true,
    grabCursor: false,
    effect: "flip",
    slidesPerView: 1,
    allowTouchMove: false,
  });

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

  textSwiper.on("slideChange", () => updatePagination(customPagination, textSwiper));

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

  nextNavBtns.forEach((btn) => btn.addEventListener("click", () => swiper.slideNext()));
  prevNavBtns.forEach((btn) => btn.addEventListener("click", () => swiper.slidePrev()));

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
  const beforeContainerEl = container.querySelector(".before-after__before-container");
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
  const navList = document.querySelector(".nav-content__list");

  if (containers.length === 0 || !navList) return;

  const navItems = [];
  let lastScrollPos = 0;

  const setActive = (entryNavId) => {
    navItems.forEach((navItem) => {
      const { navId: itemNavId } = navItem.dataset;

      entryNavId === itemNavId
        ? navItem.classList.add("nav-content__nav-item--active")
        : navItem.classList.remove("nav-content__nav-item--active");
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
          acc += cur.input.slice(cur.index + cur[0].length, cur.input.length + 1);
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
      target.scrollToRef.closest(".prices__link").classList.add("service-search-target");
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

    if (e.target !== dropdownList && !e.target.closest(".search-panel__dropdown")) {
      dropdownList.style = "";
    }

    if (
      activeSearchElem &&
      e.target !== dropdownList &&
      !e.target.classList.contains("search-panel__dropdown-link") &&
      !e.target.closest(".search-panel__dropdown-link") &&
      e.target !== activeSearchElem
    ) {
      activeSearchElem.closest(".prices__link").classList.remove("service-search-target");
    }
  });
};

const articleRating = () => {
  const wrapper = document.querySelector(".article-rating");

  if (!wrapper) return;

  const ratingEls = [];

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

  Array(10)
    .fill(null)
    .forEach((_, i) => {
      const elWrapper = document.createElement("div");
      elWrapper.classList.add("article-rating__star");
      elWrapper.innerHTML = `<svg class="article-rating__star-icon icon">
        <use href="assets/icons.svg#star-solid" />
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
        wrapper.setAttribute("data-mark", i + 1);
      });
    });

  wrapper.append(...ratingEls);

  wrapper.addEventListener("mouseleave", () => {
    const mark = parseInt(wrapper.getAttribute("data-mark")) || 0;

    ratingEls.forEach((el, i) => {
      if (i >= mark) {
        el.classList.remove("active");
      } else {
        el.classList.add("active");
      }
    });
  });
};

new WOW({
  scrollContainer: ".page",
}).init();

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
  initFormValidator();
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
  // calcNavContentMargin();
  new Modal(".modal", null, (activeModal) => {
    const appointmentForm = activeModal.querySelector(".appointment-form");
    appointmentForm?.reset();
  });
});
