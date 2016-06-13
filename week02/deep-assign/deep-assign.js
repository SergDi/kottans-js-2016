function deepAssign(target, ...sources) {
  if (target === null) throw new TypeError('not null');

  sources.forEach(source => {
    Reflect.ownKeys(source)
      .filter(key => { return source.propertyIsEnumerable(key) })
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
