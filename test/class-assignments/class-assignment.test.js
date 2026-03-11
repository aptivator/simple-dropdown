import {fireEvent}                           from '@testing-library/dom';
import {describe, it, expect}                from 'vitest';
import {userEvent}                           from 'vitest/browser';
import {defineItems, registerSimpleDropdown} from '../../src';
import {classes}                             from '../../src/_lib/classes';
import {getElementCenter, render}            from '../_lib/utils';
import {itemsNumbers}                        from '../_lib/vars';

let itemsrefNumbers = 'numbers';
defineItems(itemsrefNumbers, itemsNumbers);
registerSimpleDropdown();

describe('class assignments', () => {
  describe(`.${classes.touched} class`, () => {
    it('is assigned when a menu is opened by pressing the [Space] key', async () => {
      let {dropdownEl} = render([['itemsref', itemsrefNumbers]]);
      dropdownEl.focus();
      expect(dropdownEl.classList.contains(classes.touched)).to.be.false;
      await userEvent.keyboard(' ');
      expect(dropdownEl.classList.contains(classes.touched)).to.be.true;
    });

    it('gets added when a simple-dropdown is clicked', async () => {
      let {dropdownEl} = render([['itemsref', itemsrefNumbers]]);
      expect(dropdownEl.classList.contains(classes.touched)).to.be.false;
      await userEvent.click(dropdownEl);
      expect(dropdownEl.classList.contains(classes.touched)).to.be.true;
    });
  });

  describe(`.${classes.dirty} class`, () => {
    it('is added when a mouse pointer is hovered over selectable item', async () => {
      let {dropdownEl, selectionsEl} = render([['itemsref', itemsrefNumbers]]);
      let child = selectionsEl.children[0];
      
      await userEvent.click(dropdownEl);
      expect(dropdownEl.classList.contains(classes.dirty)).to.be.false;
      fireEvent.mouseMove(child, getElementCenter(child));
      expect(dropdownEl.classList.contains(classes.dirty)).to.be.true;
    });

    it('gets placed when an [ArrowDown] or [ArrowUp] key press highlights a selection', async () => {
      let {dropdownEl} = render([['itemsref', itemsrefNumbers]]);

      await userEvent.click(dropdownEl);
      expect(dropdownEl.classList.contains(classes.dirty)).to.be.false;
      await userEvent.keyboard('[ArrowDown]');
      expect(dropdownEl.classList.contains(classes.dirty)).to.be.true;
    });
  });

  describe(`.${classes.selected} class`, () => {
    it('is included when a selectable item is clicked', async () => {
      let {dropdownEl, selectionsEl} = render([['itemsref', itemsrefNumbers]]);
      let child = selectionsEl.children[2];

      await userEvent.click(dropdownEl);
      expect(dropdownEl.classList.contains(classes.selected)).to.be.false;
      await userEvent.click(child);
      expect(dropdownEl.classList.contains(classes.selected)).to.be.true;
    });

    it('gets appended when the [Enter] key is pressed and a potential selection exists', async () => {
      let {dropdownEl, selectionsEl, selectorEl} = render([['itemsref', itemsrefNumbers]]);
      let child = selectionsEl.children[2];
      
      await userEvent.click(dropdownEl);
      expect(dropdownEl.classList.contains(classes.selected)).to.be.false;
      fireEvent.mouseMove(child, getElementCenter(child));
      fireEvent.keyDown(selectorEl, {code: 'Enter'});
      expect(dropdownEl.classList.contains(classes.selected)).to.be.true;
    });

    it('is removed when a clearer is clicked', async () => {
      let {clearerEl, dropdownEl, selectionsEl} = render([['itemsref', itemsrefNumbers]]);
      let child = selectionsEl.children[2];

      await userEvent.click(dropdownEl);
      expect(dropdownEl.classList.contains(classes.selected)).to.be.false;
      await userEvent.click(child);
      expect(dropdownEl.classList.contains(classes.selected)).to.be.true;
      await userEvent.click(clearerEl);
      expect(dropdownEl.classList.contains(classes.selected)).to.be.false;
    });
  });
});
