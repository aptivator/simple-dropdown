import {describe, expect, it}   from 'vitest';
import {SimpleDropdown}         from '../../src/simple-dropdown/simple-dropdown';
import {libraryName}            from '../../src/_lib/vars';
import {registerSimpleDropdown} from '../../src';

describe('custom registration via registerSimpleDropdown()', () => {
  it('registers simple dropdown web component without including styles', () => {
    let componentStylesCount = 0;
    registerSimpleDropdown(false);
    expect(customElements.get(libraryName)).to.equal(SimpleDropdown);

    for(let style of document.head.querySelectorAll('style')) {
      if(style.textContent.startsWith(libraryName)) {
        componentStylesCount++;
      }
    }

    expect(componentStylesCount).to.equal(0);
  });
});
