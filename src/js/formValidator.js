class FormVaildator {
  #isValid = false;
  #isSubmitting = false;
  #validateOn = {
    change: true,
    blur: false,
    focus: false,
    input: false,
  };

  constructor({
    formElement,
    controls = [],
    onSubmit,
    onReset,
    validateOn = {},
    onErrorChange,
    onSubmitError,
  }) {
    this.formElement = null;
    this.controls = {};
    this.errors = {};
    this.tooltips = {};
    this.validities = {};
    this.onErrorChange = onErrorChange;

    this.#validateOn = { ...this.#validateOn, ...validateOn };
    this.#init(formElement, controls, onSubmit, onReset, onSubmitError);
  }

  #handleValidateOn() {
    const eventEntries = Object.entries(this.#validateOn);

    eventEntries.forEach(([eventType, shouldTrigger]) => {
      if (shouldTrigger) {
        const controlsEntries = Object.entries(this.controls);

        controlsEntries.forEach((entry) => {
          const [name, controls] = entry;

          controls.forEach((control) => {
            control.element.addEventListener(eventType, () => {
              control.touched = true;
              this.checkControlValidity(name);
            });
          });
        });
      }
    });
  }

  #init(formElement, controls, onSubmit, onReset, onSubmitError) {
    this.#initForm(formElement, onSubmit, onReset, onSubmitError);
    this.#initControls(controls);
    this.#handleValidateOn();

    Object.keys(this.controls).forEach((name) =>
      this.checkControlValidity(name)
    );
  }

  #initForm(formElement, onSubmit, onReset, onSubmitError) {
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
      } else {
        onSubmitError?.();
      }
    });

    this.formElement = formElement;
  }

  #initControls(controls) {
    controls.forEach((control) => {
      const { name, tooltips = [], validities = [], touched = false } = control;

      const elements = this.formElement.querySelectorAll(`[name="${name}"]`);
      elements.forEach((element) => element.classList.add("validator__field"));

      this.controls[name] = Array.from(elements).map((element) => ({
        element,
        touched,
      }));

      this.errors[name] = [];

      this.tooltips[name] = tooltips;
      this.validities[name] = validities;
    });
  }

  checkFormValidity() {
    const controls = Object.keys(this.controls);
    controls.forEach((name) => this.checkControlValidity(name));

    this.#isValid = Object.values(this.errors).every(
      (errors) => errors.length === 0
    );
  }

  setError(name, message) {
    const errors = this.errors[name];
    if (!errors.includes(message)) {
      errors.push(message);
    }

    this.onErrorChange?.({ controls: this.controls, errors: this.errors });
  }

  clearError(name) {
    this.controls[name].forEach((control) =>
      control.element.classList.remove("validator__field-error")
    );
    this.errors[name] = [];

    this.onErrorChange?.({ controls: this.controls, errors: this.errors });
  }

  checkControlValidity(name) {
    const validityChecks = {
      name: (value) => value.length === 0 || value.match(/^[a-z ,.'-]+$/i),
      minLength: (value, minLength) =>
        value.length === 0 || value.length >= minLength,
      email: (value) =>
        value.length === 0 || value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g),
      password: (value) =>
        value.length === 0 ||
        value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      required: (value) => !!value.trim(),
      checked: (value, validityValue, element) => element.checked,
      match: (value, name) => {
        const targetControl = this.controls[name].element;
        return value.length === 0 || value === targetControl.value;
      },
    };

    this.clearError(name);

    this.validities[name].forEach((validity) => {
      const checkFn = validityChecks[validity.name];

      const isRadio = this.controls[name].every(
        (control) => control.element.type === "radio"
      );

      if (isRadio && validity.name === "checked") {
        const touched = this.controls[name].some((control) => control.touched);
        const isChecked = this.controls[name].some((control) => {
          const { element } = control;
          const { value } = element;
          const isValid = validityChecks.checked(
            value,
            validity.value,
            element
          );
          return isValid;
        });

        if (
          this.controls[name].every((control) => control.element.offsetParent)
        ) {
          if ((!isChecked && touched) || (!isChecked && this.#isSubmitting)) {
            this.setError(name, validity.message);
          }
        }
      } else {
        this.controls[name].forEach((control) => {
          const { element, touched } = control;
          const { value } = element;

          if (element.offsetParent) {
            const isValid = checkFn(value, validity.value, element);

            if ((!isValid && touched) || (!isValid && this.#isSubmitting)) {
              this.setError(name, validity.message);
            }
          }
        });
      }
    });
  }
}
