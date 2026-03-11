import {fireEvent}                           from '@testing-library/dom';
import {beforeEach, describe, it, expect}    from 'vitest';
import {userEvent}                           from 'vitest/browser';
import {classes}                             from '../../src/_lib/classes';
import {defaultPlaceholder, defaultValue}    from '../../src/_lib/vars';
import {defineItems, registerSimpleDropdown} from '../../src';
import {getElementCenter, render}            from '../_lib/utils';
import {itemsNumbersWithDisabled}            from '../_lib/vars';

let itemsrefNumbersWithDisabled = 'numbers-with-disabled';
defineItems(itemsrefNumbersWithDisabled, itemsNumbersWithDisabled);
registerSimpleDropdown();

describe('interaction (selections wrapper element)', () => {
  let dropdownEl, choiceEl, selectionsEl, selectionsWrapperEl, selectorEl, selectionHeight;

  beforeEach(async () => {
    ({dropdownEl, choiceEl, selectionsEl, selectionsWrapperEl, selectorEl} = render([['itemsref', itemsrefNumbersWithDisabled]]));
    selectionHeight = getComputedStyle(selectionsEl.children[0]).getPropertyValue('height');
    selectionHeight = parseFloat(selectionHeight);
    dropdownEl.focus();
    await userEvent.keyboard(' ');
  });

  it('selects a potential value by moving a mouse pointer over it', async () => {
    let selectionIndex = 5;
    let [value, label] = itemsNumbersWithDisabled[selectionIndex];
    let child = selectionsEl.children[selectionIndex];
    
    fireEvent.scroll(selectionsWrapperEl, {target: {scrollTop: selectionHeight * 2}});
    fireEvent.mouseMove(child, getElementCenter(child));
    fireEvent.keyDown(selectorEl, {code: 'Enter'});
    expect(dropdownEl.value).to.equal(value);
    expect(choiceEl.innerText).to.equal(label);
  });

  it('ignores a selection if it is in already hovered stated (for coverage)', async () => {
    let selectionIndex = 5;
    let [value, label] = itemsNumbersWithDisabled[selectionIndex];
    let child = selectionsEl.children[selectionIndex];
    let coords;

    fireEvent.scroll(selectionsWrapperEl, {target: {scrollTop: selectionHeight * 2}});
    coords = getElementCenter(child);
    fireEvent.mouseMove(child, coords);
    coords.clientX += 20;
    fireEvent.mouseMove(child, coords);
    fireEvent.keyDown(selectorEl, {code: 'Enter'});
    expect(dropdownEl.value).to.equal(value);
    expect(choiceEl.innerText).to.equal(label);
  });

  it('can select a potential only when it is not disabled (for coverage)', async () => {
    let child = selectionsEl.children[1];
    fireEvent.scroll(selectionsWrapperEl, {target: {scrollTop: selectionHeight}});
    fireEvent.mouseMove(child, getElementCenter(child));
    fireEvent.keyDown(selectorEl, {code: 'Enter'});
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
    expect(dropdownEl.value).to.equal(defaultValue);
  });

  it('selects a value by clicking on a non-disabled item', async () => {
    let selectionIndex = 0;
    let [value, label] = itemsNumbersWithDisabled[selectionIndex];
    let child = selectionsEl.children[selectionIndex];
    fireEvent.mouseUp(child, getElementCenter(child));
    expect(dropdownEl.value).to.equal(value);
    expect(choiceEl.innerText).to.equal(label)
  });

  it('will not select a disabled item (for coverage)', async () => {
    let child = selectionsEl.children[1];
    fireEvent.mouseUp(child, getElementCenter(child));
    expect(dropdownEl.value).to.equal(defaultValue);
    expect(choiceEl.innerText).to.equal(defaultPlaceholder)
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
  });

  it('ignores mouse down events and keeps the dropdown open', () => {
    selectionsWrapperEl.dispatchEvent(new Event('mousedown'));
    selectorEl.blur();
    expect(dropdownEl.value).to.equal(defaultValue);
    expect(choiceEl.innerText).to.equal(defaultPlaceholder)
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
  });

  it('ignores mousemove that sets the "dirty" class if movement is not on a selection (for coverage)', () => {
    let child = selectionsEl.children[0];
    let {left, width} = selectionsWrapperEl.getBoundingClientRect();
    let coords = getElementCenter(child);
    coords.clientX = left + width - 1;
    fireEvent.mouseMove(selectionsWrapperEl, coords);
    fireEvent.keyDown(selectorEl, {code: 'Enter'});
    expect(dropdownEl.value).to.equal(defaultValue);
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
    expect(dropdownEl.classList.contains(classes.dirty)).to.be.false;
  });

  it('bypasses mouseup event that sets value unless it occurs over a selection (for coverage)', () => {
    let child = selectionsEl.children[0];
    let {left, width} = selectionsWrapperEl.getBoundingClientRect();
    let coords = getElementCenter(child);
    coords.clientX = left + width - 1;
    fireEvent.mouseUp(selectionsWrapperEl, coords);
    expect(dropdownEl.value).to.equal(defaultValue);
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
  });
});
