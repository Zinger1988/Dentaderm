const initMap = () => {
  maptilersdk.config.apiKey = "bZSD1sQDv0eSO7OJuHXT";
  const map = new maptilersdk.Map({
    container: "map",
    style:
      "https://api.maptiler.com/maps/4d844cf8-762e-4501-bf23-f367565743c9/style.json?key=bZSD1sQDv0eSO7OJuHXT",
    center: [30.3878189, 50.4959581], // starting position [lng, lat]
    zoom: 9,
    navigationControl: false,
  });

  const el = document.createElement("div");
  el.className = "marker";
  el.style.backgroundImage = "url(/assets/images/marker.svg)";
  el.style.width = "36px";
  el.style.height = "36px";

  el.addEventListener("click", function () {
    window.alert(marker.properties.message);
  });

  const coords = [
    [30.4511244, 50.5203333],
    [30.5386361, 50.4385711],
    [30.2384241, 50.5206251],
  ];

  const clinics = [
    {
      label: "вул. Вишгородська, 56/2",
      coords: [30.4511244, 50.5203333],
    },
    {
      label: "вул. Кловський узвіз, 7а",
      coords: [30.5386361, 50.4385711],
    },
    {
      label: "вул. Соборна, 107",
      coords: [30.2384241, 50.5206251],
    },
  ];

  clinics.forEach((coord) => {
    const { label, coords } = coord;
    const element = el.cloneNode(true);
    // element.addEventListener("click", function () {
    //   window.alert(coord.label);
    // });
    new maptilersdk.Marker({ element }).setLngLat(coords).addTo(map);
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

const initCardCarousel = () => {
  const sliderSelector =
    ".card-carousel--doctors .card-carousel__swiper, .card-carousel--blog .card-carousel__swiper, .card-carousel--awards .card-carousel__swiper";
  const sliderContainer = document.querySelectorAll(sliderSelector);

  if (sliderContainer.length === 0) {
    return;
  }

  const baseOptions = {
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

  new Swiper(".card-carousel--demo .card-carousel__swiper", {
    ...baseOptions,
    ...demoCarouselOptions,
  });

  new Swiper(".card-carousel--awards .card-carousel__swiper", {
    ...baseOptions,
    ...awardsCarouselOptions,
  });

  new Swiper(
    ".card-carousel--doctors .card-carousel__swiper, .card-carousel--blog .card-carousel__swiper",
    {
      ...baseOptions,
      ...doctorsCarouselOptions,
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
    grabCursor: true,
    slidesPerView: 1,
    autoHeight: true,
  });

  const wrapper = swiper.el.closest(".hero-section");
  const customPagination = wrapper.querySelector(".pagination__list");
  const cardCarouselNextBtn = wrapper.querySelector(".pagination__btn--next");
  const cardCarouselPrevBtn = wrapper.querySelector(".pagination__btn--prev");

  cardCarouselNextBtn.addEventListener("click", () => swiper.slideNext());
  cardCarouselPrevBtn.addEventListener("click", () => swiper.slidePrev());
  swiper.on("slideChange", () => updatePagination(customPagination, swiper));

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

const initNiceSelect = () => {
  const selects = document.querySelectorAll(".nice-select");

  selects.forEach((select) => {
    NiceSelect.bind(select, {
      placeholder: false,
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

const toggleExpand = (btnDefaultText, btnActiveText) => {
  const containers = document.querySelectorAll(".expand-container");

  if (!containers.length) {
    return;
  }

  containers.forEach((container) => {
    const btn = container.querySelector(".expand-container__btn");
    const panel = container.querySelector(".expand-container__panel");

    if (!panel || !btn) {
      return;
    }

    btn.addEventListener("click", (e) => {
      if (panel.style.maxHeight) {
        panel.classList.remove("panel-expanded");
        panel.style.maxHeight = null;
        btn.textContent = btnDefaultText ? btnDefaultText : "Розгорнути";
      } else {
        panel.classList.add("panel-expanded");
        panel.style.maxHeight = panel.scrollHeight + "px";
        console.log(btnActiveText);
        btn.textContent = btnActiveText ? btnActiveText : "Згорнути";
      }
    });
  });
};

const initFormValidator = () => {
  const appointmentForms = document.querySelectorAll(".appointment-form");

  appointmentForms.forEach((formElement) => {
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
      },
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
    grabCursor: true,
    slidesPerView: 1,
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

const initSmoothScroll = () => {
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

document.addEventListener("DOMContentLoaded", () => {
  initNiceSelect();
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
  toggleExpand();
  initYouTubeVideo();
  stickyHeader();
  initSmoothScroll();
});
