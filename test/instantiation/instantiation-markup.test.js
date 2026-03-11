import {afterAll, describe, it, expect}           from 'vitest';
import {defaultPlaceholder, defaultValue}         from '../../src/_lib/vars';
import {defineItems, registerSimpleDropdown}      from '../../src';
import {confirmRender, interceptMessages, render} from '../_lib/utils';
import {itemsNumbers}                             from '../_lib/vars';

let itemsrefNumbers = 'numbers';
let {messages, restoreOriginals} = interceptMessages();
defineItems(itemsrefNumbers, itemsNumbers);
registerSimpleDropdown();

describe('instantiation (markup)', () => {
  afterAll(restoreOriginals);

  describe('disabled', () => {
    it('indicates to remove pointer events and lower opacity when present', () => {
      let {dropdownEl} = render(['disabled']);
      let styles = getComputedStyle(dropdownEl);
      expect(styles.getPropertyValue('pointer-events')).to.equal('none');
      expect(+styles.getPropertyValue('opacity')).to.be.lessThan(1);
    });
  });

  describe('itemsref', () => {
    it('specifies what items (previously defined under an alias) to render', () => {
      let {selectionsEl} = render([['itemsref', itemsrefNumbers]]);
      let renderStatus = confirmRender(selectionsEl, itemsNumbers);
      expect(renderStatus).to.be.true;
    });

    it('errors when an unknown items reference is specified', () => {
      let unknownRef = 'some-unknown';
      render([['itemsref', unknownRef]]);
      expect(messages.error).to.include(`no items exist under the "${unknownRef}" reference`);
    });
  });

  describe('placeholder', () => {
    it('sets default placeholder when no placeholder and value are provided', () => {
      let {choiceEl} = render();
      expect(choiceEl.innerText).to.equal(defaultPlaceholder);
    });

    it('uses user-specified placeholder when no value is set', () => {
      let placeholder = 'Select a number';
      let {choiceEl} = render([['placeholder', placeholder]])
      expect(choiceEl.innerText).to.equal(placeholder);
      expect(placeholder).to.not.equal(defaultPlaceholder);
    });
  });

  describe('required', () => {
    it(`is set to falsy by default, making an element's value optional`, () => {
      let {dropdownEl} = render();
      expect(dropdownEl.validity.valueMissing).to.be.false;
      expect(dropdownEl.hasAttribute('required')).to.be.false;
    });

    it('requires a simple-dropdown to have a value', () => {
      let {dropdownEl} = render(['required']);
      expect(dropdownEl.validity.valueMissing).to.be.true;
    });

    it('makes selection clearer visibile when value is set and simple dropdown is NOT required', () => {
      let [value] = itemsNumbers.at(-2);
      let {clearerEl} = render([['itemsref', itemsrefNumbers], ['selected', value]]);
      expect(clearerEl.checkVisibility()).to.be.true;
    });

    it('hides selection clearer when value is set and simple dropdown is required', () => {
      let [value] = itemsNumbers.at(-2);
      let {clearerEl} = render([['itemsref', itemsrefNumbers], 'required', ['selected', value]]);
      expect(clearerEl.checkVisibility()).to.be.false;
    });
  });

  describe('selected', () => {
    it(`keeps the component's value as an empty space('') when uninitialized`, () => {
      let {dropdownEl} = render();
      expect(dropdownEl.value).to.equal(defaultValue);
    });

    it(`initializes component's value to one of the item's values`, () => {
      let [value, label] = itemsNumbers.at(-2);
      let {choiceEl, dropdownEl} = render([['itemsref', itemsrefNumbers], ['selected', value]]);
      expect(dropdownEl.value).to.equal(value);
      expect(choiceEl.innerText).to.equal(label);
      
    });

    it(`warns when a selected value does not exist among the items and sets the value to empty space('')`, () => {
      let selectedValue = 'none';
      let {dropdownEl} = render([['itemsref', itemsrefNumbers], ['selected', selectedValue]]);
      expect(messages.warning).to.include(`trying to select value "${selectedValue}" that does not exit`);
      expect(dropdownEl.value).to.equal(defaultValue);
    });

    it('warns when no items were specified and a seleted value is specified', () => {
      let selectedValue = 'none';
      let {dropdownEl} = render([['selected', selectedValue]]);
      expect(messages.warning).to.include(`trying to select value "${selectedValue}" that does not exit`);
      expect(dropdownEl.value).to.equal(defaultValue);
    });
  });

  describe('tabindex', () => {
    it('sets tabindex to 0 by default', () => {
      let {dropdownEl} = render();
      expect(dropdownEl.getAttribute('tabindex')).to.equal('0');
    });

    it('allows setting a custom tabindex on the element itself', () => {
      let tabindex = '-1';
      let {dropdownEl} = render([['tabindex', tabindex]]);
      expect(dropdownEl.getAttribute('tabindex')).to.equal(tabindex);
    });
  });

  describe('misc', () => {
    it('ignores an attribute update when a new value is the same as the previous one (for coverage)', () => {
      let [value, label] = itemsNumbers.at(-1);
      let {choiceEl, dropdownEl} = render([['itemsref', itemsrefNumbers], ['selected', value]]);
      expect(choiceEl.innerText).to.equal(label);
      expect(dropdownEl.value).to.equal(value);
      dropdownEl.setAttribute('selected', value);
    });
  });
});
