import {libraryName} from './vars';

let _selectionClass = `${libraryName}-selection`;
let _selectionsClass = `${_selectionClass}s`;
let _selectorClass = `${libraryName}-selector`;

export const classes = {
  choice: `${libraryName}-choice`,
  clearer: `${libraryName}-clearer`,
  dirty: `${libraryName}-dirty`,
  selector: `${libraryName}-selector`,
  placeholder: `${libraryName}-placeholder`,
  selected: `${libraryName}-selected`,
  selection: _selectionClass,
  selections: _selectionsClass,
  selectionsWrapper: `${_selectionsClass}-wrapper`,
  selectionDisabled: `${_selectionClass}-disabled`,
  selectionHovered: `${_selectionClass}-hovered`,
  selectionSelected: `${_selectionClass}-selected`,
  touched: `${libraryName}-touched`
};

export const nonBlankClasses = [
  classes.selectionDisabled, 
  classes.selectionHovered, 
  classes.selectionSelected
];

export const nonHighlightableClasses = [
  classes.selectionDisabled,
  classes.selectionHovered
];

export const nonSelectableClasses = [
  classes.selectionDisabled,
  classes.selectionSelected
];
