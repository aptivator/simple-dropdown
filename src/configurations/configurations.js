
import {error, mergeObjects}                                from '../_lib/utils';
import {allConfigs, globalConfigs, itemsStore, libraryName} from '../_lib/vars';
import {libraryNameRef}                                     from '../_lib/vars';
import css                                                  from '../simple-dropdown/simple-dropdown.css?raw';
import {SimpleDropdown}                                     from '../simple-dropdown/simple-dropdown';
import {normalizeItems}                                     from './items-normalizer/items-normalizer';

export function defineItems(itemsRef, items) {
  if(itemsStore.has(itemsRef)) {
    error(`items are already stored under "${itemsRef}".`);
  }

  items = normalizeItems(items);
  itemsStore.set(itemsRef, items);
}

export const includeStylesheet = (() => {
  let addedStyles;

  return function includeStylesheet() {
    if(!addedStyles) {
      let style = document.createElement('style');
      let styles = css;

      if(libraryNameRef.libraryName !== libraryName) {
        let rx = new RegExp(`^${libraryName}`);
        styles = styles.replace(rx, libraryNameRef.libraryName);
      }

      style.textContent = styles;
      document.head.appendChild(style);
      addedStyles = true;
    }
  }
})();

export function registerSimpleDropdown(elementName = libraryName, addStyles = true) {
  if(arguments.length === 1 && typeof elementName === 'boolean') {
    addStyles = elementName;
    elementName = libraryName;
  }

  if(elementName !== libraryName) {
    libraryNameRef.libraryName = elementName;
  }

  customElements.define(elementName, SimpleDropdown);

  if(addStyles) {
    includeStylesheet();
  }
}

export function setConfigProfile(configsRef, configs) {
  configs = structuredClone(configs);
  allConfigs.set(configsRef, configs);
}

export function setGlobalConfigs(configs) {
  configs = structuredClone(configs);
  mergeObjects(globalConfigs, configs);
}
