import {describe, it, expect}                from 'vitest';
import {userEvent}                           from 'vitest/browser';
import {defaultPlaceholder, defaultValue}    from '../../src/_lib/vars';
import {defineItems, registerSimpleDropdown} from '../../src';
import {render}                              from '../_lib/utils';
import {itemsNumbers}                        from '../_lib/vars';

let itemsrefNumbers = 'numbers';
defineItems(itemsrefNumbers, itemsNumbers);
registerSimpleDropdown();

describe('interaction (clearer element)', () => {
  it(`clears the value by setting it to an empty space ('')`, async () => {
    let [value, label] = itemsNumbers.at(-1);
    let {choiceEl, clearerEl, dropdownEl} = render([['itemsref', itemsrefNumbers], ['selected', value]]);
    expect(choiceEl.innerText).to.equal(label);
    expect(clearerEl.checkVisibility()).to.be.true;
    await userEvent.click(clearerEl);
    expect(choiceEl.innerText).to.equal(defaultPlaceholder);
    expect(dropdownEl.value).to.equal(defaultValue);
    expect(clearerEl.checkVisibility()).to.be.false;
  });

  it('is not available when a dropdown is required', async () => {
    let [value, label] = itemsNumbers.at(-1);
    let {choiceEl, clearerEl, dropdownEl} = render([['itemsref', itemsrefNumbers], 'required']);
    dropdownEl.value = value;
    expect(choiceEl.innerText).to.equal(label);
    expect(clearerEl.checkVisibility()).to.be.false;
  });
});
