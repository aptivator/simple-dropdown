import {fireEvent}                                  from '@testing-library/dom';
import {afterAll, beforeEach, describe, it, expect} from 'vitest';
import {userEvent}                                  from 'vitest/browser';
import {defaultPlaceholder, defaultValue}           from '../../src/_lib/vars';
import {isElementVisible}                           from '../../src/_lib/utils';
import {defineItems, registerSimpleDropdown}        from '../../src';
import {setGlobalConfigs}                           from '../../src';
import {interceptMessages, render}                  from '../_lib/utils';
import {itemsNumbersWithDisabled}                   from '../_lib/vars';

let itemsrefNumbersWithDisabled = 'numbers-with-disabled';
let {messages, restoreOriginals} = interceptMessages();
setGlobalConfigs({scrollBehavior: {behavior: 'instant'}});
defineItems(itemsrefNumbersWithDisabled, itemsNumbersWithDisabled);
registerSimpleDropdown();

describe('interaction (selector element)', () => {
  let dropdownEl, choiceEl, selectionsEl, selectionsWrapperEl, selectorEl;

  beforeEach(async () => {
    let elements = render([['itemsref', itemsrefNumbersWithDisabled]]);
    ({dropdownEl, choiceEl, selectionsEl, selectionsWrapperEl, selectorEl} = elements);
    dropdownEl.focus();
    await userEvent.keyboard(' ');
  });

  afterAll(() => restoreOriginals());

  it('closes the dropdown menu when the [Space] key is pressed', async () => {
    expect(selectorEl).toHaveFocus();
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
    await userEvent.keyboard(' ');
    expect(selectorEl).not.toHaveFocus();
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.false;
    expect(dropdownEl).toHaveFocus();
  });

  it('preserves the scroll position within the selections area when the [Space] key is pressed', async () => {
    for(let i = 0; i < 3; i++) {
      await userEvent.keyboard('[ArrowDown]');
    }
    
    for(let i = 0; i < 2; i++) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.false;
    }

    for(let i = 2; i < 6; i++) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.true;
    }

    await userEvent.keyboard(' ');
    await userEvent.keyboard(' ');

    for(let i = 0; i < 2; i++) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.false;
    }

    for(let i = 2; i < 6; i++) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.true;
    }
  });

  it('closes the dropdown menu when the [Escape] key is pressed', async () => {
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
    await userEvent.keyboard('[Escape]');
    expect(selectorEl).not.toHaveFocus();
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.false;
    expect(dropdownEl).toHaveFocus();
  });

  it('does not preserve the scroll position when the [Escape] key is pressed; when there is no selection, the scroll position is moved to the start', async () => {
    for(let i = 0; i < 3; i++) {
      await userEvent.keyboard('[ArrowDown]');
    }
    
    for(let i = 0; i < 2; i++) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.false;
    }

    for(let i = 2; i < 6; i++) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.true;
    }

    await userEvent.keyboard('[Escape]');
    await userEvent.keyboard(' ');
  
    for(let i = 0; i < 4; i++) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.true;
    }

    for(let i = 4; i < 6; i++) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.false;
    }
  });

  it('does not preserve the scroll position when the [Escape] key is pressed; WITH selection, the scroll position is moved to show the selected item', async () => {
    let {length} = itemsNumbersWithDisabled;
    let lastIndex = length - 1;
    dropdownEl.value = itemsNumbersWithDisabled[lastIndex][0];
    
    for(let i = 0; i < 7; i++) {
      await userEvent.keyboard('[ArrowUp]');
    }

    for(let i = lastIndex, limit = lastIndex - 4; i > limit; i--) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.false;
    }

    await userEvent.keyboard('[Escape]');
    await userEvent.keyboard(' ');

    for(let i = lastIndex, limit = lastIndex - 4; i > limit; i--) {
      let visible = isElementVisible(selectionsEl.children[i], selectionsWrapperEl);
      expect(visible).to.be.true;
    }
  });

  it('sets the element value when the [Enter] key is pressed and there is a potential selection', async () => {
    let [value, label] = itemsNumbersWithDisabled[5];
    
    for(let i = 0; i < 3; i++) {
      await userEvent.keyboard('[ArrowDown]');
    }

    fireEvent.keyDown(selectorEl, {code: 'Enter'});
    expect(dropdownEl.value).to.equal(value);
    expect(choiceEl.innerText).to.equal(label);
  });

  it('does not set the element value when the [Enter] key is pressed and no item is highlighted (for coverage)', () => {
    fireEvent.keyDown(selectorEl, {code: 'Enter'});
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
    expect(dropdownEl.value).to.equal(defaultValue);
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
  });

  it('puts a potential selection into view, when arrow keys are pressed, if it is placed out of view by using a scroll bar', async () => {
    let {children} = selectionsEl;
    let lastIndex = children.length - 1;
    let firstChild = children[0];
    let lastChild = children[lastIndex];
    
    await userEvent.keyboard('[ArrowDown]');

    expect(isElementVisible(firstChild, selectionsWrapperEl)).to.be.true;
    expect(isElementVisible(lastChild, selectionsWrapperEl)).to.be.false;
    lastChild.scrollIntoView({block: 'nearest'});
    expect(isElementVisible(firstChild, selectionsWrapperEl)).to.be.false;
    expect(isElementVisible(lastChild, selectionsWrapperEl)).to.be.true;

    await userEvent.keyboard('[ArrowDown]');
    expect(isElementVisible(firstChild, selectionsWrapperEl)).to.be.true;
  });

  it('will not perform a navigation by arrow if navigation selection element does not have a corresponding sibling', async () => {
    await userEvent.keyboard('[ArrowUp]');
    expect(dropdownEl.value).to.equal(defaultValue);
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
  });

  it('does nothing when any key other than the [Space], [Escape], [Enter], [ArrowDown], or [ArrowUp] is pressed', async () => {
    await userEvent.keyboard('[ArrowLeft]');
    await userEvent.keyboard('[ArrowRight]');
    await userEvent.keyboard('a');
    expect(dropdownEl.value).to.equal(defaultValue);
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
  });

  it('sets a new potential selection if it is different from the existing one (for coverage)', async () => {
    let [value, label] = itemsNumbersWithDisabled[5];
    
    for(let i = 0; i < 3; i++) {
      await userEvent.keyboard('[ArrowDown]');
    }

    await userEvent.keyboard('[ArrowUp]');
    await userEvent.keyboard('[ArrowDown]');

    fireEvent.keyDown(selectorEl, {code: 'Enter'});
    expect(dropdownEl.value).to.equal(value);
    expect(choiceEl.innerText).to.equal(label);
  });

  it('checks to make sure that the next selection has an appropriate sibling (for coverage)', async () => {
    let items = structuredClone(itemsNumbersWithDisabled);
    let lastIndex = items.length - 1;
    items[0].push({disabled: true});
    items.at(-1).push({disabled: true});
    dropdownEl.items = items;
    
    for(let i = 0; i <= lastIndex; i++) {
      await userEvent.keyboard('[ArrowDown]');
    }

    expect(messages).to.eql({error: '', warning: ''});
    expect(isElementVisible(selectionsEl.children[lastIndex], selectionsWrapperEl)).to.be.true;

    for(let i = 0; i <= lastIndex; i++) {
      await userEvent.keyboard('[ArrowUp]');
    }

    expect(messages).to.eql({error: '', warning: ''});
    expect(isElementVisible(selectionsEl.children[0], selectionsWrapperEl)).to.be.true;
  });
});
