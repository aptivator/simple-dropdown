export function normalizeItems(items) {
  return items.map((item) => {
    if(Array.isArray(item)) {
      let {length} = item;

      if(length === 1) {
        return [item[0], item[0]];
      }
  
      if(length === 2 && item[1]?.constructor === Object) {
        return [item[0], item[0], item[1]];
      }
  
      return item;
    }

    return [item, item];
  });
}
