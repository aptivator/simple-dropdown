export const itemsColors = [
  ['green', 'Green'],
  ['blue', 'Blue'],
  ['red', 'Red'],
  ['white', 'White'],
  ['black', 'Black']
];

export const itemsNumbers = [
  ['one', 'One'], 
  ['two', 'Two'], 
  ['three', 'Three']
];

export const itemsNumbersAllDisabled = structuredClone(itemsNumbers).map((item) => {
  return item.concat({disabled: true});
});

export const itemsNumbersWithDisabled = [
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
  ['eleven', 'Eleven', {disabled: true}]
];
