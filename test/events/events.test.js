import {describe, it, expect}                from 'vitest';
import {defineItems, registerSimpleDropdown} from '../../src';
import {render}                              from '../_lib/utils';
import {itemsNumbers}                        from '../_lib/vars';

let itemsrefNumbers = 'numbers';
defineItems(itemsrefNumbers, itemsNumbers);
registerSimpleDropdown();

describe('events', () => {
  it('accepts onChange event handler within the markup of the element itself', () => {
    let target;
    let handleOnChange = (event) => target = event.target;
    let onChangeHandlerName = 'handleOnChange';
    let {dropdownEl} = render([['itemsref', itemsrefNumbers], ['onchange', `${onChangeHandlerName}(event)`]]);
    window[onChangeHandlerName] = handleOnChange;
    dropdownEl.value = itemsNumbers[0][0];
    expect(target).to.equal(dropdownEl);
  });

  it(`registers onChange event handler on an element's instance`, () => {
    let target;
    let {dropdownEl} = render([['itemsref', itemsrefNumbers]]);
    dropdownEl.onchange = (event) => target = event.target;
    dropdownEl.value = itemsNumbers[1][0];
    expect(target).to.equal(dropdownEl);
  });

  it('assigns change event handler via addEventListener() method', () => {
    let recordedValue;
    let {dropdownEl} = render([['itemsref', itemsrefNumbers]]);
    let [value] = itemsNumbers.at(-1);
    
    dropdownEl.addEventListener('change', (event) => {
      recordedValue = event.target.value;
    }, {once: true});

    dropdownEl.value = value;
    expect(recordedValue).to.equal(value);
  });
});
