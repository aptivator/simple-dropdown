import {describe, it, expect}   from 'vitest';
import {SimpleDropdown}         from '../../src/simple-dropdown/simple-dropdown';
import {libraryName}            from '../../src/_lib/vars';
import {registerSimpleDropdown} from '../../src';

describe('registration via registerSimpleDropdown()', () => {
  it(`registers simple dropdown web component as "${libraryName}" by default`, () => {
    registerSimpleDropdown();
    expect(customElements.get(libraryName)).to.equal(SimpleDropdown);
  });
});
