import {defineItems, registerSimpleDropdown} from '../src';

let itemsref = 'numbers-full';

let itemsrefToNext = {
  'numbers-full': 'numbers',
  'numbers': 'colors',
  'colors': 'numbers-full'
};

let toggleRequiredButton = document.getElementById('toggle-required');
let toggleDisabledButton = document.getElementById('toggle-disabled');
let toggleItemsrefButton = document.getElementById('toggle-itemsref');
let simpleDropdownValueEl = document.getElementById('simple-dropdown-value');
let formDataValueEl = document.getElementById('form-data-value');
let disabledValueEl = document.getElementById('disabled-value');
let itemsrefValueEl = document.getElementById('itemsref-value');
let requiredValueEl = document.getElementById('required-value');
let dropdownEl = document.querySelector('simple-dropdown');
let form = document.querySelector('form');

setTimeout(() => {
  disabledValueEl.innerText = dropdownEl.disabled || false;
  itemsrefValueEl.innerText = dropdownEl.itemsref;
  requiredValueEl.innerText = dropdownEl.required || false;
});

toggleRequiredButton.addEventListener('click', () => {
  dropdownEl.required = !dropdownEl.required;
  requiredValueEl.innerText = dropdownEl.required;
});

toggleDisabledButton.addEventListener('click', () => {
  dropdownEl.disabled = !dropdownEl.disabled;
  disabledValueEl.innerText = dropdownEl.disabled;
});

toggleItemsrefButton.addEventListener('click', () => {
  itemsref = itemsrefToNext[itemsref];
  dropdownEl.itemsref = itemsref;
  itemsrefValueEl.innerText = dropdownEl.itemsref;
});

dropdownEl.addEventListener('change', (evt) => {
  simpleDropdownValueEl.innerText = evt.target.value;
});

form.addEventListener('submit', (evt) => {
  let formData = new FormData(evt.target);
  formDataValueEl.innerText = formData.get('selection');
  evt.preventDefault();
});

defineItems('numbers-full', [
  ['one', 'One'],
  ['two', 'Two', {disabled: true}],
  ['three', 'Three', {disabled: true}],
  ['four', 'Four', {disabled: true}],
  ['five', 'Five', {disabled: true}],
  ['six', 'Six'],
  ['seven', 'Seven', {disabled: true}],
  ['eight', 'Eight'],
  ['nine', 'Nine'],
  ['ten', 'Ten'],
  ['eleven', 'Eleven']
]);

defineItems('numbers', [
  ['one', 'One'], 
  ['two', 'Two'], 
  ['three', 'Three']
]);

defineItems('colors', [
  ['green', 'Green'],
  ['blue', 'Blue'],
  ['red', 'Red'],
  ['white', 'White'],
  ['black', 'Black']
]);

registerSimpleDropdown();
