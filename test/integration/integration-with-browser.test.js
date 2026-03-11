import {describe, it, expect}                from 'vitest';
import {defineItems, registerSimpleDropdown} from '../../src';
import {render}                              from '../_lib/utils';
import {itemsNumbers}                        from '../_lib/vars';

let itemsrefNumbers = 'numbers';
defineItems(itemsrefNumbers, itemsNumbers);
registerSimpleDropdown();

describe(`integration (with browser)`, () => {
  it('will be selected under the :invalid CSS pseudo-class', () => {
    let {dropdownEl} = render();
    let outlineStyle = 'solid';
    let css = `simple-dropdown:invalid {outline: 2px ${outlineStyle} red;}`;
    let style = document.createElement('style');
    
    style.textContent = css;
    document.head.appendChild(style);
    expect(getComputedStyle(dropdownEl).getPropertyValue('outline-style')).to.equal('none');
    dropdownEl.required = true;
    expect(getComputedStyle(dropdownEl).getPropertyValue('outline-style')).to.equal(outlineStyle);
  });
});
