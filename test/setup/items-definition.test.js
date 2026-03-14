import {afterEach, describe, it, expect} from 'vitest';
import {itemsStore}                      from '../../src/_lib/vars';
import {defineItems}                     from '../../src';

describe('items definition via defineItems()', () => {
  let alias = 'some-alias';

  afterEach(() => itemsStore.clear());
  
  it('stores dropdown choices under an alias', () => {
    let items = [['value', 'label', {disabled: true}]];
    defineItems(alias, items);
    expect(itemsStore.get(alias)).to.eql(items);
  });

  it('normalizes items by equating value to label', () => {
    let items = [['value']];
    let expectedItems = items.map((item) => [item[0], item[0]]);
    defineItems(alias, items);
    expect(itemsStore.get(alias)).to.eql(expectedItems);
  });

  it('accepts an array of strings and normalizes them by treating each string as a value and a label', () => {
    let items = ['one', 'two'];
    let expectedItems = items.map((item) => [item, item]);
    defineItems(alias, items);
    expect(itemsStore.get(alias)).to.eql(expectedItems);
  });

  it('checks for the presence of settings when normalizing items', () => {
    let items = [['value', {selected: true}]];
    let expectedItems = structuredClone(items);
    expectedItems[0].unshift(items[0][0]);
    defineItems(alias, items);
    expect(itemsStore.get(alias)).to.eql(expectedItems);
  });

  it('errors if items are attempted to be stored as an already-existing alias', () => {
    defineItems(alias, []);
    expect(() => defineItems(alias, [])).to.throw(`items are already stored under "${alias}"`);
  });
});
