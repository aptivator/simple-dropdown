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

describe('interaction (document)', () => {
  let dropdownEl, selectionsWrapperEl;

  beforeEach(async () => {
    ({dropdownEl, selectionsWrapperEl} = render([['itemsref', itemsrefNumbersWithDisabled]]));
    dropdownEl.focus();
  });

  it('hides the items dropdown when the document is touched', async () => {
    await userEvent.keyboard(' ');
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.true;
    fireEvent.touchStart(document);
    expect(selectionsWrapperEl.checkVisibility({opacityProperty: true})).to.be.false;
  });

  it('will not (obviously) remove the items dropdown when the latter is not shown (for coverage)', () => {
    fireEvent.touchStart(document);
  });
});
