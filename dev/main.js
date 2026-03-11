import {defineItems, registerSimpleDropdown} from '../src';
//import '../src/simple-dropdown/simple-dropdown.css';

defineItems('1', [
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

defineItems('2', [
  ['one', 'One'], 
  ['two', 'Two'], 
  ['three', 'Three']
]);

defineItems('3', [
  ['one', 'One'],
  ['two', 'Two'],
  ['three', 'Three'],
  ['four', 'Four'],
  ['five', 'Five'],
  ['six', 'Six'],
  ['seven', 'Seven'],
  ['eight', 'Eight'],
  ['nine', 'Nine'],
  ['ten', 'Ten', {disabled: true}],
  ['eleven', 'Eleven', {disabled: true}]
]);

registerSimpleDropdown();
