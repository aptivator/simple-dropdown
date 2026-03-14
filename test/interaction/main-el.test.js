import {fireEvent}                           from '@testing-library/dom';
import {beforeEach, describe, it, expect}    from 'vitest';
import {userEvent}                           from 'vitest/browser';
import {defaultPlaceholder, defaultValue}    from '../../src/_lib/vars';
import {defineItems, registerSimpleDropdown} from '../../src';
import {render}                              from '../_lib/utils';
import {itemsNumbersWithDisabled}            from '../_lib/vars';

let itemsrefNumbersWithDisabled = 'numbers-with-disabled';
let itemsWithoutDisabled = itemsNumbersWithDisabled.filter((item) => !item?.[2]?.disabled);
defineItems(itemsrefNumbersWithDisabled, itemsNumbersWithDisabled);
registerSimpleDropdown();

describe('interaction (main element [simple-dropdown])', () => {
  let dropdownEl, choiceEl, selectionsWrapperEl;

  beforeEach(() => {
    ({dropdownEl, choiceEl, selectionsWrapperEl} = render([['itemsref', itemsrefNumbersWithDisabled]]));
    dropdownEl.focus();
  });

  it('receives a keydown event when focused and displays a dropdown when the [Space] key is pressed', async () => {
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.false;
    await userEvent.keyboard(' ');
    expect(dropdownEl).not.toHaveFocus();
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
  });

  it('allows selecting and setting a value by using the [ArrowDown] and [ArrowUp] keys (when simple-dropdown has focus)', async () => {
    let {length} = itemsWithoutDisabled;
    
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);

    for(let i = 0; i < length; i++) {
      let [value, label] = itemsWithoutDisabled[i];
      await userEvent.keyboard('[ArrowDown]');
      expect(dropdownEl.value).to.equal(value);
      expect(choiceEl.innerText).to.equal(label);
    }

    for(let i = length - 2; i >= 0; i--) {
      let [value, label] = itemsWithoutDisabled[i];
      await userEvent.keyboard('[ArrowUp]');
      expect(dropdownEl.value).to.equal(value);
      expect(choiceEl.innerText).to.equal(label);
    }
  });

  it('does nothing when the [ArrowUp] key is used and when no selection has been made prior', async () => {
    await userEvent.keyboard('[ArrowUp]');
    await userEvent.keyboard('[ArrowUp]');
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
  });

  it('navigates down and up from the selected item', async () => {
    let {length} = itemsWithoutDisabled;
    let mid = Math.floor(length / 2);
    let [value, label] = itemsWithoutDisabled[mid];

    dropdownEl.value = value;
    expect(choiceEl.innerText).to.equal(label);

    for(let i = mid + 1; i < length; i++) {
      let [value, label] = itemsWithoutDisabled[i];
      await userEvent.keyboard('[ArrowDown]');
      expect(dropdownEl.value).to.equal(value);
      expect(choiceEl.innerText).to.equal(label);
    }

    dropdownEl.value = value;

    for(let i = mid - 1; i >= 0; i--) {
      let [value, label] = itemsWithoutDisabled[i];
      await userEvent.keyboard('[ArrowUp]');
      expect(dropdownEl.value).to.equal(value);
      expect(choiceEl.innerText).to.equal(label);
    }
  });

  it('clears a selection when the [Escape] key is pressed and the element is not required', async () => {
    let [value, label] = itemsWithoutDisabled.at(-1);

    dropdownEl.value = value;
    expect(choiceEl.innerText).to.equal(label);
    await userEvent.keyboard('[Escape]');
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
    expect(dropdownEl.value).to.equal(defaultValue);
  });

  it('will not clear a selection through a press of the [Escape] key if an element is required', async () => {
    let [value, label] = itemsWithoutDisabled.at(-1);

    dropdownEl.value = value;
    dropdownEl.required = true;
    expect(choiceEl.innerText).to.equal(label);
    await userEvent.keyboard('[Escape]');
    expect(choiceEl.innerText).to.equal(label);
  });

  it('will not clear a selection if no selection is specified (for coverage)', async () => {
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
    await userEvent.keyboard('[Escape]');
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
  });

  it('stops propagation of touchstart', async () => {
    let invocationCount = 0;
    await userEvent.keyboard(' ');
    document.addEventListener('touchstart', () => invocationCount++, {once: true});
    fireEvent.touchStart(dropdownEl);
    expect(invocationCount).to.equal(0);
  });
});
