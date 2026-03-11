function isObject(o) {
  return o?.constructor === Object;
}

function mergeObjects(o1, o2) {
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
