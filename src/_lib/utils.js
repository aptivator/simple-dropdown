import {libraryName, visibilityMargin} from './vars';

export function addEventListener(target, eventName, callback, options) {
  target.addEventListener(eventName, callback, options);
  return () => target.removeEventListener(eventName, callback);
}

export function error(message) {
  throw new Error(`${libraryName}: ${message}`);
}

export function hasAnyClasses(element, classes) {
  return classes.some((class_) => element.classList.contains(class_));
}

export function isElementVisible(element, container) {
  let {scrollTop, offsetHeight: containerHeight} = container;
  let {offsetTop, offsetHeight: elementHeight} = element;
  let elementEndY = offsetTop + elementHeight;
  let containerEndY = scrollTop + containerHeight + visibilityMargin;
  let scrollTopAdj = scrollTop - visibilityMargin;

  return scrollTopAdj <= offsetTop && elementEndY <= containerEndY;
}

export function isObject(o) {
  return o?.constructor === Object;
}

export function mergeObjects(o1, o2) {
  for(let [key, value] of Object.entries(o2)) {
    if(isObject(value)) {
      let sourceValue = o1[key];

      if(isObject(sourceValue)) {
        mergeObjects(sourceValue, value);
        continue;
      }
    }

    o1[key] = value;
  }

  return o1;
}

export function warn(message) {
  console.warn(`${libraryName}: ${message}`);
}
