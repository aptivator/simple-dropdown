import {createTrapObject}                                            from 'var-trap';
import {classes, nonBlankClasses}                                    from '../_lib/classes';
import {nonHighlightableClasses, nonSelectableClasses}               from '../_lib/classes';
import {addEventListener, error, hasAnyClasses}                      from '../_lib/utils';
import {isElementVisible, mergeObjects, warn}                        from '../_lib/utils';
import {allConfigs, arrowNavigationCodes, arrowToSibling}            from '../_lib/vars';
import {defaultPlaceholder, defaultValue, globalConfigs, itemsStore} from '../_lib/vars';
import {normalizeItems}                                              from '../configurations/items-normalizer/items-normalizer';
import {FormHTMLElement}                                             from '../form-html-element/form-html-element';
import simpleDropdownHtml                                            from './simple-dropdown.html?raw';
import                                                                    '../_lib/traps';

export class SimpleDropdown extends FormHTMLElement {
  static observedAttributes = [
    'configsref',
    'itemsref',
    'placeholder',
    'required',
    'selected'
  ];

  #activeSelection;

  #choiceEl;

  #clearerEl;

  #configs = structuredClone(globalConfigs);

  #connected;

  #deferredValue;

  #initialValue;

  #items;

  #itemsref;

  #navigationSelection;

  #placeholder;

  #potentialSelection;

  #preventSelectorBlur;
  
  #required;

