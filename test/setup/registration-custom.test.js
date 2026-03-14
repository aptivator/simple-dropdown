import {describe, it, expect}                      from 'vitest';
import {SimpleDropdown}                            from '../../src/simple-dropdown/simple-dropdown';
import {includeStylesheet, registerSimpleDropdown} from '../../src';

describe('custom registration via registerSimpleDropdown()', () => {
  let componentName = 'my-simple-dropdown';
  registerSimpleDropdown(componentName);

  it('registers simple dropdown web component under a custom tag name', () => {
    expect(customElements.get(componentName)).to.equal(SimpleDropdown);
  });

  it('namespaces stylesheets under a custom tag name', () => {
    expect(document.head.querySelector('style:last-child').textContent.startsWith(componentName)).to.be.true;
  });

  it('includes stylesheet only once (for coverage)', () => {
    let componentStylesCount = 0;
    includeStylesheet();
    includeStylesheet();
    includeStylesheet();

    for(let style of document.head.querySelectorAll('style')) {
      if(style.textContent.startsWith(componentName)) {
        componentStylesCount++;
      }
    }

    expect(componentStylesCount).to.equal(1);
  });
});
