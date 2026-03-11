import {afterAll, beforeAll, beforeEach, describe, it, expect} from 'vitest';
import {addEventListener}                                      from '../../src/_lib/utils';
import {allConfigs, globalConfigs, libraryName}                from '../../src/_lib/vars';
import {defineItems, registerSimpleDropdown}                   from '../../src';
import {setConfigProfile, setGlobalConfigs}                    from '../../src';
import {interceptMessages, render}                             from '../_lib/utils';
import {itemsNumbers}                                          from '../_lib/vars';

let itemsrefNumbers = 'numbers';
let {messages, restoreOriginals} = interceptMessages();
defineItems(itemsrefNumbers, itemsNumbers);
registerSimpleDropdown();

describe('configuration', () => {
  afterAll(restoreOriginals);

  describe('scroll behavior', () => {
    let behavior = 'instant';

    beforeEach(() => setGlobalConfigs({scrollBehavior: {behavior}}));

    it('sets default scroll behavior', () => {
      let {dropdownEl} = render();
      expect(dropdownEl.configs.scrollBehavior.behavior).to.eql(behavior);
    });
  });

  describe('immediate even triggering', () => {
    beforeEach(() => setGlobalConfigs({triggerImmediately: false}));

    it('controls whether initial value setting triggers a change event', () => {
      let [value1] = itemsNumbers.at(-2);
      let [value2] = itemsNumbers.at(-1);
      let dropdownEl = document.createElement(libraryName);
      let invocationCount = 0;
      let unsubscribe = addEventListener(dropdownEl, 'change', () => invocationCount++);
      dropdownEl.itemsref = itemsrefNumbers;
      dropdownEl.value = value1;
      document.body.appendChild(dropdownEl);
      dropdownEl.value = value2;
      expect(invocationCount).to.equal(1);
      unsubscribe();
    });
  });

  describe('configuration profiles', () => {
    beforeAll(() => setGlobalConfigs(globalConfigs));

    describe('setConfigProfile()', () => {
      it('adds a separate partial or full configuration profile', () => {
        let configsref = '1';
        let configs = {triggerImmediately: false};
        setConfigProfile(configsref, configs);
        expect(allConfigs.get(configsref)).to.eql(configs);
      });
    });

    describe('configsref', () => {
      let configsref = '2';
      let configs = {scrollBehavior: {behavior: 'instant', block: 'start'}};
      setConfigProfile(configsref, configs);

      it('works as an attribute', () => {
        let {dropdownEl} = render([['configsref', configsref]]);
        expect(dropdownEl.configs.scrollBehavior).to.eql(configs.scrollBehavior);
      });

      it('is usable as a property', () => {
        let dropdownEl = document.createElement(libraryName);
        dropdownEl.configsref = configsref;
        expect(dropdownEl.configs.scrollBehavior).to.eql(configs.scrollBehavior);
      });

      it('errors if an unknown configurations reference is passed', () => {
        let unknownConfigsRef = 'some-unknown-configuration-reference';
        render([['configsref', unknownConfigsRef]]);
        expect(messages.error).to.include(`no configurations exist under the "${unknownConfigsRef}" reference.`)
      })
    });
  });

  describe('direct configs assignment', () => {
    it('assigns settings directly to a component', () => {
      let {dropdownEl} = render();
      let configs = structuredClone(globalConfigs);
      configs.triggerImmediately = false;
      configs.scrollBehavior.block = 'end';
      dropdownEl.configs = configs;
      expect(dropdownEl.configs).to.eql(configs);
    });
  });
});
