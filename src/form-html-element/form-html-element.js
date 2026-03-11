export class FormHTMLElement extends HTMLElement {
  static formAssociated = true;

  #value;

  constructor(initialValue = '') {
    super();
    this._internals = this.attachInternals();
    this.#value = initialValue;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
  }

  get form() {
    return this._internals.form;
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(name) {
    this.setAttribute('name', name);
  }

  get type() {
    return this.localName;
  }

  get validity() {
    return this._internals.validity;
  }
  
  get validationMessage() {
    return this._internals.validationMessage;
  }

  get willValidate() {
    return this._internals.willValidate;
  }

  checkValidity() {
    return this._internals.checkValidity();
  }

  reportValidity() {
    return this._internals.reportValidity();
  }
}
