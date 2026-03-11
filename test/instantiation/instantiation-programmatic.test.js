import {fireEvent}                                         from '@testing-library/dom';
import {describe, it, expect}                              from 'vitest';
import {userEvent}                                         from 'vitest/browser';
import {normalizeItems}                                    from '../../src/configurations/items-normalizer/items-normalizer';
import {classes}                                           from '../../src/_lib/classes';
import {addEventListener}                                  from '../../src/_lib/utils';
import {defaultPlaceholder, defaultValue, libraryName}     from '../../src/_lib/vars';
import {defineItems, registerSimpleDropdown}               from '../../src';
import {confirmRender, getElementCenter}                   from '../_lib/utils';
import {render, renderEl}                                  from '../_lib/utils';
import {itemsColors, itemsNumbers}                         from '../_lib/vars';
import {itemsNumbersAllDisabled, itemsNumbersWithDisabled} from '../_lib/vars';

let itemsrefNumbers = 'numbers';
let itemsrefColors = 'colors';
defineItems(itemsrefNumbers, itemsNumbers);
defineItems(itemsrefColors, itemsColors);
registerSimpleDropdown();

describe('instantiation (programmatic)', () => {
  describe('disabled', () => {
    it('indicates to remove pointer events and lower opacity when present', () => {
      let {dropdownEl} = render();
      dropdownEl.disabled = true;
      let styles = getComputedStyle(dropdownEl);
      expect(styles.getPropertyValue('pointer-events')).to.equal('none');
      expect(+styles.getPropertyValue('opacity')).to.be.lessThan(1);
    });

    it('makes changes by toggling the "disabled" attribute', () => {
      let {dropdownEl} = render();
      let hasDisabled = dropdownEl.hasAttribute('disabled');
      expect(hasDisabled).to.be.false;
      dropdownEl.disabled = true;
      hasDisabled = dropdownEl.hasAttribute('disabled');
      expect(hasDisabled).to.equal(dropdownEl.disabled);
    });
  });

  describe('items', () => {
    it('initializes items via items setter property', () => {
      let {dropdownEl, selectionsEl} = render();
      dropdownEl.items = itemsColors;
      expect(confirmRender(selectionsEl, itemsColors)).to.be.true;
    });

    it('sets a value if one of the items is designated to be selected', () => {
      let items = structuredClone(itemsColors);
      let item = items.at(-2);
      let [value, label] = items.at(-2);
      let {choiceEl, dropdownEl, selectionsEl} = render();
      item.push({selected: true});
      dropdownEl.items = items;
      expect(confirmRender(selectionsEl, items)).to.be.true;
      expect(dropdownEl.value).to.equal(value);
      expect(choiceEl.innerText).to.equal(label)
    });

    it('processes items before a component is added to the DOM', () => {
      let dropdownEl = document.createElement(libraryName);
      let items = structuredClone(itemsNumbers);
      let item = items.at(-1);
      let [value] = item;
      item.push({selected: true});
      dropdownEl.items = items;
      renderEl(dropdownEl);
      expect(dropdownEl.value).to.equal(value);
    });

    it('disables items that have a disabled option set', () => {
      let dropdownEl = document.createElement(libraryName);
      dropdownEl.items = itemsNumbersAllDisabled;
      renderEl(dropdownEl);
      expect(document.querySelectorAll(`.${classes.selectionDisabled}`).length).to.equal(itemsNumbersAllDisabled.length);
    });

    it(`re-renders items with new data and without a matching selected item, the value is set to empty space ('')`, () => {
      let [value] = itemsNumbers[0]
      let {choiceEl, dropdownEl, selectionsEl} = render([['itemsref', itemsrefNumbers], ['selected', value]]);
      dropdownEl.items = itemsColors;
      expect(confirmRender(selectionsEl, itemsColors)).to.be.true;
      expect(choiceEl.innerText).to.equal(defaultPlaceholder);
      expect(dropdownEl.value).to.equal(defaultValue);
    });

    it('returns items that have been set', () => {
      let {dropdownEl} = render();
      let items = ['one', 'two', 'three'];
      let expectedItems = normalizeItems(items);
      dropdownEl.items = items;
      expect(dropdownEl.items).to.eql(expectedItems);
    });

    it('changes the items and keeps the selected value if it also occurs in the new items', () => {
      let [value] = itemsNumbers.at(-1);
      let itemsNumbersFull = itemsNumbersWithDisabled.map((item) => item.slice(0, 2));
      let {dropdownEl} = render([['itemsref', itemsrefNumbers]]);
      let invocationCount = 0;
      let unsubscribe = addEventListener(dropdownEl, 'change', () => invocationCount++);
      dropdownEl.value = value;
      dropdownEl.items = itemsNumbersFull;
      expect(dropdownEl.value).to.equal(value);
      expect(invocationCount).to.equal(1);
      expect(dropdownEl.querySelector(`.${classes.selections}`).children.length).to.equal(itemsNumbersFull.length);
      unsubscribe();
    });

    it('changes the items and keeps the potential selection if its value is present among the new items', async () => {
      let [value] = itemsNumbers.at(-1);
      let expectedIndex = 0;
      let [expectedValue] = itemsNumbers[expectedIndex];
      let itemsNumbersFull = itemsNumbersWithDisabled.map((item) => item.slice(0, 2));
      let {dropdownEl, selectionsEl, selectorEl} = render([['itemsref', itemsrefNumbers], ['selected', value]]);
      let child = selectionsEl.children[expectedIndex];
      expect(dropdownEl.value).to.equal(value);
      await userEvent.click(dropdownEl);
      fireEvent.mouseMove(child, getElementCenter(child));
      dropdownEl.items = itemsNumbersFull;
      fireEvent.keyDown(selectorEl, {code: 'Enter'});
      expect(dropdownEl.value).to.equal(expectedValue);
    });

    it('swaps for new items and does not keep the potential selection when its value is NOT present among new selections', async () => {
      let {dropdownEl, selectionsEl, selectorEl, selectionsWrapperEl} = render([['itemsref', itemsrefNumbers]]);
      let child = selectionsEl.children[0];
      await userEvent.click(dropdownEl);
      fireEvent.mouseMove(child, getElementCenter(child));
      dropdownEl.items = itemsColors;
      fireEvent.keyDown(selectorEl, {code: 'Enter'});
      expect(dropdownEl.value).to.equal(defaultValue);
      expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
    });
  });

  describe('itemsref', () => {
    it('returns items reference', () => {
      let {dropdownEl} = render([['itemsref', itemsrefColors]]);
      expect(dropdownEl.itemsref).to.equal(itemsrefColors);
    });
  });

  describe('name', () => {
    it(`can be used to set a component's name attribute`, () => {
      let {dropdownEl} = render();
      let name = 'some-name';
      expect(dropdownEl.name).toBeFalsy;
      dropdownEl.name = name;
      expect(dropdownEl.getAttribute('name')).to.equal(name);
    });
  });

  describe('required', () => {
    it('sets dropdown as not required internally and via attribute', () => {
      let {dropdownEl} = render(['required']);
      expect(dropdownEl.required).to.be.true;
      dropdownEl.required = false;
      expect(dropdownEl.hasAttribute('required')).to.be.false;
      expect(dropdownEl.required).to.be.false;
    });

    it('configures dropdown to be required internally and via attribute', () => {
      let {dropdownEl} = render();
      expect(dropdownEl.required).toBeFalsy;
      dropdownEl.required = true;
      expect(dropdownEl.hasAttribute('required')).to.be.true;
      expect(dropdownEl.required).to.be.true;
    });
  });

  describe('selected', () => {
    it('returns the value of a dropdown', () => {
      let [value] = itemsColors.at(-1);
      let {dropdownEl} = render([['itemsref', itemsrefColors], ['selected', value]]);
      expect(dropdownEl.selected).to.equal(value);
    });
  });

  describe('value', () => {
    it('sets a value of an element', () => {
      let [value, label] = itemsColors.at(-1);
      let {choiceEl, dropdownEl} = render([['itemsref', itemsrefColors]]);
      dropdownEl.value = value;
      expect(choiceEl.innerText).to.equal(label);
    });

    it('will set a value only if it is different from an existing value', () => {
      let [value, label] = itemsColors.at(-1);
      let {choiceEl, dropdownEl} = render([['itemsref', itemsrefColors]]);
      let invocationCount = 0;
      let unsubscribe = addEventListener(dropdownEl, 'change', () => invocationCount++);
      dropdownEl.value = value;
      expect(choiceEl.innerText).to.equal(label);
      dropdownEl.value = value;
      expect(invocationCount).to.equal(1);
      unsubscribe();
    });

    it('does not set an initial navigation selection if there is a pending value setting operation (for coverage)', () => {
      let [value] = itemsColors.at(-1);
      let dropdownEl = document.createElement(libraryName);

      dropdownEl.value = value;
      dropdownEl.items = itemsColors;
      document.body.innerHTML = '';
      document.body.appendChild(dropdownEl);
    });
  });
});
