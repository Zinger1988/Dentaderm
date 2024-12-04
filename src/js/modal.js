class Modal {
  static modalElements = null;
  static activeModal = null;
  static modalOverlay = document.createElement("div");
  static callbacks = {
    onShowModal: (activeModal) => {},
    onHideModal: (activeModal) => {},
  };

  static preventScroll(e) {
    if (
      !e.target.classList.contains(".modal__main") &&
      !e.target.closest(".modal__main")
    ) {
      e.preventDefault();
    }
  }

  constructor(modalSelector, onShowModal, onHideModal) {
    Modal.modalElements = Array.from(document.querySelectorAll(modalSelector));
    Modal.modalOverlay.id = "modal-overlay";
    Modal.setHandlers();
    Modal.callbacks = { onShowModal, onHideModal };
  }

  static bindButton(buttonEl) {
    buttonEl.addEventListener("click", () => {
      if (Modal.activeModal) {
        Modal.hide();
      }
      const modalId = buttonEl.getAttribute("data-modal-id");
      Modal.show(modalId);
      Modal.showOverlay();
    });
  }

  static setHandlers() {
    const modalButtons = document.querySelectorAll("[data-modal-id]");

    modalButtons.forEach((button) => {
      Modal.bindButton(button);
    });

    Modal.modalOverlay.addEventListener("click", (e) => {
      Modal.callbacks.onHideModal?.(Modal.activeModal);
      Modal.hide();
      Modal.hideOverlay();
    });

    Modal.modalElements.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("modal-close") ||
          e.target.closest(".modal-close")
        ) {
          Modal.hide();
          Modal.hideOverlay();
        }
      });

      const modalMain = modal.querySelector(".modal__main");

      function preventModalScroll(e) {
        let scrollTo = null;
        e.stopPropagation();

        if (e.type === "wheel") {
          scrollTo = e.wheelDelta * -1;
        }

        if (scrollTo) {
          e.preventDefault();
          this.scrollTo({
            top: scrollTo + this.scrollTop,
            left: 0,
            behavior: "smooth",
          });
        }
      }

      // modalMain.addEventListener("wheel", preventModalScroll);
    });
  }

  static showOverlay() {
    const overlay = document.querySelector("#modal-overlay");
    if (overlay) return;

    document.body.append(Modal.modalOverlay);
    // window.addEventListener("wheel", Modal.preventScroll, {passive: false});
    document.body.classList.add("no-overflow");

    let alpha = 0.01;
    const timer = setInterval(() => {
      if (alpha >= 0.56) {
        clearInterval(timer);
      } else {
        Modal.modalOverlay.style.backgroundColor = `rgba(0,0,0, ${(alpha += 0.1)})`;
      }
    }, 20);
  }

  static hideOverlay() {
    const overlay = document.querySelector("#modal-overlay");
    if (!overlay) return;

    document.body.classList.remove("no-overflow");
    // window.removeEventListener("wheel", Modal.preventScroll, {passive: false});

    let alpha = 0.56;
    const timer = setInterval(() => {
      if (alpha <= 0.1) {
        overlay.remove();
        clearInterval(timer);
      } else {
        Modal.modalOverlay.style.backgroundColor = `rgba(0,0,0, ${(alpha -= 0.1)})`;
      }
    }, 20);
  }

  static show(modalId) {
    const targetModal = Modal.modalElements.find((element) => element.id === modalId);
    Modal.activeModal = targetModal;
    targetModal.classList.add("visible");
    Modal.callbacks.onShowModal?.(Modal.activeModal);
  }

  static hide() {
    const modalMain = Modal.activeModal.querySelector(".modal__main");

    if (modalMain.scrollTop > 0) {
      modalMain.scrollTo({
        top: scrollTo + modalMain.scrollTop,
        left: 0,
        behavior: "smooth",
      });
    }

    Modal.callbacks.onHideModal?.(Modal.activeModal);
    Modal.activeModal.classList.remove("visible");
    Modal.activeModal = null;
  }
}
