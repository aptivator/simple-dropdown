import {classes}     from '../../src/_lib/classes';
import {libraryName} from '../../src/_lib/vars';
import css           from '../../src/simple-dropdown/simple-dropdown.css?raw';

export function confirmRender(selectionsEl, items) {
  let {length} = items;

  if(length && selectionsEl.children.length === length) {
    for(let i = 0; i < length; i++) {
      let [, label, {selected, disabled} = {}] = items[i];
      let selectionEl = selectionsEl.children[i];
      let span = selectionEl.children[0];

      if(selected && !selectionEl.classList.contains(classes.selectionSelected)) {
        return;
      }

      if(disabled && !selectionEl.classList.contains(classes.selectionDisabled)) {
        return;
      }

      if(span.innerText !== label) {
        return;
      }
    }

    return true;
  }
}

export function getComponentParts(dropdownEl) {
  return {
    choiceEl: dropdownEl.querySelector(`.${classes.choice}`),
    clearerEl: dropdownEl.querySelector(`.${classes.clearer}`),
    dropdownEl,
    selectionsEl: dropdownEl.querySelector(`.${classes.selections}`),
    selectionsWrapperEl: dropdownEl.querySelector(`.${classes.selectionsWrapper}`),
    selectorEl: dropdownEl.querySelector(`.${classes.selector}`)
  };
}

export function getElementCenter(element) {
  let {left, top, width, height} = element.getBoundingClientRect();
  
  return {
    clientX: left + width / 2,
    clientY: top + height / 2
  };
}

export function interceptMessages() {
  let messages = {error: '', warning: ''};
  let {error, warn} = console;

  console.warn = (warning) => messages.warning = warning;
  console.error = () => {};

  function onError(error) {
    messages.error = error.message;
  }

  window.addEventListener('error', onError);

  function restoreOriginals() {
    Object.assign(console, {error, warn});
    window.removeEventListener('error', onError);
  }

  return {messages, restoreOriginals};
}

export function render(attributes = []) {
  let {body} = document;
  let markup = `<${libraryName}`;

  for(let attribute of attributes) {
    if(Array.isArray(attribute)) {
      let [name, value] = attribute;
      
      markup += ` ${name}="${value}"`;
    } else {
      markup += ' ' + attribute;
    }
  }

  markup += `></${libraryName}>`;
  body.innerHTML = markup;

  return getComponentParts(body.querySelector(libraryName));
}

export function renderEl(dropdownEl) {
  document.body.innerHTML = '';
  document.body.appendChild(dropdownEl);
}
