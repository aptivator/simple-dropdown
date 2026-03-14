import {beforeEach, describe, it, expect}    from 'vitest';
import {userEvent}                           from 'vitest/browser';
import {defineItems, registerSimpleDropdown} from '../../src';
import {setGlobalConfigs}                    from '../../src';
import {classes}                             from '../../src/_lib/classes';
import {libraryName}                         from '../../src/_lib/vars';
import {itemsNumbers}                        from '../_lib/vars';

let itemsrefNumbers = 'numbers';
setGlobalConfigs({defaultScrollBehavior: {behavior: 'instant'}});
defineItems(itemsrefNumbers, itemsNumbers);
registerSimpleDropdown();

describe('integration (within a form)', () => {
  let dropdownEl, fieldset, form, resetButton, submitButton;
  let simpleDropdownName = 'number';

  beforeEach(() => {
    document.body.innerHTML = `
      <form>
        <fieldset>
          <simple-dropdown name="${simpleDropdownName}" itemsref="${itemsrefNumbers}">
          </simple-dropdown>
        </fieldset>
        <button type="reset">Reset</button>
        <button type="submit">Submit</button>
      </form>
    `;

    form = document.getElementsByTagName('form')[0];
    dropdownEl = document.getElementsByTagName('simple-dropdown')[0];
    fieldset = document.getElementsByTagName('fieldset')[0];
    resetButton = document.querySelector('button[type="reset"]');
    submitButton = document.querySelector('button[type="submit"]');
  });

  describe('disabling', () => {
    it('disables a simple-dropdown when its ancestor fieldset is disabled', () => {
      expect(dropdownEl.disabled).toBeFalsy;
      fieldset.setAttribute('disabled', '');
      expect(dropdownEl.disabled).to.be.true;
    });

    it('does not undisable a simple-dropdown that was disabled via disabling of its fieldset when the latter is re-enabled', () => {
      expect(dropdownEl.disabled).toBeFalsy;
      fieldset.setAttribute('disabled', '');
      expect(dropdownEl.disabled).to.be.true;
      fieldset.removeAttribute('disabled');
      expect(dropdownEl.disabled).to.be.true;
    });
  });

  describe('removal', () => {
    it('removes an element from form and integrates it back', () => {
      dropdownEl.required = true;
      expect(form.checkValidity()).to.be.false;
      dropdownEl.remove();
      expect(form.checkValidity()).to.be.true;
      fieldset.appendChild(dropdownEl);
      expect(form.checkValidity()).to.be.false;
    });

    it('re-initializes event handling after adding a removed dropdown back', async () => {
      let selectionsWrapperEl = dropdownEl.querySelector(`.${classes.selectionsWrapper}`);
      dropdownEl.remove();
      fieldset.appendChild(dropdownEl);
      await userEvent.click(dropdownEl);
      expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
      dropdownEl.focus();
      expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.false;

      for(let i = 0, {length} = itemsNumbers; i < length; i++) {
        await userEvent.keyboard('[ArrowDown]');
      }

      expect(dropdownEl.value).to.equal(itemsNumbers.at(-1)[0]);
    });
  });

  describe('resetting', () => {
    it('resets an element to its initial (instantiated) value when a form is reset', async () => {
      let [value, label] = itemsNumbers.at(-1);
      let [newValue, newLabel] = itemsNumbers[0];
      let newDropdownEl = document.createElement(libraryName);
      newDropdownEl.value = value;
      newDropdownEl.items = itemsNumbers;
      fieldset.replaceChild(newDropdownEl, dropdownEl);
      let choiceEl = newDropdownEl.querySelector(`.${classes.choice}`);
      expect(choiceEl.innerText).to.equal(label);
      newDropdownEl.value = newValue;
      expect(choiceEl.innerText).to.equal(newLabel);
      await userEvent.click(resetButton);
      expect(choiceEl.innerText).to.equal(label);
    });
  });

  describe('submitting', () => {
    it('includes a simple-dropdown value in FormData', async () => {
      let [value] = itemsNumbers[1];
      let formData;

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        formData = new FormData(form);
      }, {once: true});

      dropdownEl.value = value;
      await userEvent.click(submitButton);
      expect(formData.get(simpleDropdownName)).to.equal(value);
    });
  });

  describe('validation', () => {
    it('affects the overall form validity', () => {
      expect(form.checkValidity()).to.be.true;
      dropdownEl.required = true;
      expect(form.checkValidity()).to.be.false;
      dropdownEl.value = itemsNumbers.at(-1)[0];
      expect(form.checkValidity()).to.be.true;
    });

    it('serves a validation message', () => {
      dropdownEl.required = true;
      expect(dropdownEl.validationMessage).to.equal(simpleDropdownName + ' is required');
    });

    it('indicates whether it will validate', () => {
      expect(dropdownEl.willValidate).to.be.true;
    });

    it('returns validity of an element itself', () => {
      expect(dropdownEl.checkValidity()).to.be.true;
      dropdownEl.required = true;
      expect(dropdownEl.checkValidity()).to.be.false;
    });

    it('reports validity', () => {
      expect(dropdownEl.reportValidity()).to.be.true;
    });
  });

  describe('form-related getters and methods', () => {
    describe('form', () => {
      it('returns a form with which it is associated', () => {
        expect(dropdownEl.form).to.equal(form);
      });
    });

    describe('type', () => {
      it(`provides the element's name`, () => {
        expect(dropdownEl.type).to.equal(libraryName);
      });
    });
  });
});
