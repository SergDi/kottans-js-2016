const hasOwnProperty = Object.prototype.hasOwnProperty;
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

function deepAssign(target, ...sources) {
  if (target === null) throw new TypeError('not null');

  sources.forEach(source => {
    Reflect.ownKeys(source)
      .filter(key => { return propertyIsEnumerable.call(source, key) })
      .filter(key => { return !hasOwnProperty.call(target, key) })
      .forEach(key => {
        if (typeof source[key] === 'object' && source[key] !== null) {
          target[key] = new source[key].constructor();

          deepAssign(target[key], source[key]);
        } else {          
          target[key] = source[key];
        }
      });
  });
  return target;
}
