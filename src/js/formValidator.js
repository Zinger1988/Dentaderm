class FormVaildator {
  #isValid = false;
  #isSubmitting = false;
  #validateOn = {
    change: true,
    blur: false,
    focus: false,
    input: false,
  };

  constructor({ formElement, controls = [], onSubmit, onReset, validateOn = {} }) {
    this.formElement = null;
    this.controls = {};
    this.errors = {};
    this.tooltips = {};
    this.validities = {};

    this.#validateOn = { ...this.#validateOn, ...validateOn };
    this.#init(formElement, controls, onSubmit, onReset);
  }

  #handleValidateOn() {
    const eventEntries = Object.entries(this.#validateOn);

    eventEntries.forEach(([eventType, shouldTrigger]) => {
      if (shouldTrigger) {
        const controlEntries = Object.entries(this.controls);

        controlEntries.forEach((entry) => {
          const [name, control] = entry;
          control.element.addEventListener(eventType, () => {
            control.touched = true;
            this.checkControlValidity(name);
          });
        });
      }
    });
  }

  #init(formElement, controls, onSubmit, onReset) {
    this.#initForm(formElement, onSubmit, onReset);
    this.#initControls(controls);
    this.#handleValidateOn();
    this.#renderTooltips();

    Object.keys(this.controls).forEach((name) => this.checkControlValidity(name));
  }

  #initForm(formElement, onSubmit, onReset) {
    formElement.noValidate = true;

    formElement.addEventListener("reset", (e) => {
      const controlsKeys = Object.keys(this.controls);
      controlsKeys.forEach((name) => {
        this.clearError(name);
      });

      onReset?.();
    });

    formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this.#isSubmitting = true;

      this.checkFormValidity();

      if (this.#isValid) {
        onSubmit(e);
      }
    });

    this.formElement = formElement;
  }

  #initControls(controls) {
    controls.forEach((control) => {
      const { name, tooltips = [], validities = [], touched = false } = control;

      const element = this.formElement.querySelector(`[name="${name}"]`);
      element.classList.add("validator__field");

      this.controls[name] = {
        element,
        touched,
      };

      this.errors[name] = {
        container: null,
        messages: [],
      };

      this.tooltips[name] = tooltips;
      this.validities[name] = validities;
    });
  }

  #renderError(name) {
    const { element } = this.controls[name];
    const errors = this.errors[name];

    if (!errors.container) {
      const container = document.createElement("div");
      container.classList.add("validator__errors");
      errors.container = container;
      element.after(container);
    }

    element.classList.add("validator__field--error");
    errors.container.innerHTML = "";
    errors.container.style = "";
    errors.messages.forEach((message) => {
      errors.container.innerHTML += `<p class="validator__error-item">${message}</p>`;
    });
  }

  #renderTooltips() {
    const entries = Object.entries(this.tooltips);

    entries.forEach(([name, tooltips]) => {
      const { element } = this.controls[name];

      const container = document.createElement("div");
      container.classList.add("validator__tooltips");
      element.after(container);

      tooltips.forEach((tooltip) => {
        container.innerHTML += `<p class="validator__error-item">${tooltip}</p>`;
      });
    });
  }

  checkFormValidity() {
    const controls = Object.keys(this.controls);
    controls.forEach((name) => this.checkControlValidity(name));

    this.#isValid = Object.values(this.errors).every(
      ({ messages }) => messages.length === 0
    );
  }

  setError(name, message) {
    const errors = this.errors[name];
    errors.messages.push(message);
    this.#renderError(name);
  }

  clearError(name) {
    const { element } = this.controls[name];
    const errors = this.errors[name];

    if (errors.container) {
      errors.container.innerHTML = "";
      errors.container.style.display = "none";
    }

    element.classList.remove("validator__field-error");
    errors.messages = [];
  }

  checkControlValidity(name) {
    // prettier-ignore
    const validityChecks = {
      name: (value) => value.length === 0 || value.match(/^[a-z ,.'-]+$/i),
      minLength: (value, minLength) => value.length === 0 || value.length >= minLength,
      email: (value) =>
        value.length === 0 || value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g),
      password: (value) =>
        value.length === 0 || value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      required: (value) => !!value.trim(),
      checked: (value, name, element) => element.checked,
      match: (value, name) => {
        const targetControl = this.controls[name].element;
        return value.length === 0 || value === targetControl.value;
      },
    };

    this.clearError(name);

    const { element, touched } = this.controls[name];
    const { value } = element;

    this.validities[name].forEach((validity) => {
      const checkFn = validityChecks[validity.name];
      const isValid = checkFn(value, validity.value, element);

      if ((!isValid && touched) || (!isValid && this.#isSubmitting)) {
        this.setError(name, validity.message);
      }
    });
  }
}