  #selectionsEl = (() => {
    let div = document.createElement('div');
    div.classList.add(classes.selections);
    return div;
  })();

  #selectionsWrapperEl;

  #selectionToValueLabelMap = new Map();

  #selectorEl;

  #trap = createTrapObject({c: 'callbacks'});

  #valueToLabelSelectionMap = new Map();

  get configs() {
    return this.#configs;
  }

  set configs(configs) {
    this.#configs = mergeObjects(this.#configs, configs);
  }

  set configsref(configsref) {
    let configs = allConfigs.get(configsref);

    if(!configs) {
      error(`no configurations exist under the "${configsref}" reference.`);
    }

    this.#configs = mergeObjects(this.#configs, configs);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(state) {
    this.toggleAttribute('disabled', state);
  }

  get items() {
    return this.#items;
  }

  set items(items) {
    this.#processItems(items);
  }

  get itemsref() {
    return this.#itemsref;
  }

  set itemsref(itemsref) {
    let items = itemsStore.get(itemsref);

    if(!items) {
      error(`no items exist under the "${itemsref}" reference.`);
    }

    this.#itemsref = itemsref;
    this.#renderItems(items);
    this.#items = items;
  }

  get placeholder() {
    return this.#placeholder;
  }

  set placeholder(placeholder) {
    this.#placeholder = placeholder;
  }

  get required() {
    return this.#required;
  }

  set required(required) {
    if(required === '' || (required && required !== true)) {
      required = true;
    } else if(required === false) {
      return this.removeAttribute('required');
    } else if(required) {
      return this.setAttribute('required', '');
    }

    this.#required = required || false;

    if(this.#connected) {
      this.#setValidity();
    }
  }

  get selected() {
    return this.value;
  }

  set selected(value) {
    if(this.#connected) {
      this.#setValue(value);
    } else {
      this.#deferredValue = value;
    }
  }

  get value() {
    return super.value;
  }

  set value(value) {
    this.selected = value;
  }

  constructor() {
    super();
  }

  /*
  adoptedCallback() {

  }
  */

  attributeChangedCallback(attr, oldValue, newValue) {
    if(oldValue !== newValue) {
      this[attr] = newValue;
    }
  }

  connectedCallback() {
    if(!this.#connected) {
      this.innerHTML = simpleDropdownHtml;
      this.#choiceEl = this.querySelector(`.${classes.choice}`);
      this.#clearerEl = this.querySelector(`.${classes.clearer}`);
      this.#selectionsWrapperEl = this.querySelector(`.${classes.selectionsWrapper}`);
      this.#selectorEl = this.querySelector(`.${classes.selector}`);
      this.#selectionsWrapperEl.append(this.#selectionsEl);
      this.#connected = true;

      if(this.#deferredValue) {
        if(this.#configs.triggerImmediately) {
          this.#setValue(this.#deferredValue);
        } else {
          this.#setValueWithoutDispatch(this.#deferredValue);
        }

        this.#deferredValue = undefined;
      }
  
      this.#initialValue = this.value;
  
      if(!this.value) {
        this.#setPlaceholder();
        this.#setValidity();
      }

      if(!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', 0);
      }
    }
    
    this.#addEventListeners();
  }

  disconnectedCallback() {
    this.#trap.c.clear();
  }

  /*
  formAssociatedCallback(form) {

  }
  */

  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }

  formResetCallback() {
    this.#clearSelected(this.#initialValue);
  }

  /*
  formStateRestoreCallback(state, mode) {

  }
  */

  #addEventListeners() {
    this.#addClearerElListener();
    this.#addMainElListener();
    this.#addSelectionsWrapperElListeners();
    this.#addSelectorElListeners();
  }

  #addClearerElListener() {
    this.#trap.c = addEventListener(this.#clearerEl, 'focus', () => {
      this.#clearSelectedAndFocus();
    });
  }

  #addMainElListener() {
    this.#trap.c = addEventListener(this, 'keydown', (event) => {
      if(event.target === this) {
        let {code} = event;

        if(code === 'Space') {
          return this.#selectorEl.focus();
        }
  
        if(code === 'Escape' && this.#activeSelection && !this.required) {
          return this.#clearSelectedAndFocus();
        }
  
        if(arrowNavigationCodes.has(code) && this.#navigationSelection) {
          if(this.#activeSelection || code === 'ArrowDown') {
            let siblingType = arrowToSibling[code];
            let nextSelection = this.#navigationSelection;

            do {
              if(this.#isSelecteableSelection(nextSelection)) {
                return this.#setValueFromSelection(nextSelection);
              }
            } while((nextSelection = nextSelection[siblingType]));
          }
        }
      }
    });
  }

  #addSelectionsWrapperElListeners() {
    let unsubscribeMousemove = addEventListener(this.#selectionsWrapperEl, 'mousemove', (event) => {
      let {clientX, clientY} = event;
      let selection = document.elementFromPoint(clientX, clientY);

      if(selection.classList.contains(classes.selection)) {
        this.classList.add(classes.dirty);
        unsubscribeMousemove();
      }
    });

    this.#trap.c = addEventListener(this.#selectionsWrapperEl, 'mousedown', () => {
      this.#preventSelectorBlur = true;
    });

    this.#trap.c = addEventListener(this.#selectionsWrapperEl, 'mouseup', (event) => {
      let {clientX, clientY} = event;
      let selection = document.elementFromPoint(clientX, clientY);

      if(selection !== this.#selectionsWrapperEl) {
        if(!this.#isDisabledSelection(selection)) {
          this.#setValueFromSelection(selection);
          return this.focus();
        }
  
        this.#selectorEl.focus();
      }
    });

    this.#trap.c = addEventListener(this.#selectionsWrapperEl, 'mousemove', (event) => {
      let {clientX, clientY} = event;
      let selection = document.elementFromPoint(clientX, clientY);
      let isSelection = this.#selectionToValueLabelMap.has(selection);
      let notHovered = !selection.classList.contains(classes.selectionHovered);

      if(isSelection && notHovered) {
        this.#navigationSelection = selection;

        if(!this.#isDisabledSelection(selection)) {
          this.#activeSelection?.classList.remove(classes.selectionHovered);
          this.#potentialSelection?.classList.remove(classes.selectionHovered);
          selection.classList.add(classes.selectionHovered);
          this.#potentialSelection = selection;
        }
      }
    });
  }

  #addSelectorElListeners() {
    let unsubscribeKeydown = addEventListener(this.#selectorEl, 'keydown', ({code}) => {
      if(arrowNavigationCodes.has(code)) {
        this.classList.add(classes.dirty);
        unsubscribeKeydown();
      }
    });

    this.#selectorEl.addEventListener('focus', () => {
      this.classList.add(classes.touched);
    }, {once: true});

    this.#trap.c = addEventListener(this.#selectorEl, 'blur', () => {
      this.#selectorEl.value = defaultValue;

      if(this.#preventSelectorBlur) {
        this.#selectorEl.focus();
        this.#preventSelectorBlur = false;
      }
    });

    this.#trap.c = addEventListener(this.#selectorEl, 'focus', () => {
      if(!this.#preventSelectorBlur && this.#navigationSelection) {
        this.#navigationSelection.scrollIntoView({block: 'nearest'});

        if(this.#navigationSelection === this.#activeSelection) {
          this.#activeSelection.classList.add(classes.selectionHovered);
        }
      }
    });

    this.#trap.c = addEventListener(this.#selectorEl, 'keydown', (event) => {
      let {code} = event;

      if(code === 'Space') {
        return this.focus();
      }
      
      if(code === 'Escape') {
        this.#potentialSelection?.classList.remove(classes.selectionHovered);
        this.#potentialSelection = undefined;
        this.#navigationSelection = this.#activeSelection ?? this.#selectionsEl.children[0];
        return this.focus();
      }
      
      if(code === 'Enter') {
        if(this.#potentialSelection && this.#potentialSelection !== this.#activeSelection) {
          this.#setValueFromSelection(this.#potentialSelection);
          this.focus();
        }

        return;
      }
      
      if(arrowNavigationCodes.has(code) && this.#navigationSelection) {
        return this.#handleArrowNavigation(code);
      }
    });
  }

  #clearSelected(value) {
    this.#activeSelection?.classList.remove(classes.selectionSelected);
    this.#activeSelection?.classList.remove(classes.selectionHovered);
    this.#potentialSelection = this.#activeSelection = undefined;
    this.#navigationSelection = this.#selectionsEl.children[0];

    if(!value) {
      this.classList.remove(classes.selected);
    }

    this.#setValue(value);
  }

  #clearSelectedAndFocus(value = defaultValue) {
    this.#clearSelected(value);
    this.focus();
  }

  #handleArrowNavigation(arrowType) {
    if(this.#isBlankSelection(this.#navigationSelection) && arrowType === 'ArrowDown') {
      this.#potentialSelection = this.#navigationSelection;
      this.#navigationSelection.classList.add(classes.selectionHovered);
    } else if(!isElementVisible(this.#navigationSelection, this.#selectionsWrapperEl)) {
      this.#navigationSelection.scrollIntoView(this.#configs.scrollBehavior);
    } else {
      let siblingType = arrowToSibling[arrowType];

      if(this.#navigationSelection[siblingType]) {
        let siblingType = arrowToSibling[arrowType];
        let nextSelection = this.#navigationSelection;

        while(true) {
          nextSelection = nextSelection[siblingType];

          if(!nextSelection[siblingType]) {
            break;
          }

          if(!isElementVisible(nextSelection, this.#selectionsWrapperEl)) {
            break;
          }
    
          if(this.#isHighlightableSelection(nextSelection)) {
            break;
          }
        }
    
        if(!this.#isDisabledSelection(nextSelection)) {
          if(nextSelection !== this.#potentialSelection) {
            this.#activeSelection?.classList.remove(classes.selectionHovered);
            this.#potentialSelection?.classList.remove(classes.selectionHovered);
            nextSelection.classList.add(classes.selectionHovered);
            this.#potentialSelection = nextSelection;
          }
        }
    
        this.#navigationSelection = nextSelection;
        nextSelection.scrollIntoView(this.#configs.scrollBehavior);
      }
    }
  }

  #isBlankSelection(selection) {
    return !hasAnyClasses(selection, nonBlankClasses);
  }

  #isDisabledSelection(selection) {
    return this.#selectionToValueLabelMap.get(selection)?.configs.disabled;
  }

  #isHighlightableSelection(selection) {
    return !hasAnyClasses(selection, nonHighlightableClasses);
  }

  #isSelecteableSelection(selection) {
    return !hasAnyClasses(selection, nonSelectableClasses);
  }

  #processItems(items) {
    items = normalizeItems(items);
    this.#renderItems(items);
    this.#items = items;
  }

  #renderItems(items) {
    let selections = this.#selectionsEl;
    
    if(this.#potentialSelection) {
      var {value: potentialValue} = this.#selectionToValueLabelMap.get(this.#potentialSelection);
    }

    selections.innerHTML = '';
    this.#valueToLabelSelectionMap.clear();
    this.#selectionToValueLabelMap.clear();
    this.#potentialSelection = undefined;
    this.#navigationSelection = undefined;
    this.#activeSelection = undefined;

    for(let i = 0, {length} = items; i < length; i++) {
      let item = items[i];
      let selection = document.createElement('div');
      let [value, label, configs = {}] = item;
      let {disabled, selected} = configs;
      let valueLabelSelection = {value, label, selection, configs};

      selection.classList.add(classes.selection);

      if(disabled) {
        selection.classList.add(classes.selectionDisabled);
      }

      if(selected && !valueFromItem) {
        var valueFromItem = value;
      }

      selection.innerHTML = `<span>${label}</span>`;
      this.#valueToLabelSelectionMap.set(value, valueLabelSelection);
      this.#selectionToValueLabelMap.set(selection, valueLabelSelection);
      selections.appendChild(selection);
    }

    if(!this.#deferredValue) {
      let value = this.value || '';

      if(value && !this.#valueToLabelSelectionMap.has(value)) {
        value = '';
      }
      
      if(!value && valueFromItem) {
        value = valueFromItem;
      }

      if(this.#connected) {
        if(!this.#valueToLabelSelectionMap.has(this.#initialValue)) {
          if(value && this.#valueToLabelSelectionMap.has(value)) {
            this.#initialValue = value;
          } else {
            this.#initialValue = defaultValue;
          }
        }

        this.#setValue(value, potentialValue);
      } else if(value) {
        this.#deferredValue = value;
      } else {
        this.#setDefaultNavigationSelection();
      }
    }
  }

  #scrollIntoViewIfVisibile(selection) {
    if(this.#selectionsWrapperEl.checkVisibility({opacityProperty: true})) {
      selection.scrollIntoView({block: 'nearest'});
    }
  }

  #setDefaultNavigationSelection() {
    this.#navigationSelection = this.#selectionsEl.children[0];
  }

  #setPlaceholder() {
    this.#choiceEl.innerText = this.placeholder || defaultPlaceholder;
    this.#choiceEl.classList.add(classes.placeholder);
  }

  #setValidity() {
    if(this.value) {
      var validationObject = {};
    } else if(this.required) {
      var message = this.name + ' is required';
      validationObject = {valueMissing: true};
    }

    this._internals.setValidity(validationObject, message);
  }

  #setValue(value, potentialValue) {
    if(this.#setValueWithoutDispatch(value, potentialValue)) {
      this.dispatchEvent(new Event('change'));
    }
  }

  #setValueFromSelection(selection) {
    let {value} = this.#selectionToValueLabelMap.get(selection);
    this.#setValue(value);
  }

  #setValueWithoutDispatch(value, potentialValue) {
    if(potentialValue) {
      let record = this.#valueToLabelSelectionMap.get(potentialValue);

      if(record) {
        var {configs: potentialConfigs, selection: potentialSelection} = record;
      }
    }

    if(value) {
      let valueLabelSelection = this.#valueToLabelSelectionMap.get(value);

      if(valueLabelSelection) {
        var {label, selection} = valueLabelSelection;
        this.#choiceEl.innerText = label;
        this.#activeSelection?.classList.remove(classes.selectionSelected);
        this.#activeSelection?.classList.remove(classes.selectionHovered);
        this.#activeSelection = selection;
        this.#navigationSelection = selection;
        this.#choiceEl.classList.remove(classes.placeholder);
        this.classList.add(classes.selected);
        selection.classList.add(classes.selectionSelected);
      } else {
        return warn(`trying to select value "${value}" that does not exit`);
      }
    }

    if(!selection) {
      value = defaultValue;
      this.#setPlaceholder();
      this.classList.remove(classes.selected);
    }

    if(potentialSelection && !potentialConfigs.disabled) {
      potentialSelection.classList.add(classes.selectionHovered);
      this.#potentialSelection = potentialSelection;
      this.#navigationSelection = potentialSelection;
    } else if(selection) {
      this.#scrollIntoViewIfVisibile(selection);
    } else {
      this.#setDefaultNavigationSelection();
    }

    if(value !== this.value) {
      this.#writeValue(value);
      this.#setValidity();
      return true;
    }
  }

  #writeValue(value) {
    super.value = value;
    this._internals.setFormValue(value);
  }
}
